export interface ApiSearchResponseDataAttributesFile {
  file_id: number;
  cd_number: number;
  file_name: string;
}

export interface ApiSearchResponseDataAttributesRelatedLink {
  label: string;
  url: string;
  img_url: string;
}

export interface ApiSearchResponseDataAttributesFeatureDetails {
  feature_id: number;
  feature_type: string;
  year: number;
  title: string;
  movie_name: string;
  imdb_id: number;
  tmdb_id: number;
}

export interface ApiSearchResponseDataAttributesUploader {
  uploader_id: null;
  name: string;
  rank: string;
}

export interface ApiSearchResponseDataAttributes {
  subtitle_id: string;
  language: string;
  download_count: number;
  new_download_count: number;
  hearing_impaired: boolean;
  hd: boolean;
  fps: number;
  votes: number;
  ratings: number;
  from_trusted: boolean;
  foreign_parts_only: boolean;
  upload_date: string;
  file_hashes: [];
  ai_translated: boolean;
  nb_cd: number;
  slug: string;
  machine_translated: boolean;
  release: string;
  comments: string;
  legacy_subtitle_id: number;
  legacy_uploader_id: number;
  uploader: ApiSearchResponseDataAttributesUploader;
  feature_details: ApiSearchResponseDataAttributesFeatureDetails;
  url: string;
  related_links: ApiSearchResponseDataAttributesRelatedLink[];
  files: ApiSearchResponseDataAttributesFile[];
}

export interface ApiSearchResponseData {
  id: string;
  type: string;
  attributes: ApiSearchResponseDataAttributes;
}

export interface ApiSearchResponse {
  total_pages: number;
  total_count: number;
  per_page: number;
  page: number;
  data: ApiSearchResponseData[];
}

export interface ApiUrlResponse {
  link: string;
  file_name: string;
  requests: number;
  remaining: number;
  message: string;
  reset_time: string;
  reset_time_utc: string;
  uk: string;
  uid: number;
  ts: number;
}

export interface SearchResponse {
  imdbId: string;
  title: string;
  posterUrl: string | null;
  releaseDate: string | null;
  releaseYear: number | null;
  subtitles: SearchResponseSubtitleFile[];
}

export interface SearchResponseSubtitleFileData {
  author: string | null;
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
