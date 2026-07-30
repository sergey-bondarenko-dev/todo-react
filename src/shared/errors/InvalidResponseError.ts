export class InvalidResponseError extends Error {

  constructor(message: string) {
    super(message);

    this.name = 'InvalidResponseError';
  }
}
