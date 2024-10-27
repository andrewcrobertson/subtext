import type { DownloaderOmdb } from '$services/omdb/DownloaderOmdb';
import type { DownloaderOpenSubtitles } from '$services/openSubtitles/DownloaderOpenSubtitles';
import type { DownloaderSubdl } from '$services/subdl/DownloaderSubdl';
import type * as T from './Downloader.types';

export class DownloaderOrchestrator implements T.Downloader {
  public constructor(
    private readonly downloaderOmdb: DownloaderOmdb,
    private readonly downloaderOpenSubtitles: DownloaderOpenSubtitles,
    private readonly downloaderSubdl: DownloaderSubdl
  ) {}

  public async download(imdbId: string): Promise<T.DownloadResponse> {
    try {
      const downloadResList = await Promise.all([
        this.downloaderOmdb.download(imdbId),
        this.downloaderOpenSubtitles.download(imdbId),
        this.downloaderSubdl.download(imdbId),
      ]);

      const output: T.DownloadResponse = {
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
