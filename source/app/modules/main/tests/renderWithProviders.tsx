import MainProvider from "@app/modules/main/states/mainProvider";
import { type RenderOptions, type RenderResult, render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { MemoryRouter } from "react-router";

type ProvidersOptions = {
  initialEntries?: string[];
};

export function ProvidersWrapper({
  children,
  initialEntries = ["/"]
}: ProvidersOptions & { children: ReactNode }) {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <MainProvider>{children}</MainProvider>
    </MemoryRouter>
  );
}

// Render de RTL envuelto en MemoryRouter + MainProvider.
export function renderWithProviders(
  ui: ReactElement,
  options: ProvidersOptions & Omit<RenderOptions, "wrapper"> = {}
): RenderResult {
  const { initialEntries, ...rest } = options;
  return render(ui, {
    wrapper: ({ children }) => (
      <ProvidersWrapper initialEntries={initialEntries}>{children}</ProvidersWrapper>
    ),
    ...rest
  });
}

export * from "@testing-library/react";
