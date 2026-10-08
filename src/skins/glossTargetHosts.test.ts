import { afterEach, describe, expect, it } from "vitest";

import { avatarRootClass } from "@/components/core/Avatar/avatarStyles";
import { ALERT_DIALOG_SIZE, alertDialogPanelClass } from "@/components/composite/AlertDialog/alertDialogStyles";
import { buttonGroupRootClass } from "@/components/composite/ButtonGroup/buttonGroupStyles";
import { closeButtonRootClass } from "@/components/core/CloseButton/closeButtonStyles";
import { dropdownSubContentClass } from "@/components/core/Dropdown/dropdownStyles";
import { listBoxRootClass } from "@/components/core/ListBox/listBoxStyles";
import { popoverArrowClass, popoverDefaultPanelClass } from "@/components/core/Popover/popoverStyles";
import {
  selectionIndicatorFillClass,
  selectionIndicatorVariantClass,
} from "@/components/core/SelectionIndicator/selectionIndicatorStyles";
import { toggleButtonRootClass } from "@/components/core/ToggleButton/toggleButtonStyles";
import { tooltipPanelClass } from "@/components/core/Tooltip/tooltipStyles";

import { registerSkin, unregisterSkin } from "./skinRegistry";

const NAME = "gloss-targets";

const GLOSS_PANEL = "gloss-panel border-0 text-foreground";
const GLOSS_PANEL_DEEP = "gloss-panel gloss-deep border-0 text-foreground";

afterEach(() => {
  unregisterSkin(NAME);
});

describe("gloss target hosts", () => {
  it("paints glass classes and keeps layout", () => {
    registerSkin({
      name: NAME,
      styleUrl: "skin-fixture/styles.css",
      targets: {
        "closeButton.root": "gloss-btn origin-center",
        "toggleButton.root": "gloss-btn",
        "avatar.root": "rounded-full gloss-panel border-0",
        "alertDialog.panel": GLOSS_PANEL_DEEP,
        "popover.panel": GLOSS_PANEL_DEEP,
        "popover.arrow": "border-0 bg-[var(--color-surface)]",
        "tooltip.panel": GLOSS_PANEL,
        "dropdown.subPopover": GLOSS_PANEL_DEEP,
        "listBox.root": "gloss-panel gloss-deep rounded-large p-mid",
        "buttonGroup.root": "gloss-panel border-0",
        "toggleButtonGroup.root": "gloss-panel border-0",
        "selectionIndicator.root": "gloss-indicator border-0 [--border-width:0px]",
        "selectionIndicator.fill": "gloss-indicator-fill",
      },
    });

    const close = closeButtonRootClass({ variant: NAME, size: "base", disabled: false });
    expect(close).toContain("gloss-btn");
    expect(close).toContain("rounded-full");
    expect(close).toContain("focus-ring");

    const toggle = toggleButtonRootClass({
      variant: NAME,
      pressed: false,
      disabled: false,
      size: "base",
      groupSegment: undefined,
    });
    expect(toggle).toContain("gloss-btn");
    expect(toggle).toContain("focus-ring");

    const avatar = avatarRootClass("base", NAME);
    expect(avatar).toContain("gloss-panel");
    expect(avatar).toContain("rounded-full");
    expect(avatar).toContain("avatar-size-base");
    expect(avatar).not.toContain("bg-surface");

    const dialog = alertDialogPanelClass({
      variant: NAME,
      sizePreset: ALERT_DIALOG_SIZE.base,
    });
    expect(dialog).toContain("gloss-deep");
    expect(dialog).toContain("flex");
    expect(dialog).not.toContain("bg-surface");

    const popover = popoverDefaultPanelClass({
      variant: NAME,
      size: "base",
      unstyled: true,
      contentGap: "base",
      gapPropSet: false,
    });
    expect(popover).toContain("gloss-deep");
    expect(popover).toContain("flex");
    expect(popover).not.toContain("bg-surface");

    expect(popoverArrowClass({
      variant: NAME,
      resolvedSide: "top",
      arrowSideClass: "",
    })).toContain("border-0");

    const tooltip = tooltipPanelClass({
      variant: NAME,
      size: "base",
      gridSlots: {
        hasIndicator: false,
        hasTitle: true,
        hasDescription: false,
        hasAction: false,
        hasClose: false,
      },
    });
    expect(tooltip).toContain("gloss-panel");
    expect(tooltip).toContain("rounded-mid");
    expect(tooltip).not.toContain("bg-surface");
    expect(tooltip).not.toContain("shadow-token-large");

    const submenu = dropdownSubContentClass({
      variant: NAME,
      subOpen: true,
      portalMounted: true,
    });
    expect(submenu).toContain("gloss-deep");
    expect(submenu).toContain("p-base");
    expect(submenu).not.toContain("bg-surface");

    const list = listBoxRootClass({ variant: NAME });
    expect(list).toContain("gloss-panel");
    expect(list).toContain("flex");

    expect(buttonGroupRootClass({
      orientation: "horizontal",
      segmented: false,
      variant: NAME,
    })).toContain("gloss-panel");

    expect(buttonGroupRootClass({
      orientation: "horizontal",
      segmented: false,
      variant: NAME,
      skinSlot: "toggleButtonGroup.root",
    })).toContain("gloss-panel");

    expect(selectionIndicatorVariantClass(NAME, true)).toContain("gloss-indicator");
    const fill = selectionIndicatorFillClass(NAME);
    expect(fill).toContain("gloss-indicator-fill");
    expect(fill).toContain("absolute");
  });
});
