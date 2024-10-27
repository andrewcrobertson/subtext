export interface DownloadResponseDataSubtitles {
  source: string;
  author: string | null;
  zipFileName: string | null;
  subtitleFileName: string;
  subtitleFileText: string;
}

export interface DownloadResponseData {
  imdbId: string;
  title: string | null;
  posterUrl: string | null;
  releaseDate: string | null;
  releaseYear: number | null;
  rated: string | null;
  genres: string[];
  directors: string[];
  writers: string[];
  actors: string[];
  runTimeMins: number | null;
  plot: string | null;
  subtitles: DownloadResponseDataSubtitles[];
}

export interface DownloadResponseOk {
  success: true;
  data: DownloadResponseData;
  errors: Error[];
}

export interface DownloadResponseFail {
  success: false;
  data: null;
  errors: Error[];
}

export type DownloadResponse = DownloadResponseOk | DownloadResponseFail;

export interface Downloader {
  download: (imdbId: string) => Promise<DownloadResponse>;
}
