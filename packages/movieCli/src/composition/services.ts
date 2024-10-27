import { GetMovieHandler } from '$services/handlers/GetMovieHandler';
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

const omdbToken = config.omdb.token;
const omdbApiUrlBase = config.omdb.apiUrlBase;
const openSubtitlesToken = config.openSubtitles.token;
const openSubtitlesApiUrlBase = config.openSubtitles.apiUrlBase;
const subdlToken = config.subdl.token;
const subdlApiUrlBase = config.subdl.apiUrlBase;
const subdlZipUrlBase = config.subdl.zipUrlBase;

export const makeLogger = (verbose: boolean) => new Logger(logPrefix, verbose);
export const omdbApi = new OmdbApi(omdbApiUrlBase, omdbToken);
export const openSubtitlesApi = new OpenSubtitlesApi(openSubtitlesApiUrlBase, openSubtitlesToken);
export const subdlApi = new SubdlApi(subdlApiUrlBase, subdlZipUrlBase, subdlToken);

export const downloaderOmdb = new OmdbMovieReader(omdbApi);
export const downloaderOpenSubtitles = new OpenSubtitlesMovieReader(openSubtitlesApi);
export const downloaderSubdl = new SubdlMovieReader(subdlApi);
export const downloaderOrchestrator = new MovieReader(downloaderOmdb, downloaderOpenSubtitles, downloaderSubdl);

export const getMovieHandler = (verbose: boolean) => {
  const logger = makeLogger(verbose);
  return new GetMovieHandler(downloaderOrchestrator, logger);
};
