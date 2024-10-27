export interface ApiSearchResponseResult {
  sd_id: number;
  type: string;
  name: string;
  imdb_id: string;
  tmdb_id: number;
  first_air_date: string;
  release_date: string;
  year: number;
}

export interface ApiSearchResponseSubtitle {
  release_name: string;
  name: string;
  lang: string;
  author: string;
  url: string;
  subtitlePage: string;
  season: number | null;
  episode: number | null;
  language: string;
  hi: boolean;
  episode_from: number | null;
  episode_end: number | number;
  full_season: boolean;
}

export interface ApiSearchResponse {
  status: boolean;
  results: ApiSearchResponseResult[];
  subtitles: ApiSearchResponseSubtitle[];
}

export interface SearchResponse {
  imdbId: string;
  title: string;
  releaseDate: string | null;
  releaseYear: number | null;
  subtitles: SearchResponseSubtitleFile[];
}

export interface SearchResponseSubtitleFileData {
  author: string | null;
  zipFileName: string;
  subtitleFileName: string;
  subtitleFileText: string;
}

export interface SearchResponseSubtitleFileOk {
  success: true;
  data: SearchResponseSubtitleFileData;
  errors: Error[];
}

export interface SearchResponseSubtitleFileFail {
  success: false;
  data: null;
  errors: Error[];
}

export type SearchResponseSubtitleFile = SearchResponseSubtitleFileOk | SearchResponseSubtitleFileFail;
