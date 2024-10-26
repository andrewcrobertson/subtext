import { Downloader, DownloadResponse } from '../../types/Downloader';
import { DownloaderOmdb } from './DownloaderOmdb';
import { DownloaderOpenSubtitles } from './DownloaderOpenSubtitles';
import { DownloaderSubdl } from './DownloaderSubdl';

export class DownloaderOrchestrator implements Downloader {
  public constructor(
    private readonly downloaderOmdb: DownloaderOmdb,
    private readonly downloaderOpenSubtitles: DownloaderOpenSubtitles,
    private readonly downloaderSubdl: DownloaderSubdl
  ) {}

  public async download(imdbId: string): Promise<DownloadResponse> {
    try {
      const downloadResList = await Promise.all([
        this.downloaderOmdb.download(imdbId),
        this.downloaderOpenSubtitles.download(imdbId),
        this.downloaderSubdl.download(imdbId),
      ]);

      const output: DownloadResponse = {
        success: true,
        data: {
          imdbId,
          title: null,
          posterUrl: null,
          releaseDate: null,
          releaseYear: null,
          rated: null,
          genres: [],
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
