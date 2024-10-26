import { browser } from '$app/environment';

export class MyListManager {
  constructor(private readonly storageKey: string = 'MyListMovies') {}

  public add(movieId: string): void {
    const movies = this.getFromStorage();
    if (!movies.includes(movieId)) {
      movies.push(movieId);
      this.saveToStorage(movies);
    }
  }

  public remove(movieId: string): void {
    const movies = this.getFromStorage();
    const updatedMovies = movies.filter((id) => id !== movieId);
    this.saveToStorage(updatedMovies);
  }

  public isOnMyList(movieId: string): boolean {
    const movies = this.getFromStorage();
    return movies.includes(movieId);
  }

  public get(): string[] {
    return this.getFromStorage();
  }

  public clear(): void {
    if (!this.hasLocalStorage()) return;
    localStorage.removeItem(this.storageKey);
  }

  private getFromStorage(): string[] {
    if (!this.hasLocalStorage()) return [];
    const BookmarkedMovies = localStorage.getItem(this.storageKey);
    return BookmarkedMovies ? JSON.parse(BookmarkedMovies) : [];
  }

  private saveToStorage(movies: string[]): void {
    if (!this.hasLocalStorage()) return;
    localStorage.setItem(this.storageKey, JSON.stringify(movies));
  }

  private hasLocalStorage() {
    return browser && localStorage !== undefined;
  }
}
