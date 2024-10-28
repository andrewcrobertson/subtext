import { FileManager } from '$services/fileManager/FileManager';
import type { Logger } from '$services/logger/Logger';
import type { MovieReader, ReadResponseData } from '$services/movieReader/MovieReader.types';
import { parseSrt3 } from '$utils/parseSrt';
import { isError, map, orderBy } from 'lodash';
import murmurhash from 'murmurhash';
import path from 'path';
import type * as T from './Handler.types';

export class Handler {
  public constructor(
    private readonly downloader: MovieReader,
    private readonly fileManager: FileManager,
    private readonly logger: Logger
  ) {}

  public async load({ userId, imdbId, force }: T.LoadInput) {
    this.logger.infoBlank();

    const existingMovieData = await this.fileManager.getMovieData(imdbId);
    if (!force && existingMovieData !== null) {
      this.logger.infoTitle(existingMovieData.title, imdbId);
      this.logger.infoMovieAlreadyDownloaded();
    } else {
      const readRes = await this.downloader.read(imdbId);
      const errorText = map(readRes.errors, (error) => (isError(error) ? error.message : (<any>error).toString()));

      this.logger.infoTitle(readRes.data?.title ?? 'Unknown Title', imdbId);
      for (let i = 0; i < errorText.length; i++) {
        this.logger.errorMessage(errorText[i]);
      }

      if (readRes.success) {
        const timestamp = new Date().toISOString();

        const subtitleCount = readRes.data.subtitles.length ?? 0;
        this.logger.infoMovieSubtitlesFound(subtitleCount);
        const { subtitles, movieData } = this.toMovie(imdbId, readRes.data!);

        const movieDataFile = await this.fileManager.writeMovieData(movieData, userId, timestamp);
        this.logger.infoSavedMetaFile(movieDataFile);

        if (movieData.posterFileName !== null && readRes.data.posterUrl !== null) {
          const posterFile = await this.fileManager.writePoster(imdbId, movieData.posterFileName, readRes.data.posterUrl, userId, timestamp);
          this.logger.infoSavedPosterFile(posterFile);
        }

        for (let i = 0; i < subtitles.length; i++) {
          const { subTextValue, ...data } = subtitles[i];

          const subtitleDataFile = await this.fileManager.writeSubtitleData(imdbId, data, userId, timestamp);
          this.logger.infoSavedMetaFile(subtitleDataFile);

          const subtitleFile = await this.fileManager.writeSubtitleText(imdbId, data, subTextValue, userId, timestamp);
          this.logger.infoSavedSubtitleFile(subtitleFile);
        }
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
    const moviesRaw: T.MovieIndex[] = [];
    for (let i = 0; i < movieIds.length; i++) {
      const movieId = movieIds[i];
      const movie = await this.fileManager.getMovieData(movieId);
      if (movie !== null && movie.isAvailable) {
        moviesRaw.push({
          imdbId: movie.imdbId,
          title: movie.title,
          posterFileName: movie.posterFileName,
          releaseDate: movie.releaseDate,
          releaseYear: movie.releaseYear,
          subtitleCount: movie.subtitleIds.length,
        });
      }
    }

    const moviesSorted = orderBy(moviesRaw, ['releaseDate', 'releaseYear', 'title'], ['desc', 'desc', 'asc']);
    const movies = map(moviesSorted, (m) => ({ imdbId: m.imdbId, title: m.title, posterFileName: m.posterFileName, subtitleCount: m.subtitleCount }));
    const indexFilePath = await this.fileManager.writeIndex(movies, userId, timestamp);
    this.logger.infoSavedIndexFile(indexFilePath);

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
        const subTextValue = parseSrt3(subtitleFileText);
        const subtitleId = this.generateHashFromText(subTextValue);
        const subTextFileName = `subtext.txt`;
        output.movieData.subtitleIds.push(subtitleId);
        output.subtitles.push({ subtitleId, ...subtitleRaw, subTextFileName, subTextValue });
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
