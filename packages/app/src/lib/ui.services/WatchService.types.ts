export interface LoadOutput {
  movie: LoadOutputMovie;
}

export interface LoadOutputMovie {
  imdbId: string;
  title: string;
  runTime: number | null;
  subtitles: LoadOutputSubtitle[];
}

export interface LoadOutputSubtitle {
  subtitleId: string;
  source: string;
  author: string;
  frames: LoadOutputSubtitleFrame[];
}

export interface LoadOutputSubtitleFrame {
  start: number;
  end: number;
  text: string;
}
