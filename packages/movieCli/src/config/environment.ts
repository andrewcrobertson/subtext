import { cleanEnv, str } from 'envalid';

export const environment = cleanEnv(process.env, {
  // OMDB Config
  OMDB_TOKEN: str({}),
  // SUBDL Config
  SUBDL_TOKEN: str({}),
  // Open Subtitles Config
  OPEN_SUBTITLES_TOKEN: str({}),
});
