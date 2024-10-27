import type { Downloader, DownloadResponse } from '$services/downloader/Downloader.types';
import { OmdbApi } from './OmdbApi';

export class DownloaderOmdb implements Downloader {
  public constructor(private readonly omdbApi: OmdbApi) {}

  public async download(imdbId: string): Promise<DownloadResponse> {
    try {
      const searchRes = await this.omdbApi.search(imdbId);
      return {
        success: true,
        data: {
          imdbId,
          title: searchRes.title,
          posterUrl: searchRes.posterUrl,
          releaseDate: searchRes.releaseDate,
          releaseYear: searchRes.releaseYear,
          rated: searchRes.rated,
          genres: searchRes.genres,
          directors: searchRes.directors,
          writers: searchRes.writers,
          actors: searchRes.actors,
          runTimeMins: searchRes.runTimeMins,
          plot: searchRes.plot,
          subtitles: [],
        },
        errors: [],
      };
    } catch (err) {
      return { success: false, data: null, errors: [<any>err] };
    }
  }
}
