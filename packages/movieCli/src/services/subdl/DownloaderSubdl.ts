import type { Downloader, DownloadResponse } from '$services/downloader/Downloader.types';
import { SubdlApi } from './SubdlApi';

export class DownloaderSubdl implements Downloader {
  public constructor(private readonly subdlApi: SubdlApi) {}

  public async download(imdbId: string): Promise<DownloadResponse> {
    try {
      const searchRes = await this.subdlApi.search(imdbId);
      const output: DownloadResponse = {
        success: true,
        data: {
          imdbId,
          title: searchRes.title,
          posterUrl: null,
          releaseDate: searchRes.releaseDate,
          releaseYear: searchRes.releaseYear,
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

      for (let i = 0; i < searchRes.subtitles.length; i++) {
        const subtitle = searchRes.subtitles[i];
        output.errors.push(...subtitle.errors);
        if (subtitle.success) {
          output.data.subtitles.push({
            source: 'Subdl',
            author: subtitle.data.author,
            zipFileName: subtitle.data.zipFileName,
            subtitleFileName: subtitle.data.subtitleFileName,
            subtitleFileText: subtitle.data.subtitleFileText,
          });
        }
      }

      return output;
    } catch (err) {
      return { success: false, data: null, errors: [<any>err] };
    }
  }
}
