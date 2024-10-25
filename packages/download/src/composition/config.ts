import { Config } from '../../types/Config';
import { environment } from '../config/environment';

export const config: Config = {
  gitHub: {
    token: environment.REPO_TOKEN,
    apiUrlBase: 'https://api.gitHub.com/repos/andrewcrobertson/subtext',
    uiUrlBase: 'https://github.com/andrewcrobertson/subtext',
  },
  omdb: {
    token: environment.OMDB_TOKEN,
    apiUrlBase: 'https://www.omdbapi.com',
  },
  subdl: {
    token: environment.SUBDL_TOKEN,
    apiUrlBase: 'https://api.subdl.com/api/v1/subtitles',
    zipUrlBase: 'https://dl.subdl.com',
  },
  openSubtitles: {
    token: environment.OPEN_SUBTITLES_TOKEN,
    apiUrlBase: 'https://api.opensubtitles.com/api/v1',
  },
};
