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
        "surface.root": { mount: "glossPrepare" },
        "dialog.panel": { mount: "glossPrepare" },
        "drawer.panel": { mount: "glossPrepare" },
        "tooltip.content": { mount: "glossPrepare" },
        "popover.content": { mount: "glossPrepare" },
        "expandable.root": { mount: "glossPrepare" },
        "avatar.root": { mount: "glossPrepare" },
        "toast.root": { mount: "glossPrepare" },
        "tabs.list": { mount: "glossPrepare" },
        "table.root": { mount: "glossPrepare" },
        "calendar.root": { mount: "glossPrepare" },
        "selectionIndicator.root": { mount: "glossPrepare" },
      },
    });

    expect(mountOf(resolveSurfaceMotionDefaults(NAME), "root")).toBe("glossPrepare");
    expect(mountOf(resolveDialogMotionDefaults(NAME), "panel")).toBe("glossPrepare");
    expect(resolveDialogMotionDefaults(NAME).panel?.enter).toBe("modalPanelEnter");
    expect(mountOf(resolveDrawerMotionDefaults(NAME), "panel")).toBe("glossPrepare");
    expect(mountOf(resolveTooltipMotionDefaults(NAME), "content")).toBe("glossPrepare");
    expect(mountOf(resolvePopoverMotionDefaults(NAME), "content")).toBe("glossPrepare");
    expect(mountOf(resolveExpandableMotionDefaults(NAME), "root")).toBe("glossPrepare");
    expect(mountOf(resolveAvatarMotionDefaults(NAME), "root")).toBe("glossPrepare");
    expect(mountOf(resolveToastMotionDefaults(NAME), "root")).toBe("glossPrepare");
    expect(mountOf(resolveTabsMotionDefaults(NAME), "list")).toBe("glossPrepare");
    expect(mountOf(resolveTableMotionDefaults(NAME), "root")).toBe("glossPrepare");
    expect(mountOf(resolveCalendarMotionDefaults(NAME), "root")).toBe("glossPrepare");
    expect(mountOf(resolveSelectionIndicatorMotionDefaults(NAME), "root")).toBe("glossPrepare");
  });

  it("leaves kit defaults when the variant is a kit name", () => {
    registerSkin({
      name: NAME,
      styleUrl: "skin-fixture/styles.css",
      motion: { "dialog.panel": { mount: "glossPrepare" } },
    });

    expect(mountOf(resolveDialogMotionDefaults("default"), "panel")).toBeUndefined();
    expect(resolveDialogMotionDefaults("default").panel?.enter).toBe("modalPanelEnter");
  });
});
