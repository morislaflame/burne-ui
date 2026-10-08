import { afterEach, describe, expect, it } from "vitest";

import { render } from "@/__tests__/helpers";
import { registerSkin, unregisterSkin } from "@/skins/skinRegistry";

import { Surface } from "./Surface";

const LAYER = {
  name: "surface-layer",
  styleUrl: "skin-fixture/styles.css",
  layersDeclarative: {
    "surface.root": {
      wrapper: { className: "skin-panel skin-wrap" },
      before: [{ className: "skin-shadow" }],
      content: { className: "skin-content" },
    },
  },
};

afterEach(() => {
  unregisterSkin("surface-layer");
});

describe("Surface SkinShell", () => {
  it("mounts layersDeclarative for surface.root", () => {
    registerSkin(LAYER);

    const { container } = render(<Surface variant="surface-layer">pane</Surface>);

    const panel = container.querySelector(".skin-panel");
    expect(panel).toBeTruthy();
    expect(panel?.querySelector(".skin-shadow")).toBeTruthy();
    expect(panel?.querySelector(".skin-content")?.textContent).toBe("pane");
  });

  it("does not mount layers when variant is default", () => {
    registerSkin(LAYER);

    const { container } = render(<Surface variant="default">plain</Surface>);

    expect(container.querySelector(".skin-shadow")).toBeNull();
    expect(container.querySelector(".skin-content")).toBeNull();
    expect(container).toHaveTextContent("plain");
  });
});
