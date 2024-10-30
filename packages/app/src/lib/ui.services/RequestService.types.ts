export interface SubmitRequestOutputFoundMovie {
  imdbId: string;
  title: string;
  releaseDate: string | null;
  releaseYear: string | null;
  posterUrl: string | null;
  rated: string | null;
  genres: string[];
  directors: string[];
  writers: string[];
  actors: string[];
  runTime: number | null;
  plot: string | null;
  subtitleCount: number;
  isOnMyList: boolean;
}

export interface SubmitRequestOutputInvalidInput {
  code: 'INVALID_INPUT';
}

export interface SubmitRequestOutputUnexpectedError {
  code: 'UNEXPECTED_ERROR';
}

export interface SubmitRequestOutputAlreadyExists {
  code: 'ALREADY_EXISTS';
  movie: SubmitRequestOutputFoundMovie;
}

export interface SubmitRequestOutputRequestSubmitted {
  code: 'REQUEST_SUBMITTED';
}

export type SubmitRequestOutput =
  | SubmitRequestOutputInvalidInput
  | SubmitRequestOutputUnexpectedError
  | SubmitRequestOutputAlreadyExists
  | SubmitRequestOutputRequestSubmitted;
