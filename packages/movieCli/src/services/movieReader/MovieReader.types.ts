export interface ReadResponseDataSubtitles {
  source: string;
  author: string | null;
  zipFileName: string | null;
  subtitleFileName: string;
  subtitleFileText: string;
}

export interface ReadResponseData {
  imdbId: string;
  title: string;
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
  subtitles: ReadResponseDataSubtitles[];
}

export interface ReadResponseOk {
  success: true;
  data: ReadResponseData;
  errors: Error[];
}

export interface ReadResponseFail {
  success: false;
  data: null;
  errors: Error[];
}

export type ReadResponse = ReadResponseOk | ReadResponseFail;

export interface MovieReader {
  read: (imdbId: string) => Promise<ReadResponse>;
}
