import { server } from "@/test/mocks/server";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import serverApi from "./server";
import { InvalidResponseError } from "@/shared/errors/InvalidResponseError";

const URL = 'http://localhost:3001/tasks';

describe('server', () => {
  it('throws InvalidResponseError if the response is not an array', async () => {
    server.use(
      http.get(URL, () => HttpResponse.json({})),
    );

    await expect(serverApi.getAll()).rejects.toBeInstanceOf(InvalidResponseError);
  });

  it('throws InvalidResponseError if at least one task is invalid', async () => {
    const serverTasks = [
      {
        id: '1',
        title: 'Buy milk',
        isDone: true,
      },
      {
        id: '2',
        title: 'Learn React',
        isDone: 'on',
      },
    ];
    
    server.use(
      http.get(URL, () => HttpResponse.json(serverTasks)),
    );

    await expect(serverApi.getAll()).rejects.toBeInstanceOf(InvalidResponseError);
  });

  it('throws InvalidResponseError if received by id task is invalid', async () => {
    server.use(
      http.get(URL + '/:id', () => HttpResponse.json({
        id: '1',
        title: 'Learn React',
        isDone: 'on',
      })),
    );

    await expect(serverApi.getById('1')).rejects.toBeInstanceOf(InvalidResponseError);
  });

  it('throws InvalidResponseError if received after adding task is invalid', async () => {
    server.use(
      http.post(URL, () => HttpResponse.json({
        id: '1',
        title: 'Learn React',
        isDone: 'on',
      })),
    );

    await expect(serverApi.add('Learn React')).rejects.toBeInstanceOf(InvalidResponseError);
  });
});
