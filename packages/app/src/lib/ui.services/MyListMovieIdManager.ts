import type { BlobStore } from '$lib/isomorphic.services/BlobStore.types';

export class MyListMovieIdManager {
  constructor(private readonly blobStore: BlobStore<string[]>) {}

  public async add(movieId: string): Promise<void> {
    const movies = await this.blobStore.get([]);
    if (movies !== null && !movies.includes(movieId)) {
      movies.push(movieId);
      await this.blobStore.set(movies);
    }
  }

  public async remove(movieId: string): Promise<void> {
    const movies = (await this.blobStore.get([])) ?? [];
    const updatedMovies = movies.filter((id) => id !== movieId);
    await this.blobStore.set(updatedMovies);
  }

  public async get(): Promise<string[]> {
    const movies = (await this.blobStore.get([])) ?? [];
    return movies;
  }
}
