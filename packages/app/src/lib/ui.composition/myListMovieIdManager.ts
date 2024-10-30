import { browser } from '$app/environment';
import { StorageBlobStore } from '$lib/isomorphic.services/StorageBlobStore';
import { MyListMovieIdManager } from '$lib/ui.services/MyListMovieIdManager';

const ls = browser && localStorage !== undefined ? localStorage : (undefined as unknown as Storage);
const blobStore = new StorageBlobStore<string[]>('my-list-movie-ids', ls);
export const myListMovieIdManager = new MyListMovieIdManager(blobStore);
