import { DownloaderOmdb } from '$services/DownloaderOmdb';
import { DownloaderOpenSubtitles } from '$services/DownloaderOpenSubtitles';
import { DownloaderOrchestrator } from '$services/DownloaderOrchestrator';
import { DownloaderSubdl } from '$services/DownloaderSubdl';
import { GithubApi } from '$services/GithubApi';
import { Handler } from '$services/Handler';
import { Logger } from '$services/Logger';
import { OmdbApi } from '$services/OmdbApi';
import { OpenSubtitlesApi } from '$services/OpenSubtitlesApi';
import { SubdlApi } from '$services/SubdlApi';
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
export const gitHubApi = new GithubApi(gitHubApiUrlBase, gitHubUiUrlBase, gitHubPublicToken);
export const omdbApi = new OmdbApi(omdbApiUrlBase, omdbToken);
export const openSubtitlesApi = new OpenSubtitlesApi(openSubtitlesApiUrlBase, openSubtitlesToken);
export const subdlApi = new SubdlApi(subdlApiUrlBase, subdlZipUrlBase, subdlToken);

export const downloaderOmdb = new DownloaderOmdb(omdbApi);
export const downloaderOpenSubtitles = new DownloaderOpenSubtitles(openSubtitlesApi);
export const downloaderSubdl = new DownloaderSubdl(subdlApi);
export const downloaderOrchestrator = new DownloaderOrchestrator(downloaderOmdb, downloaderOpenSubtitles, downloaderSubdl);

export const handler = (verbose: boolean) => {
  const logger = makeLogger(verbose);
  return new Handler(gitHubApi, downloaderOrchestrator, logger);
};
