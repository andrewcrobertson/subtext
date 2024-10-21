export interface Result {
  sd_id: number;
  type: string;
  name: string;
  imdb_id: string;
  tmdb_id: number;
  first_air_date: string;
  release_date: string;
  year: number;
}

export interface Subtitle {
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

export interface SearchResult {
  status: boolean;
  results: Result[];
  subtitles: Subtitle[];
}
