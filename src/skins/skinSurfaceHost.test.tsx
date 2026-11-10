import { afterEach, describe, expect, it } from "vitest";

import { Popover } from "@/components/core/Popover";
import { Tooltip } from "@/components/core/Tooltip";
import { registerMotionRecipe, unregisterMotionRecipe } from "@/components/core/utils/slotMotion";

import { render } from "../__tests__/helpers";
import { SkinProvider } from "./skinContext";
import { registerSkin, unregisterSkin } from "./skinRegistry";

const NAME = "surface-host";
const RECIPE = "surfaceHostMark";

afterEach(() => {
  unregisterSkin(NAME);
  unregisterMotionRecipe(RECIPE);
});

describe("skin surface host", () => {
  it("plays tooltip and popover content motion on the panel that carries the skin class", () => {
    registerMotionRecipe(RECIPE, (ctx) => {
      ctx.el.setAttribute("data-motion-host", "content");
    });
    registerSkin({
      name: NAME,
      styleUrl: "skin-fixture/styles.css",
      targets: {
        "tooltip.panel": "skin-tip",
        "popover.panel": "skin-pop",
      },
      motion: {
        "tooltip.content": { mount: RECIPE },
        "popover.content": { mount: RECIPE },
      },
    });

    render(
      <SkinProvider>
        <Tooltip defaultOpen variant={NAME}>
          <Tooltip.Trigger>Hint</Tooltip.Trigger>
          <Tooltip.Content>Body</Tooltip.Content>
        </Tooltip>
        <Popover defaultOpen variant={NAME}>
          <Popover.Trigger>Open</Popover.Trigger>
          <Popover.Content>Body</Popover.Content>
        </Popover>
      </SkinProvider>,
    );

    const tip = document.querySelector(".skin-tip");
    const pop = document.querySelector(".skin-pop");
    expect(tip).not.toBeNull();
    expect(pop).not.toBeNull();
    expect(tip?.getAttribute("data-motion-host")).toBe("content");
    expect(pop?.getAttribute("data-motion-host")).toBe("content");
    expect(tip?.closest("[role=tooltip]")).not.toBe(tip);
    expect(pop?.closest("[role=dialog]")).not.toBe(pop);
  });
});
