export interface BlobStore<T> {
  get: (defaultValue: T | null) => Promise<T | null>;
  set: (value: T) => Promise<void>;
  remove: () => Promise<void>;
}
