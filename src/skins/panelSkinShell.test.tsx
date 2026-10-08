import { afterEach, describe, expect, it } from "vitest";

import { Dialog } from "@/components/core/Dialog";
import { Drawer } from "@/components/core/Drawer";
import { render } from "@/__tests__/helpers";

import { registerSkin, unregisterSkin } from "./skinRegistry";

const NAME = "panel-layer";

afterEach(() => {
  unregisterSkin(NAME);
});

describe("panel SkinShell", () => {
  it("mounts dialog.panel layers and keeps the flex layout when the target is empty", () => {
    registerSkin({
      name: NAME,
      styleUrl: "skin-fixture/styles.css",
      targets: { "dialog.panel": "" },
      layersDeclarative: {
        "dialog.panel": {
          wrapper: { className: "skin-panel" },
          before: [{ className: "skin-shadow" }],
          content: { className: "skin-content" },
        },
      },
    });

    const { baseElement } = render(
      <Dialog defaultOpen>
        <Dialog.Panel variant={NAME}>pane</Dialog.Panel>
      </Dialog>,
    );

    const panel = baseElement.querySelector(".skin-panel");
    expect(panel).toBeTruthy();
    expect(panel?.className).toContain("flex");
    expect(panel?.className).not.toContain("bg-surface");
    expect(panel?.querySelector(".skin-shadow")).toBeTruthy();
    expect(panel?.querySelector(".skin-content")?.textContent).toContain("pane");
  });

  it("mounts drawer.panel layers when the target is empty", () => {
    registerSkin({
      name: NAME,
      styleUrl: "skin-fixture/styles.css",
      targets: { "drawer.panel": "" },
      layersDeclarative: {
        "drawer.panel": {
          wrapper: { className: "skin-panel" },
          before: [{ className: "skin-shadow" }],
          content: { className: "skin-content" },
        },
      },
    });

    const { baseElement } = render(
      <Drawer defaultOpen>
        <Drawer.Panel variant={NAME}>pane</Drawer.Panel>
      </Drawer>,
    );

    const panel = baseElement.querySelector(".skin-panel");
    expect(panel).toBeTruthy();
    expect(panel?.className).toContain("flex");
    expect(panel?.querySelector(".skin-shadow")).toBeTruthy();
    expect(panel?.querySelector(".skin-content")?.textContent).toContain("pane");
  });
});
