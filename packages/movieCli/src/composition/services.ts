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

export const makeLogger = (verbose: boolean) => new Logger(logPrefix, verbose);
export const gitHubApi = new GitHubApi(gitHubApiUrlBase, gitHubUiUrlBase, gitHubPublicToken);
export const omdbApi = new OmdbApi(omdbApiUrlBase, omdbToken);
export const openSubtitlesApi = new OpenSubtitlesApi(openSubtitlesApiUrlBase, openSubtitlesToken);
export const subdlApi = new SubdlApi(subdlApiUrlBase, subdlZipUrlBase, subdlToken);

export const omdbMovieReader = new OmdbMovieReader(omdbApi);
export const openSubtitlesMovieReader = new OpenSubtitlesMovieReader(openSubtitlesApi);
export const subdlMovieReader = new SubdlMovieReader(subdlApi);
export const movieReader = new MovieReader(omdbMovieReader, openSubtitlesMovieReader, subdlMovieReader);

export const getHandler = (dataDir: string, verbose: boolean) => {
  const logger = makeLogger(verbose);
  const fileManager = new FileManager(dataDir);
  return new Handler(gitHubApi, movieReader, fileManager, logger);
};
