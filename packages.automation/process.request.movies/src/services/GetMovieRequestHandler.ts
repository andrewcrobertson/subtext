import type { RequestHandler } from '@get-subtext/automation.process.request';
import { concat, isError, isNil, join, map } from 'lodash-es';
import { z } from 'zod';
import { Movie } from './Common.types';
import type { MovieReader, MovieWriter } from './GetMovieRequestHandler.types';

export const Data = z.object({
  userId: z.string(),
  imdbId: z.string(),
});

export class GetMovieRequestHandler implements RequestHandler {
  public constructor(
    private readonly movieReader: MovieReader,
    private readonly movieWriter: MovieWriter
  ) {}

  public async handleRequest(requestId: string, data: Record<string, any>) {
    const parsed = Data.safeParse(data);
    if (!parsed.success) throw new Error('Could not parse', { cause: parsed.error });

    const { userId, imdbId } = parsed.data;
    const readMovieRes = await this.readMovie(imdbId);
    const writeMovieRes = await this.writeMovie(userId, readMovieRes.movie);

    const gitHubComments: string[] = [];
    gitHubComments.push(`:clapper: **${readMovieRes.title}**`);

    const subtitleP11n = readMovieRes.subtitleCount === 1 ? 'subtitle' : 'subtitles';
    gitHubComments.push(`- ${readMovieRes.subtitleCount} ${subtitleP11n} found`);

    const errors = concat(readMovieRes.errors, writeMovieRes.errors);
    const errorText = map(errors, (error) => (isError(error) ? error.message : (<any>error).toString()));
    if (errorText.length > 0) {
      gitHubComments.push(``);
      gitHubComments.push(`:no_entry: **Errors**`);
      gitHubComments.push('- ' + join(errorText, '\n- '));
      gitHubComments.push(``);
    }

    return join(gitHubComments, '\n');
  }

  private async readMovie(imdbId: string) {
    const { success, data: movie, errors } = await this.movieReader.read(imdbId);
    const title = isNil(movie?.title) ? 'Unknown' : movie.title;
    const subtitleCount = isNil(movie?.subtitles) ? 0 : movie.subtitles.length;
    return { success, title, subtitleCount, movie, errors };
  }

  private async writeMovie(userId: string, movie: Movie | null) {
    if (movie === null) return { success: false, errors: [] };

    try {
      await this.movieWriter.write(userId, movie);
      return { success: true, errors: [] };
    } catch (cause) {
      return { success: false, errors: [cause] };
    }
  }
}
