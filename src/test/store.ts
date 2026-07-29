import { configureStore } from '@reduxjs/toolkit';
import { tasksApi } from '@/entities/todo/api/tasksApi';

export const createTestStore = () => configureStore({
  reducer: {
    [tasksApi.reducerPath]: tasksApi.reducer,
  },
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware().concat(tasksApi.middleware)
  ),
});

export type TestStore = ReturnType<
  typeof createTestStore
>;
