import { last, split } from 'lodash';
import path from 'path';
import { rootDir } from '../rootDir';
import { ArgParser } from '../services/ArgParser';
import { Downloader } from '../services/Downloader';
import { GithubApi } from '../services/GithubApi';
import { Handler } from '../services/Handler';
import { Logger } from '../services/Logger';
import { OmdbManager } from '../services/OmdbManager';
import { SubdlManager } from '../services/SubdlManager';
import { getPkgMeta } from '../utils/getPkgMeta';

const gitHubUrl = 'https://api.gitHub.com/repos/andrewcrobertson/subtext';
const gitHubPublicToken = 'XYI7o6X0coQhlmoCNPrBmZSDZtZOti4LGCBs';

const pkgMeta = getPkgMeta(rootDir);
const logPrefix = last(split(pkgMeta.name, '/'));

export const makeLogger = (verbose: boolean) => new Logger(logPrefix!, verbose);
export const gitHubApi = new GithubApi(gitHubUrl, 'ghp' + '_' + gitHubPublicToken);
export const omdbManager = new OmdbManager('36145266');
export const subdlManager = new SubdlManager('LtcVJJcsmQruxW6zWkAoN4Jc_ymu7mmM', path.resolve('__zip__'));

export const handler = (verbose: boolean) => {
  const logger = makeLogger(verbose);
  return new Handler(new ArgParser(logger), new Downloader(gitHubApi, omdbManager, subdlManager, logger), logger);
};
