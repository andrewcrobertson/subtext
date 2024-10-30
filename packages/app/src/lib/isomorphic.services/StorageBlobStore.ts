import type { BlobStore } from './BlobStore.types';

export class StorageBlobStore<T> implements BlobStore<T> {
  public constructor(
    private readonly key: string,
    private readonly storage: Storage
  ) {}

  public async get(defaultValue: T | null = null): Promise<T | null> {
    const itemRaw = this.storage.getItem(this.key);
    if (itemRaw === null) return defaultValue;

    try {
      const item: T = JSON.parse(itemRaw);
      return item;
    } catch {
      return defaultValue;
    }
  }

  public async set(value: T): Promise<void> {
    this.storage.setItem(this.key, JSON.stringify(value));
  }

  public async remove(): Promise<void> {
    this.storage.removeItem(this.key);
  }
}
