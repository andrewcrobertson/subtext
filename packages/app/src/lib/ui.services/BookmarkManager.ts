export class BookmarkManager {
  constructor(private readonly storageKey: string = 'BookmarkedMovies') {}

  private getBookmarkedMovies(): string[] {
    const BookmarkedMovies = localStorage.getItem(this.storageKey);
    return BookmarkedMovies ? JSON.parse(BookmarkedMovies) : [];
  }

  private saveBookmarkedMovies(movies: string[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(movies));
  }

  bookmarkMovie(movieId: string): void {
    const movies = this.getBookmarkedMovies();
    if (!movies.includes(movieId)) {
      movies.push(movieId);
      this.saveBookmarkedMovies(movies);
    }
  }

  unbookmarkMovie(movieId: string): void {
    const movies = this.getBookmarkedMovies();
    const updatedMovies = movies.filter((id) => id !== movieId);
    console.log({ movies, updatedMovies });
    this.saveBookmarkedMovies(updatedMovies);
  }

  isBookmarked(movieId: string): boolean {
    const movies = this.getBookmarkedMovies();
    return movies.includes(movieId);
  }

  getAllBookmarkedMovies(): string[] {
    return this.getBookmarkedMovies();
  }

  clearAllBookmarkedMovies(): void {
    localStorage.removeItem(this.storageKey);
  }
}
