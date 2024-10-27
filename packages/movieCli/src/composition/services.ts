import { DownloaderOrchestrator } from '$services/downloader/Downloader';
import { GithubApi } from '$services/github/GithubApi';
import { Handler } from '$services/handler/Handler';
import { Logger } from '$services/logger/Logger';
import { DownloaderOmdb } from '$services/omdb/DownloaderOmdb';
import { OmdbApi } from '$services/omdb/OmdbApi';
import { DownloaderOpenSubtitles } from '$services/openSubtitles/DownloaderOpenSubtitles';
import { OpenSubtitlesApi } from '$services/openSubtitles/OpenSubtitlesApi';
import { DownloaderSubdl } from '$services/subdl/DownloaderSubdl';
import { SubdlApi } from '$services/subdl/SubdlApi';
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
