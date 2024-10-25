export interface SearchResponseDataSubtitles {
  author: string | null;
  zipFileName: string | null;
  subtitleFileName: string;
  subtitleFileText: string;
}

export interface SearchResponseData {
  imdbId: string;
  title: string | null;
  posterUrl: string | null;
  releaseDate: string | null;
  releaseYear: number | null;
  rated: string | null;
  genres: string[];
  actors: string[];
  runTimeMins: number | null;
  plot: string | null;
  subtitles: SearchResponseDataSubtitles[];
}

export interface SearchResponseOk {
  success: true;
  data: SearchResponseData;
  errors: Error[];
}

export interface SearchResponseFail {
  success: false;
  data: null;
  errors: Error[];
}

export type SearchResponse = SearchResponseOk | SearchResponseFail;
