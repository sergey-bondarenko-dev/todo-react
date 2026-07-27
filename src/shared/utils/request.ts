import { HttpError } from "../errors/HttpError";

const ensureSuccessfulResponse = (response: Response) => {
  if (!response.ok) {
    throw new HttpError(
      response.status,
      `Request failed with status ${response.status}`,
    );
  }
}

export const requestJson = async <T>(
    url: string,
    options?: RequestInit,
): Promise<T> => {
    const response = await fetch(url, options);

    ensureSuccessfulResponse(response);

    return response.json() as Promise<T>;
}

export const requestVoid = async (
    url: string,
    options?: RequestInit,
): Promise<void> => {
    const response = await fetch(url, options);

    ensureSuccessfulResponse(response);
}
