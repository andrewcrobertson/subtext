export class PinManager {
  constructor(private readonly storageKey: string = 'pinnedMovies') {}

  private getPinnedMovies(): string[] {
    const pinnedMovies = localStorage.getItem(this.storageKey);
    return pinnedMovies ? JSON.parse(pinnedMovies) : [];
  }

  private savePinnedMovies(movies: string[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(movies));
  }

  pinMovie(movieId: string): void {
    const movies = this.getPinnedMovies();
    if (!movies.includes(movieId)) {
      movies.push(movieId);
      this.savePinnedMovies(movies);
    }
  }

  unpinMovie(movieId: string): void {
    const movies = this.getPinnedMovies();
    const updatedMovies = movies.filter((id) => id !== movieId);
    console.log({ movies, updatedMovies });
    this.savePinnedMovies(updatedMovies);
  }

  isPinned(movieId: string): boolean {
    const movies = this.getPinnedMovies();
    return movies.includes(movieId);
  }

  getAllPinnedMovies(): string[] {
    return this.getPinnedMovies();
  }

  clearAllPinnedMovies(): void {
    localStorage.removeItem(this.storageKey);
  }
}
