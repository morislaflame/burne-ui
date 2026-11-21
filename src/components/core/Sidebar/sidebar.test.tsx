import { fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { render, setReducedMotion } from "@/__tests__/helpers";
import { registerMotionRecipe, unregisterMotionRecipe } from "@/components/core/utils/slotMotion";
import { SkinProvider } from "@/skins/skinContext";
import { registerSkin, unregisterSkin } from "@/skins/skinRegistry";
import type { SkinMotionMap } from "@/skins/skinTypes";

import { Sidebar } from ".";

const SKIN_NAME = "sidebar-skin-test";
const RECIPE_NAME = "sidebarSkinHoverTest";

afterEach(() => {
  unregisterSkin(SKIN_NAME);
  unregisterMotionRecipe(RECIPE_NAME);
  setReducedMotion(false);
  vi.restoreAllMocks();
});

describe("Sidebar skin integration", () => {
  it("applies layoutTargetClass with active skin variant and binds pointerPhases for skin motion defaults", () => {
    setReducedMotion(false);
    const hoverSpy = vi.fn();
    registerMotionRecipe(RECIPE_NAME, () => {
      hoverSpy();
      return undefined;
    });
    registerSkin({
      name: SKIN_NAME,
      styleUrl: "skin-fixture/styles.css",
      targets: {
        "sidebar.root": { extend: "skin-sidebar-frame" },
      },
      motion: {
        "sidebar.root": { hoverIn: RECIPE_NAME },
      } as SkinMotionMap,
    });

    render(
      <SkinProvider skin={SKIN_NAME}>
        <Sidebar aria-label="Primary navigation">Links</Sidebar>
      </SkinProvider>,
    );

    const aside = screen.getByLabelText("Primary navigation");
    expect(aside.className).toContain("skin-sidebar-frame");

    fireEvent.pointerOver(aside);
    expect(hoverSpy).toHaveBeenCalledTimes(1);
  });
});
