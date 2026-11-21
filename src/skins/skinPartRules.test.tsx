import { afterEach, describe, expect, it } from "vitest";

import { render } from "@/__tests__/helpers";
import { tabsIndicatorShape } from "@/components/core/Tabs/tabsStyles";
import { Button, Card } from "@/index";
import { SkinProvider } from "@/skins/skinContext";
import { bindSkinRuleClasses, parseSkinDocument, renderSkinStylesheet } from "@/skins/skinDocument";
import { registerSkin, unregisterSkin } from "@/skins/skinRegistry";

afterEach(() => {
  unregisterSkin("parts");
});

describe("skin rules on component parts", () => {
  it("accepts a motion part as a rules key and keeps it out of targets", () => {
    const parsed = parseSkinDocument({
      name: "parts",
      baseVariant: "default",
      rules: {
        "card.root": { style: { "border-radius": "20px" } },
        "card.title": { style: { "letter-spacing": "0.04em" }, hover: { color: "red" } },
      },
    });
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const bound = bindSkinRuleClasses(parsed.skin);
    expect(bound.targets?.["card.root"]).toEqual({ extend: "skin-parts-card-root" });
    expect(bound.targets?.["card.title" as "card.root"]).toBeUndefined();

    const css = renderSkinStylesheet(bound);
    expect(css).toContain(".skin-parts-card-root {");
    expect(css).toContain(':is([data-variant="parts"], [data-skin="parts"]) [data-skin-slot~="card.title"] {');
    expect(css).toContain('[data-skin-slot~="card.title"]:hover {');
  });

  it("accepts vendor-prefixed properties for gradient text", () => {
    const parsed = parseSkinDocument({
      name: "parts",
      rules: { "card.title": { style: { "-webkit-background-clip": "text", "-webkit-text-fill-color": "transparent" } } },
    });
    expect(parsed.ok).toBe(true);
  });

  it("rejects a slot the kit does not render", () => {
    const parsed = parseSkinDocument({ name: "parts", rules: { "card.nope": { style: { color: "red" } } } });
    expect(parsed.ok).toBe(false);
  });

  it("marks parts so the part selector reaches them under the skin", () => {
    registerSkin({ name: "parts", baseVariant: "default" });
    const { container } = render(
      <SkinProvider skin="parts">
        <Card>
          <Card.Header>
            <Card.Title>Plan</Card.Title>
          </Card.Header>
        </Card>
        <Button>Save</Button>
      </SkinProvider>,
    );
    const selector = (slot: string) => `:is([data-variant="parts"], [data-skin="parts"]) [data-skin-slot~="${slot}"]`;
    expect(container.querySelector(selector("card.title"))?.textContent).toBe("Plan");
    expect(container.querySelector(selector("button.root"))?.textContent).toContain("Save");
    expect(container.querySelector(selector("button.text"))).toBeTruthy();
  });
});

describe("tabs indicator shape", () => {
  it("measures a skin by its kit base", () => {
    registerSkin({ name: "parts", baseVariant: "default" });
    expect(tabsIndicatorShape("parts")).toBe("default");
    expect(tabsIndicatorShape("secondary")).toBe("secondary");
  });
});
