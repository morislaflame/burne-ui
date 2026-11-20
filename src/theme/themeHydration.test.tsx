import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BurneUIProvider } from "./BurneUIProvider";
import { DEFAULT_THEME_STORAGE_KEY } from "./themeConfig";
import { useBurneTheme } from "./themeContext";

/** Shows the theme React rendered, the way a theme toggle or icon does. */
function ThemeProbe() {
  const { resolvedTheme } = useBurneTheme();
  return <span data-testid="probe">{resolvedTheme}</span>;
}

/**
 * SSR always renders the default theme: there is no localStorage on the server.
 * Hydrating that HTML must not read storage during the first render, or React
 * keeps the server markup and the tree is half dark, half light.
 */
async function hydrateWithStoredTheme(stored: "light" | "dark") {
  const tree = (
    <BurneUIProvider defaultTheme="dark" toast={false}>
      <ThemeProbe />
    </BurneUIProvider>
  );
  const html = renderToString(tree);

  window.localStorage.setItem(DEFAULT_THEME_STORAGE_KEY, stored);
  // What ThemeScript does in <head> before React loads.
  if (stored === "light") document.documentElement.setAttribute("data-theme", "light");

  const host = document.createElement("div");
  host.innerHTML = html;
  document.body.append(host);

  const recoverable: unknown[] = [];
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
  let root: ReturnType<typeof hydrateRoot> | null = null;
  await act(async () => {
    root = hydrateRoot(host, tree, { onRecoverableError: (error) => recoverable.push(error) });
  });
  const hydrationWarnings = consoleError.mock.calls.filter((call) =>
    String(call[0]).toLowerCase().includes("hydrat"),
  );
  consoleError.mockRestore();
  return { host, root: root!, recoverable, hydrationWarnings };
}

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.removeAttribute("style");
  document.body.replaceChildren();
});

describe("ThemeProvider hydration", () => {
  it("hydrates a stored light theme without a mismatch and ends up light everywhere", async () => {
    const { host, root, recoverable, hydrationWarnings } = await hydrateWithStoredTheme("light");

    expect(recoverable).toEqual([]);
    expect(hydrationWarnings).toEqual([]);
    expect(host.querySelector('[data-testid="probe"]')?.textContent).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");

    await act(async () => root.unmount());
  });

  it("keeps the dark default when storage says dark", async () => {
    const { host, root, recoverable } = await hydrateWithStoredTheme("dark");

    expect(recoverable).toEqual([]);
    expect(host.querySelector('[data-testid="probe"]')?.textContent).toBe("dark");
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);

    await act(async () => root.unmount());
  });
});
