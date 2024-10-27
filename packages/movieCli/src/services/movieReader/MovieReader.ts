import type { OmdbMovieReader } from '$services/omdb/OmdbMovieReader';
import type { OpenSubtitlesMovieReader } from '$services/openSubtitles/OpenSubtitlesMovieReader';
import type { SubdlMovieReader } from '$services/subdl/SubdlMovieReader';
import type * as T from './MovieReader.types';

export class MovieReader implements T.MovieReader {
  public constructor(
    private readonly omdbMovieReader: OmdbMovieReader,
    private readonly openSubtitlesMovieReader: OpenSubtitlesMovieReader,
    private readonly subdlMovieReader: SubdlMovieReader
  ) {}

  public async read(imdbId: string): Promise<T.ReadResponse> {
    try {
      const downloadResList = await Promise.all([
        this.omdbMovieReader.read(imdbId),
        this.openSubtitlesMovieReader.read(imdbId),
        this.subdlMovieReader.read(imdbId),
      ]);

      const output: T.ReadResponse = {
        success: true,
        data: {
          imdbId,
          title: null,
          posterUrl: null,
          releaseDate: null,
          releaseYear: null,
          rated: null,
          genres: [],
          directors: [],
          writers: [],
          actors: [],
          runTimeMins: null,
          plot: null,
          subtitles: [],
        },
        errors: [],
      };

      for (let i = 0; i < downloadResList.length; i++) {
        const downloadRes = downloadResList[i];
        output.errors.push(...downloadRes.errors);
        if (downloadRes.success) {
          output.data.title = output.data.title ?? downloadRes.data.title ?? null;
          output.data.posterUrl = output.data.posterUrl ?? downloadRes.data.posterUrl ?? null;
          output.data.releaseDate = output.data.releaseDate ?? downloadRes.data.releaseDate ?? null;
          output.data.releaseYear = output.data.releaseYear ?? downloadRes.data.releaseYear ?? null;
          output.data.rated = output.data.rated ?? downloadRes.data.rated ?? null;
          output.data.genres = output.data.genres.length === 0 ? downloadRes.data.genres : output.data.genres;
          output.data.directors = output.data.directors.length === 0 ? downloadRes.data.directors : output.data.directors;
          output.data.writers = output.data.writers.length === 0 ? downloadRes.data.writers : output.data.writers;
          output.data.actors = output.data.actors.length === 0 ? downloadRes.data.actors : output.data.actors;
          output.data.runTimeMins = output.data.runTimeMins ?? downloadRes.data.runTimeMins ?? null;
          output.data.plot = output.data.plot ?? downloadRes.data.plot ?? null;
          output.data.subtitles.push(...downloadRes.data.subtitles);
        }
      }

      return output;
    } catch (err) {
      return { success: false, data: null, errors: [<any>err] };
    }
  }
}
