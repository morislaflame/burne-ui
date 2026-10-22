import { afterEach, describe, expect, it } from "vitest";

import { render } from "@/__tests__/helpers";
import { Button } from "@/components/core/Button";
import { SkinProvider, useSkin } from "@/skins/skinContext";
import { clearSkinsForTests, hasSkin } from "@/skins/skinRegistry";
import type { SkinDefinition } from "@/skins/skinTypes";

import { BurneUIProvider } from "./BurneUIProvider";
import { ThemeProvider } from "./ThemeProvider";

const html = document.documentElement;

const brutal: SkinDefinition = {
  name: "brutal",
  tokens: { "--radius": "0px", "--border-width": "3px" },
};

function Read() {
  const skin = useSkin();
  return <span data-testid="read" data-name={skin?.name ?? ""} />;
}

function host(name: string) {
  return document.querySelector(`[data-skin="${name}"]`) as HTMLElement | null;
}

describe("BurneUIProvider skin", () => {
  afterEach(() => {
    clearSkinsForTests();
    html.style.removeProperty("--radius");
  });

  it("writes skin tokens from BurneUIProvider", () => {
    const { getByTestId } = render(
      <BurneUIProvider toast={false} storageKey={null} skins={[brutal]} skin="brutal">
        <Read />
      </BurneUIProvider>,
    );
    expect(getByTestId("read").dataset.name).toBe("brutal");
    expect(host("brutal")?.style.getPropertyValue("--radius").trim()).toBe("0px");
    expect(host("brutal")?.style.getPropertyValue("--border-width").trim()).toBe("3px");
  });

  it("forwards the same props through ThemeProvider", () => {
    const { getByTestId } = render(
      <ThemeProvider storageKey={null} skins={[brutal]} skin={brutal}>
        <Read />
      </ThemeProvider>,
    );
    expect(getByTestId("read").dataset.name).toBe("brutal");
    expect(host("brutal")?.style.getPropertyValue("--radius").trim()).toBe("0px");
  });

  it("keeps skins in scope when skin is omitted", () => {
    const scoped: SkinDefinition = {
      ...brutal,
      targets: { "button.root": "brutal-btn" },
    };
    const { getByTestId, getByRole } = render(
      <BurneUIProvider toast={false} storageKey={null} skins={[scoped]}>
        <Read />
        <Button type="button" variant="brutal">Brutal</Button>
      </BurneUIProvider>,
    );
    expect(hasSkin("brutal")).toBe(false);
    expect(getByTestId("read").dataset.name).toBe("");
    expect(document.querySelector("[data-skin]")).toBeNull();
    expect(getByRole("button", { name: "Brutal" }).className).toContain("brutal-btn");
  });

  it("does not mount a skin host when skin props are omitted", () => {
    render(
      <BurneUIProvider toast={false} storageKey={null}>
        <Read />
      </BurneUIProvider>,
    );
    expect(document.querySelector("[data-skin]")).toBeNull();
  });

  it("restores the kit baseline under a nested skin={null}", () => {
    html.style.setProperty("--radius", "8px");
    render(
      <BurneUIProvider toast={false} storageKey={null} skins={[brutal]} skin={brutal}>
        <SkinProvider skin={null}>
          <Read />
        </SkinProvider>
      </BurneUIProvider>,
    );
    expect(host("brutal")?.style.getPropertyValue("--radius").trim()).toBe("0px");
    expect(host("none")?.style.getPropertyValue("--radius").trim()).toBe("8px");
  });
});
