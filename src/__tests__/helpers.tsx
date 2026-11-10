import { render as rtlRender, screen, type RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";

export function render(ui: ReactElement, options?: RenderOptions) {
  return {
    user: userEvent.setup(),
    ...rtlRender(ui, options),
  };
}

export function setReducedMotion(enabled: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: enabled && query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return false;
      },
    }),
  });
}

export function invalidNodes(container: HTMLElement) {
  return [...container.querySelectorAll('[aria-invalid="true"]')];
}

export function dataInvalidNodes(container: HTMLElement) {
  return [...container.querySelectorAll("[data-invalid]")];
}

/** Select has a value button + a chevron (`aria-label="Open list"`). */
export function selectValueButton() {
  return screen.getByRole("combobox");
}
