import { SearchResponse } from '../../types/StandardDownloader';
import { OpenSubtitlesApi } from './OpenSubtitlesApi';

export class DownloaderOpenSubtitles {
  public constructor(private readonly openSubtitlesApi: OpenSubtitlesApi) {}

  public async search(imdbId: string): Promise<SearchResponse> {
    try {
      const searchRes = await this.openSubtitlesApi.search(imdbId);
      const output: SearchResponse = {
        success: true,
        data: {
          imdbId,
          title: searchRes.title,
          posterUrl: searchRes.posterUrl,
          releaseDate: searchRes.releaseDate,
          releaseYear: searchRes.releaseYear,
          rated: null,
          genres: [],
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
            author: subtitle.data.author,
            zipFileName: null,
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
