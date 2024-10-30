import type { BlobStore } from '$lib/isomorphic.services/BlobStore.types';
import { isNil } from 'lodash-es';
import { v1 as guid } from 'uuid';

export class UserIdService {
  constructor(private readonly blobStore: BlobStore<string>) {}

  public async getMyId(): Promise<string> {
    const myId = await this.blobStore.get(null);
    if (!isNil(myId)) return myId;

    const newMyId = guid();
    await this.blobStore.set(newMyId);
    return newMyId;
  }
}
