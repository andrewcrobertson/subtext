export interface OmdbSearchResponseData {
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
}

export interface OmdbSearchResponseOk {
  success: true;
  data: OmdbSearchResponseData;
  errors: Error[];
}

export interface OmdbSearchResponseFail {
  success: false;
  data: null;
  errors: Error[];
}

export type OmdbSearchResponse = OmdbSearchResponseOk | OmdbSearchResponseFail;

export interface SubdlSearchResponseData {
  imdbId: string;
  title: string | null;
  releaseDate: string | null;
  releaseYear: number | null;
  subtitles: {
    author: string | null;
    zipFileName: string;
    subtitleFileName: string;
    sha: string | null;
    subtitleFileText: string;
  }[];
}

export interface SubdlSearchResponseOk {
  success: true;
  data: SubdlSearchResponseData;
  errors: Error[];
}

export interface SubdlSearchResponseFail {
  success: false;
  data: null;
  errors: Error[];
}

export type SubdlSearchResponse = SubdlSearchResponseOk | SubdlSearchResponseFail;

export interface ToMovieResponseSubtitle {
  author: string | null;
  zipFileName: string | null;
  subtitleFileName: string | null;
  shaFileName: string | null;
}

export interface ToMovieResponse {
  imdbId: string;
  title: string | null;
  releaseDate: string | null;
  releaseYear: number | null;
  posterFileName: string | null;
  rated: string | null;
  genres: string[];
  actors: string[];
  runTime: number | null;
  plot: string | null;
  subtitles: ToMovieResponseSubtitle[];
  files: Record<string, string>;
}
