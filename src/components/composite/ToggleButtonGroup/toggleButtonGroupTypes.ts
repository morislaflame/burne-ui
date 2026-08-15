import type { HTMLAttributes, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";
import type { MotionValue } from "@/components/core/utils/slotMotion";

import type {
  ToggleButtonGroupOrientation,
  ToggleButtonGroupType,
  ToggleButtonSize,
  ToggleButtonVariant,
} from "@/components/core/ToggleButton/toggleButtonTypes";

export type {
  ToggleButtonGroupType,
  ToggleButtonGroupOrientation,
  ToggleButtonGroupContextValue,
} from "@/components/core/ToggleButton/toggleButtonTypes";

export type ToggleButtonGroupClassNames = {
  /** Root `<div role="toolbar">`. */
  root?: string;
  /** Separator between glued segments — layout only, no compound part. */
  separator?: string;
};

export type ToggleButtonGroupPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
  change?: MotionValue;
};

export type ToggleButtonGroupMotion = {
  root?: ToggleButtonGroupPartMotion;
};

export type ToggleButtonGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
  children?: ReactNode;
  /** `multiple` — independent toggle; `single` — only one selected (radio). By default `multiple`. */
  type?: ToggleButtonGroupType;
  orientation?: ToggleButtonGroupOrientation;
  /** `true` — gap between buttons (like `ButtonGroup` `segmented`), no glue. */
  segmented?: boolean;
  disabled?: boolean;
  size?: ToggleButtonSize;
  variant?: ToggleButtonVariant;
  /** Controlled value: `string` when `type="single"`, `string[]` when `type="multiple"`. */
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  classNames?: Prettify<ToggleButtonGroupClassNames>;
  /**
   * Per-slot motion (`root`). Items keep ToggleButton motion — group does not wrap item hosts.
   * `change` plays when selection identity updates. Defaults are empty.
   */
  motion?: Prettify<ToggleButtonGroupMotion>;
};

export type ToggleButtonGroupClassNamesProviderProps = {
  classNames?: Prettify<ToggleButtonGroupClassNames>;
  children: ReactNode;
};

export type UseToggleButtonGroupRootStateProps = Pick<
  ToggleButtonGroupProps,
  | "children"
  | "type"
  | "disabled"
  | "size"
  | "variant"
  | "value"
  | "defaultValue"
  | "onValueChange"
  | "onKeyDown"
  | "orientation"
>;
