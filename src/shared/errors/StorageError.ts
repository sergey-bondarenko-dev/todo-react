export type StorageErrorReason =
  | 'quota-exceeded'
  | 'unavailable';

export class StorageError extends Error {
    constructor(
        public readonly reason: StorageErrorReason,
        options?: ErrorOptions,
    ) {
        super('Unable to write to localStorage', options);
        this.name = 'StorageError';
    }
}
