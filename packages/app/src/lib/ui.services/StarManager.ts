export class StarManager {
  constructor(private readonly storageKey: string = 'StarredMovies') {}

  private getStarredMovies(): string[] {
    const StarredMovies = localStorage.getItem(this.storageKey);
    return StarredMovies ? JSON.parse(StarredMovies) : [];
  }

  private saveStarredMovies(movies: string[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(movies));
  }

  starMovie(movieId: string): void {
    const movies = this.getStarredMovies();
    if (!movies.includes(movieId)) {
      movies.push(movieId);
      this.saveStarredMovies(movies);
    }
  }

  unstarMovie(movieId: string): void {
    const movies = this.getStarredMovies();
    const updatedMovies = movies.filter((id) => id !== movieId);
    console.log({ movies, updatedMovies });
    this.saveStarredMovies(updatedMovies);
  }

  isStarred(movieId: string): boolean {
    const movies = this.getStarredMovies();
    return movies.includes(movieId);
  }

  getAllStarredMovies(): string[] {
    return this.getStarredMovies();
  }

  clearAllStarredMovies(): void {
    localStorage.removeItem(this.storageKey);
  }
}
