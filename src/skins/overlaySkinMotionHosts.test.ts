import { afterEach, describe, expect, it } from "vitest";

import { resolveAvatarMotionDefaults } from "@/components/core/Avatar/avatarAnimations";
import { resolveCalendarMotionDefaults } from "@/components/core/Calendar/calendarAnimations";
import { resolveDialogMotionDefaults } from "@/components/core/Dialog/dialogAnimations";
import { resolveDrawerMotionDefaults } from "@/components/core/Drawer/drawerAnimations";
import { resolveExpandableMotionDefaults } from "@/components/core/Expandable/expandableAnimations";
import { resolvePopoverMotionDefaults } from "@/components/core/Popover/popoverAnimations";
import { resolveSelectionIndicatorMotionDefaults } from "@/components/core/SelectionIndicator/selectionIndicatorAnimations";
import { resolveSurfaceMotionDefaults } from "@/components/core/Surface/surfaceAnimations";
import { resolveTableMotionDefaults } from "@/components/core/Table/tableAnimations";
import { resolveTabsMotionDefaults } from "@/components/core/Tabs/tabsAnimations";
import { resolveToastMotionDefaults } from "@/components/core/Toast/toastMotionDefaults";
import { resolveTooltipMotionDefaults } from "@/components/core/Tooltip/tooltipAnimations";

import { registerSkin, unregisterSkin } from "./skinRegistry";

const NAME = "motion-hosts";

function mountOf(motion: object, slot: string): unknown {
  const part = (motion as Record<string, { mount?: unknown } | undefined>)[slot];
  return part?.mount;
}

afterEach(() => {
  unregisterSkin(NAME);
});

describe("overlaySkinMotion hosts", () => {
  it("copies a skin mount recipe onto the live slot", () => {
    registerSkin({
      name: NAME,
      styleUrl: "skin-fixture/styles.css",
      motion: {
        "surface.root": { mount: "gloss:prepare" },
        "dialog.panel": { mount: "gloss:prepare" },
        "drawer.panel": { mount: "gloss:prepare" },
        "tooltip.content": { mount: "gloss:prepare" },
        "popover.content": { mount: "gloss:prepare" },
        "expandable.root": { mount: "gloss:prepare" },
        "avatar.root": { mount: "gloss:prepare" },
        "toast.root": { mount: "gloss:prepare" },
        "tabs.list": { mount: "gloss:prepare" },
        "table.root": { mount: "gloss:prepare" },
        "calendar.root": { mount: "gloss:prepare" },
        "selectionIndicator.root": { mount: "gloss:prepare" },
      },
    });

    expect(mountOf(resolveSurfaceMotionDefaults(NAME), "root")).toBe("gloss:prepare");
    expect(mountOf(resolveDialogMotionDefaults(NAME), "panel")).toBe("gloss:prepare");
    expect(resolveDialogMotionDefaults(NAME).panel?.enter).toBe("modalPanelEnter");
    expect(mountOf(resolveDrawerMotionDefaults(NAME), "panel")).toBe("gloss:prepare");
    expect(mountOf(resolveTooltipMotionDefaults(NAME), "content")).toBe("gloss:prepare");
    expect(mountOf(resolvePopoverMotionDefaults(NAME), "content")).toBe("gloss:prepare");
    expect(mountOf(resolveExpandableMotionDefaults(NAME), "root")).toBe("gloss:prepare");
    expect(mountOf(resolveAvatarMotionDefaults(NAME), "root")).toBe("gloss:prepare");
    expect(mountOf(resolveToastMotionDefaults(NAME), "root")).toBe("gloss:prepare");
    expect(mountOf(resolveTabsMotionDefaults(NAME), "list")).toBe("gloss:prepare");
    expect(mountOf(resolveTableMotionDefaults(NAME), "root")).toBe("gloss:prepare");
    expect(mountOf(resolveCalendarMotionDefaults(NAME), "root")).toBe("gloss:prepare");
    expect(mountOf(resolveSelectionIndicatorMotionDefaults(NAME), "root")).toBe("gloss:prepare");
  });

  it("leaves kit defaults when the variant is a kit name", () => {
    registerSkin({
      name: NAME,
      styleUrl: "skin-fixture/styles.css",
      motion: { "dialog.panel": { mount: "gloss:prepare" } },
    });

    expect(mountOf(resolveDialogMotionDefaults("default"), "panel")).toBeUndefined();
    expect(resolveDialogMotionDefaults("default").panel?.enter).toBe("modalPanelEnter");
  });
});
