import { cn } from "@/utils/cn";

/** Shell for label; default width comes from cell (`w-fit`). Override with `w-full`. */
export const OPTION_LIST_ITEM_LABEL_WRAP_CLASS = "flex min-w-0 items-center";

/** Inner Text fills the label shell so `w-full` on the shell stretches rich content. */
export const OPTION_LIST_ITEM_LABEL_TEXT_FILL_CLASS = "block min-w-0 w-full";

export const OPTION_LIST_ITEM_LABEL_MIN_WIDTH_CLASS = "min-w-0";

export const OPTION_LIST_ITEM_LABEL_MOTION_CLASS = "origin-center";

export const OPTION_LIST_ITEM_LABEL_TEXT_CLASS = "font-w-mid";

export const OPTION_LIST_ITEM_LABEL_TEXT_DISABLED_CLASS = "text-muted";

export const OPTION_LIST_ITEM_HINT_MUTED_CLASS = "text-muted";

export const OPTION_LIST_ITEM_HINT_ACTIVE_CLASS = "opacity-80";

export const OPTION_LIST_ITEM_STRING_LABEL_CLASS = "opacity-90";

export const OPTION_LIST_ITEM_ICON_WRAP_CLASS = "inline-flex items-center [&_svg]:icon-base";

export const OPTION_LIST_ITEM_INDICATOR_SHELL_CLASS =
  "relative inline-flex shrink-0 items-center justify-center";

export function optionListItemHintToneClass(muted: boolean): string {
  return muted ? OPTION_LIST_ITEM_HINT_MUTED_CLASS : OPTION_LIST_ITEM_HINT_ACTIVE_CLASS;
}

export function optionListItemLabelTextClass(disabled: boolean): string {
  return cn(
    OPTION_LIST_ITEM_LABEL_TEXT_CLASS,
    disabled && OPTION_LIST_ITEM_LABEL_TEXT_DISABLED_CLASS,
  );
}
