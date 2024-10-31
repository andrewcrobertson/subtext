import { FileManager } from '$services/fileManager/FileManager';
import { GitHubApi } from '$services/github/GitHubApi';
import { Handler } from '$services/handlers/Handler';
import { Logger } from '$services/logger/Logger';
import { MovieReader } from '$services/movieReader/MovieReader';
import { OmdbApi } from '$services/omdb/OmdbApi';
import { OmdbMovieReader } from '$services/omdb/OmdbMovieReader';
import { OpenSubtitlesApi } from '$services/openSubtitles/OpenSubtitlesApi';
import { OpenSubtitlesMovieReader } from '$services/openSubtitles/OpenSubtitlesMovieReader';
import { SubdlApi } from '$services/subdl/SubdlApi';
import { SubdlMovieReader } from '$services/subdl/SubdlMovieReader';
import { getPkgMeta } from '$utils/getPkgMeta';
import { createRequestProcessor } from '@get-subtext/automation.process.request';
import { createRequestGateway } from '@get-subtext/automation.process.request.github';
import { createRequestHandler, Movie, MovieWriter } from '@get-subtext/automation.process.request.movies';
import murmurhash from 'murmurhash';
import path from 'path';

import { ToMovieResponse } from '$services/handlers/Handler.types';
import { parseSrt3 } from '$utils/parseSrt';
import { last, split } from 'lodash';
import { rootDir } from '../rootDir';
import { config } from './config';

const pkgMeta = getPkgMeta(rootDir);
const logPrefix = <string>last(split(pkgMeta.name, '/'));

const gitHubPublicToken = config.gitHub.token;
const gitHubApiUrlBase = config.gitHub.apiUrlBase;
const gitHubUiUrlBase = config.gitHub.uiUrlBase;
const omdbToken = config.omdb.token;
const omdbApiUrlBase = config.omdb.apiUrlBase;
const openSubtitlesToken = config.openSubtitles.token;
const openSubtitlesApiUrlBase = config.openSubtitles.apiUrlBase;
const subdlToken = config.subdl.token;
const subdlApiUrlBase = config.subdl.apiUrlBase;
const subdlZipUrlBase = config.subdl.zipUrlBase;

class TempMovieWriter implements MovieWriter {
  public constructor(private readonly fileManager: FileManager) {}
  public async write(userId: string, movie: Movie) {
    const timestamp = new Date().toISOString();
    const { subtitles, movieData } = this.toMovie(movie);

    const movieDataFile = await this.fileManager.writeMovieData(movieData, userId, timestamp);

    if (movieData.posterFileName !== null && movie.posterUrl !== null) {
      const posterFile = await this.fileManager.writePoster(movieData.imdbId, movieData.posterFileName, movie.posterUrl, userId, timestamp);
    }

    for (let i = 0; i < subtitles.length; i++) {
      const { subtextValue, ...data } = subtitles[i];
      const subtitleDataFile = await this.fileManager.writeSubtitleData(movie.imdbId, data, userId, timestamp);
      const subtitleFile = await this.fileManager.writeSubtitleText(movie.imdbId, data, subtextValue, userId, timestamp);
    }
  }
  private toMovie(data: Movie): ToMovieResponse {
    const posterFileName = data.posterUrl === null ? null : `poster${path.parse(path.basename(data.posterUrl)).ext}`;

    const output: ToMovieResponse = {
      movieData: {
        imdbId: data.imdbId,
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

export const makeLogger = (verbose: boolean) => new Logger(logPrefix, verbose);
export const gitHubApi = new GitHubApi(gitHubApiUrlBase, gitHubUiUrlBase, gitHubPublicToken);
export const omdbApi = new OmdbApi(omdbApiUrlBase, omdbToken);
export const openSubtitlesApi = new OpenSubtitlesApi(openSubtitlesApiUrlBase, openSubtitlesToken);
export const subdlApi = new SubdlApi(subdlApiUrlBase, subdlZipUrlBase, subdlToken);

export const omdbMovieReader = new OmdbMovieReader(omdbApi);
export const openSubtitlesMovieReader = new OpenSubtitlesMovieReader(openSubtitlesApi);
export const subdlMovieReader = new SubdlMovieReader(subdlApi);

export const getHandler = (dataDir: string, verbose: boolean) => {
  const logger = makeLogger(verbose);
  const fileManager = new FileManager(dataDir);
  const requestGateway = createRequestGateway({ apiUrlBase: gitHubApiUrlBase, token: gitHubPublicToken, label: 'subtext-bot' });
  const movieReader = new MovieReader(omdbMovieReader, openSubtitlesMovieReader, subdlMovieReader);
  const movieWriter = new TempMovieWriter(fileManager);
  const movieRequestHandler = createRequestHandler({ movieReader, movieWriter });
  const requestHandlers = { REQUEST_MOVIE: movieRequestHandler };
  const requestProcessor = createRequestProcessor({ separator: '===', requestGateway, requestHandlers });
  return new Handler(requestProcessor, gitHubApi, movieReader, fileManager, logger);
};
