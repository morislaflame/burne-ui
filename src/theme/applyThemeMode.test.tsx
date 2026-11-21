import { act, useState } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";

import { burneLightThemePortalProps } from "@/components/core/utils/burneLightTheme";

import { applyThemeMode, ThemeProvider } from "./ThemeProvider";

afterEach(() => {
  document.documentElement.removeAttribute("data-theme");
  document.body.replaceChildren();
});

describe("applyThemeMode", () => {
  it("leaves <html> without an attribute in dark mode", () => {
    document.documentElement.setAttribute("data-theme", "light");
    applyThemeMode("dark", document.documentElement);
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
  });

  it("sets data-theme=dark on a nested root inside a light page", () => {
    const island = document.createElement("div");
    document.body.append(island);
    applyThemeMode("light", document.documentElement);
    applyThemeMode("dark", island);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(island.getAttribute("data-theme")).toBe("dark");
  });
});

describe("portal theme attribute", () => {
  it("copies a nested dark island and leaves the document theme alone", () => {
    document.documentElement.setAttribute("data-theme", "light");
    const island = document.createElement("section");
    island.setAttribute("data-theme", "dark");
    const trigger = document.createElement("button");
    island.append(trigger);
    document.body.append(island);
    expect(burneLightThemePortalProps(trigger)).toEqual({ "data-theme": "dark" });
    expect(burneLightThemePortalProps(document.body)).toEqual({});
  });
});

function NestedDark({ root }: { root: HTMLElement | null }) {
  return (
    <ThemeProvider theme="dark" root={root} storageKey={null}>
      <span>island</span>
    </ThemeProvider>
  );
}

describe("ThemeProvider nested root", () => {
  it("writes data-theme=dark on the island while the page stays light", async () => {
    applyThemeMode("light");
    const host = document.createElement("div");
    document.body.append(host);
    const root = createRoot(host);
    function Harness() {
      const [island, setIsland] = useState<HTMLDivElement | null>(null);
      return (
        <div ref={setIsland}>
          {island ? <NestedDark root={island} /> : null}
        </div>
      );
    }
    await act(async () => {
      root.render(<Harness />);
    });
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(host.querySelector("div")?.getAttribute("data-theme")).toBe("dark");
    await act(async () => {
      root.unmount();
    });
  });
});
