import { FileManager } from '$services/fileManager/FileManager';
import type { GitHubApi } from '$services/github/GitHubApi';
import type { Logger } from '$services/logger/Logger';
import type { MovieReader, ReadResponseData } from '$services/movieReader/MovieReader.types';
import { parseSrt3 } from '$utils/parseSrt';
import { isError, join, map, orderBy } from 'lodash';
import murmurhash from 'murmurhash';
import path from 'path';
import type * as T from './Handler.types';

export class Handler {
  public constructor(
    private readonly gitHubApi: GitHubApi,
    private readonly downloader: MovieReader,
    private readonly fileManager: FileManager,
    private readonly logger: Logger
  ) {}

  public async load({ userId, imdbId: gitHubIssueNumber, force }: T.LoadInput) {
    const gitHubComments: string[] = [];
    this.logger.infoBlank();

    const issue = await this.gitHubApi.getIssue(<any>gitHubIssueNumber);
    const imdbId = issue.title;

    const existingMovieData = await this.fileManager.getMovieData(imdbId);
    if (!force && existingMovieData !== null) {
      this.logger.infoTitle(existingMovieData.title, imdbId);
      this.logger.infoMovieAlreadyDownloaded();
      gitHubComments.push(`:clapper: **${existingMovieData.title}**`);
      gitHubComments.push(`- Already downloaded`);

      await this.gitHubApi.addComment(<any>gitHubIssueNumber, join(gitHubComments, '\n'));
      await this.gitHubApi.close(<any>gitHubIssueNumber);
    } else {
      const readRes = await this.downloader.read(imdbId);
      const errorText = map(readRes.errors, (error) => (isError(error) ? error.message : (<any>error).toString()));

      const title = readRes.data?.title ?? 'Unknown Title';
      this.logger.infoTitle(title, imdbId);
      gitHubComments.push(`:clapper: **${title}**`);

      for (let i = 0; i < errorText.length; i++) {
        this.logger.errorMessage(errorText[i]);
      }

      if (readRes.success) {
        const timestamp = new Date().toISOString();

        const subtitleCount = readRes.data.subtitles.length ?? 0;
        const subtitleP11n = subtitleCount === 1 ? 'subtitle' : 'subtitles';
        this.logger.infoMovieSubtitlesFound(subtitleCount);
        gitHubComments.push(`- ${subtitleCount} ${subtitleP11n} found`);
        const { subtitles, movieData } = this.toMovie(imdbId, readRes.data!);

        if (errorText.length > 0) {
          gitHubComments.push(``);
          gitHubComments.push(`:no_entry: **Errors**`);
          gitHubComments.push('- ' + join(errorText, '\n- '));
          gitHubComments.push(``);
        }

        const movieDataFile = await this.fileManager.writeMovieData(movieData, userId, timestamp);
        this.logger.infoSavedMetaFile(movieDataFile);

        if (movieData.posterFileName !== null && readRes.data.posterUrl !== null) {
          const posterFile = await this.fileManager.writePoster(imdbId, movieData.posterFileName, readRes.data.posterUrl, userId, timestamp);
          this.logger.infoSavedPosterFile(posterFile);
        }

        for (let i = 0; i < subtitles.length; i++) {
          const { subtextValue, ...data } = subtitles[i];

          const subtitleDataFile = await this.fileManager.writeSubtitleData(imdbId, data, userId, timestamp);
          this.logger.infoSavedMetaFile(subtitleDataFile);

          const subtitleFile = await this.fileManager.writeSubtitleText(imdbId, data, subtextValue, userId, timestamp);
          this.logger.infoSavedSubtitleFile(subtitleFile);
        }

        await this.gitHubApi.addComment(<any>gitHubIssueNumber, join(gitHubComments, '\n'));
        await this.gitHubApi.close(<any>gitHubIssueNumber);
      } else {
      }
    }

    this.logger.infoBlank();
  }

  public async remove({ userId, imdbId }: T.RemoveInput) {
    this.logger.infoBlank();
    this.logger.infoStarting();

    const timestamp = new Date().toISOString();
    const movieDir = await this.fileManager.removeMovieData(imdbId, userId, timestamp);
    this.logger.infoRemovedMovieDir(movieDir);

    this.logger.infoBlank();
  }

  public async flag({ imdbId, subtitleId }: T.FlagInput) {
    this.logger.infoBlank();
    this.logger.infoStarting();
    this.logger.infoBlank();
  }

  public async index({ userId }: T.IndexInput) {
    this.logger.infoBlank();
    this.logger.infoStarting();
    const timestamp = new Date().toISOString();

    const movieIds = await this.fileManager.getAllMovieIds();

    const moviesRaw: T.MovieIndexRaw[] = [];
    for (let i = 0; i < movieIds.length; i++) {
      const movieId = movieIds[i];
      const movie = await this.fileManager.getMovieData(movieId);
      if (movie !== null && movie.isAvailable) {
        moviesRaw.push({
          imdbId: movie.imdbId,
          title: movie.title,
          releaseDate: movie.releaseDate,
          releaseYear: movie.releaseYear,
        });
      }
    }

    const moviesSorted = orderBy(moviesRaw, ['releaseDate', 'releaseYear', 'title'], ['desc', 'desc', 'asc']);
    const imdbIds = map(moviesSorted, (m) => m.imdbId);
    const itemsPerPage = 100;
    const pageCount = Math.ceil(moviesSorted.length / itemsPerPage);

    await this.fileManager.deleteAllQueries();
    for (let i = 0; i < pageCount; i++) {
      const start = i * itemsPerPage;
      const end = start + itemsPerPage;
      const pageIds = imdbIds.slice(start, end);
      const queryIndex: T.QueryIndex = { pageNumber: i + 1, pageCount: pageCount, imdbIds: pageIds };

      const indexFilePath = await this.fileManager.writeQueryIndex(queryIndex, userId, timestamp);
      this.logger.infoSavedIndexFile(indexFilePath);
    }

    this.logger.infoBlank();
  }

  private toMovie(imdbId: string, data: ReadResponseData): T.ToMovieResponse {
    const posterFileName = data.posterUrl === null ? null : `poster${path.parse(path.basename(data.posterUrl)).ext}`;

    const output: T.ToMovieResponse = {
      movieData: {
        imdbId,
        title: data.title,
        releaseDate: data.releaseDate,
        releaseYear: data.releaseYear,
        posterFileName,
        rated: data.rated,
        genres: data.genres,
        directors: data.directors,
        writers: data.writers,
        actors: data.actors,
        runTime: data.runTimeMins,
        plot: data.plot,
        subtitleIds: [],
      },
      subtitles: [],
    };

    const subtitlesRaw = data.subtitles ?? [];
    for (let i = 0; i < subtitlesRaw.length; i++) {
      const { subtitleFileText, ...subtitleRaw } = subtitlesRaw[i];
      const ext = path.parse(path.basename(subtitleRaw.subtitleFileName)).ext;
      if (ext === '.srt') {
        const subtextValue = parseSrt3(subtitleFileText);
        const subtitleId = this.generateHashFromText(subtextValue);
        const subtextFileName = `subtext.txt`;
        output.movieData.subtitleIds.push(subtitleId);
        output.subtitles.push({ subtitleId, ...subtitleRaw, subtextFileName, subtextValue });
      }
    }

    return output;
  }

  private generateHashFromText(fileContent: string): string {
    const hash = murmurhash.v3(fileContent);
    return hash.toString(16);
    // const hash = createHash('sha256');
    // hash.update(fileContent);
    // return hash.digest('hex');
  }
}
