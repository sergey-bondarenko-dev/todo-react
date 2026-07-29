import type { ReactElement } from "react";
import { createTestStore } from "./store";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";

export const renderWithProviders = (ui: ReactElement) => {
  const store = createTestStore();

  const renderResult = render(
    <Provider store={store}>
      {ui}
    </Provider>
  );

  return {
    store,
    ...renderResult,
  };
}
