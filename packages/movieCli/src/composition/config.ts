import { environment } from '$config/environment';
import type { Config } from './config.types';

export const config: Config = {
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
