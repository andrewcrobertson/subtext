export interface ApiSearchResponseRating {
  Source: string;
  Value: string;
}

export interface ApiSearchResponse {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: ApiSearchResponseRating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

export interface SearchResponse {
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
