import type { RequestHandler } from '@get-subtext/automation.process.request';
import { isError, join, map } from 'lodash-es';
import { z } from 'zod';
import type { MovieReader } from './GetMovieRequestHandler.types';

export const Data = z.object({
  userId: z.string(),
  imdbId: z.string(),
});

export class GetMovieRequestHandler implements RequestHandler {
  public constructor(private readonly movieReader: MovieReader) {}

  public async handleRequest(requestId: string, data: Record<string, any>) {
    const parsed = Data.safeParse(data);
    if (!parsed.success) throw new Error('Could not parse', { cause: parsed.error });

    const gitHubComments: string[] = [];
    const { userId, imdbId } = parsed.data;

    const readRes = await this.movieReader.read(imdbId);
    if (readRes.success) {
      const title = readRes.data.title;
      gitHubComments.push(`:clapper: **${title}**`);

      const subtitleCount = readRes.data.subtitles.length ?? 0;
      const subtitleP11n = subtitleCount === 1 ? 'subtitle' : 'subtitles';
      gitHubComments.push(`- ${subtitleCount} ${subtitleP11n} found`);
    } else {
      gitHubComments.push(`:clapper: **Unknown**`);
      gitHubComments.push(`- 0 subtitles found`);
    }

    const errorText = map(readRes.errors, (error) => (isError(error) ? error.message : (<any>error).toString()));
    if (errorText.length > 0) {
      gitHubComments.push(``);
      gitHubComments.push(`:no_entry: **Errors**`);
      gitHubComments.push('- ' + join(errorText, '\n- '));
      gitHubComments.push(``);
    }

    return join(gitHubComments, '\n');
  }
}
