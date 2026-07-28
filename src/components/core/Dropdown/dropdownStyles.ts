import { hoverVariant } from "@/components/core/utils/hoverVariant";
import { optionListItemGridClass } from "@/components/core/utils/optionControlGridLayout";
import { OPTION_CONTROL_SIZE_LAYOUT } from "@/components/core/utils/sizeLayout";
import { BUTTON_GROUP_RADIUS_BRIDGE_CLASS } from "@/components/composite/ButtonGroup/buttonGroupStyles";
import type { Prettify } from "@/utils/prettify";

import type { SelectionIndicatorClassNames } from "@/components/core/SelectionIndicator";

import type {
  DropdownClassNames,
  DropdownItemIndicatorClassNames,
  DropdownItemStatus,
} from "./dropdownTypes";

import { cn } from "@/utils/cn";

export const DROPDOWN_ROOT_CLASS = "relative inline-flex";

export function dropdownRootClass({
  inJoinedButtonGroup,
  className,
}: {
  inJoinedButtonGroup?: boolean;
  className?: string;
} = {}): string {
  return cn(
    DROPDOWN_ROOT_CLASS,
    inJoinedButtonGroup && BUTTON_GROUP_RADIUS_BRIDGE_CLASS,
    className,
  );
}

export const DROPDOWN_TRIGGER_CLASS = "inline-flex outline-none focus-ring";

export const DROPDOWN_POPOVER_CLASS = "z-dropdown";

export const DROPDOWN_POPOVER_BODY_CLASS =
  "max-h-[min(24rem,70vh)] gap-xsmall overflow-y-auto overflow-x-hidden p-base text-left outline-none";

export const DROPDOWN_GROUP_CLASS =
  "flex min-w-0 flex-col gap-xsmall text-left";

export const DROPDOWN_LABEL_CLASS = "px-base text-left";

export const DROPDOWN_LABEL_TEXT_CLASS = "text-muted";

export const DROPDOWN_SUB_CLASS = "relative min-w-0";

export const DROPDOWN_SUB_TRIGGER_CLASS =
  "flex w-full min-w-0 cursor-pointer items-center gap-base rounded-mid px-base py-small text-left outline-none text-base text-foreground";

export const DROPDOWN_SUB_TRIGGER_LABEL_WRAP_CLASS = "min-w-0 flex-1";

export const DROPDOWN_SUB_TRIGGER_CHEVRON_CLASS =
  "shrink-0 text-muted icon-base";

export const DROPDOWN_SUB_CONTENT_BASE_CLASS =
  "fixed z-dropdown-sub outline-none";

export const DROPDOWN_SUB_CONTENT_SURFACE_CLASS =
  "flex max-h-[min(22rem,65vh)] flex-col overflow-y-auto overflow-x-hidden rounded-mid border-token bg-surface p-base text-left shadow-token-mid";

export const DROPDOWN_SUB_CONTENT_GLOSS_PANEL_CLASS =
  "gloss-panel gloss-deep flex max-h-[min(22rem,65vh)] min-w-0 origin-center flex-col overflow-hidden rounded-mid text-foreground";

export const DROPDOWN_SUB_CONTENT_GLOSS_CONTENT_CLASS =
  "gloss-content flex min-h-0 flex-col overflow-y-auto overflow-x-hidden p-base text-left";

export const DROPDOWN_ITEM_BASE_CLASS =
  "w-full min-w-0 origin-center rounded-mid px-base py-small text-left no-underline outline-none text-base";

export const DROPDOWN_ITEM_DISABLED_CLASS =
  "cursor-not-allowed bg-transparent text-muted opacity-45 hover:bg-transparent";

const DROPDOWN_ITEM_STATUS_CLASS: Record<DropdownItemStatus, string> = {
  default: cn("text-foreground", hoverVariant()),
  danger: cn("text-danger", hoverVariant("danger")),
  warning: cn("text-warning", hoverVariant("warning")),
  info: cn("text-info", hoverVariant("info")),
  success: cn("text-success", hoverVariant("success")),
};

export function dropdownItemRowClass({
  status,
  disabled,
  hasHint,
  showIndicatorSlot,
  hasIcon,
  className,
  slotClass,
}: {
  status: DropdownItemStatus;
  disabled: boolean;
  hasHint: boolean;
  showIndicatorSlot: boolean;
  hasIcon: boolean;
  className?: string;
  slotClass?: string;
}): string {
  return cn(
    DROPDOWN_ITEM_BASE_CLASS,
    optionListItemGridClass(
      hasHint,
      OPTION_CONTROL_SIZE_LAYOUT.base.listItemGapX,
      showIndicatorSlot,
      hasIcon,
    ),
    !disabled &&
      cn("cursor-pointer", DROPDOWN_ITEM_STATUS_CLASS[status]),
    disabled && DROPDOWN_ITEM_DISABLED_CLASS,
    slotClass,
    className,
  );
}

export function dropdownSubTriggerRowClass({
  className,
  slotClass,
}: {
  className?: string;
  slotClass?: string;
}): string {
  return cn(
    DROPDOWN_SUB_TRIGGER_CLASS,
    hoverVariant(),
    slotClass,
    className,
  );
}

export function dropdownSubContentClass({
  isGlossPanel,
  subOpen,
  portalMounted,
  className,
  slotClass,
}: {
  isGlossPanel: boolean;
  subOpen: boolean;
  portalMounted: boolean;
  className?: string;
  slotClass?: string;
}): string {
  return cn(
    DROPDOWN_SUB_CONTENT_BASE_CLASS,
    !isGlossPanel && DROPDOWN_SUB_CONTENT_SURFACE_CLASS,
    !subOpen && portalMounted && "pointer-events-none",
    slotClass,
    className,
  );
}

export function resolveDropdownItemIndicatorClassNames({
  slotClassNames,
  classNames,
}: {
  slotClassNames: DropdownClassNames;
  classNames?: Prettify<DropdownItemIndicatorClassNames>;
}): SelectionIndicatorClassNames {
  return {
    root: cn(
      slotClassNames.itemIndicatorShell,
      classNames?.root,
      classNames?.itemIndicatorShell,
    ),
    fill: cn(
      slotClassNames.itemIndicatorFill,
      classNames?.fill,
      classNames?.itemIndicatorFill,
    ),
    mark: cn(
      slotClassNames.itemIndicatorMark,
      classNames?.mark,
      classNames?.itemIndicatorMark,
    ),
  };
}
