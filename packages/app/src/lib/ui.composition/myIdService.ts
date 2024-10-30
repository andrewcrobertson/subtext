import { browser } from '$app/environment';
import { StorageBlobStore } from '$lib/isomorphic.services/StorageBlobStore';
import { UserIdService } from '$lib/ui.services/UserIdService';

const ls = browser && localStorage !== undefined ? localStorage : (undefined as unknown as Storage);
const blobStore = new StorageBlobStore<string>('my-id', ls);

export const userIdService = new UserIdService(blobStore);
