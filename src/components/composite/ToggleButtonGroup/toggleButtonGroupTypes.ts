import type { HTMLAttributes, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";
 
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
 
export type ToggleButtonGroupItem = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

export type ToggleButtonGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
  children?: ReactNode;
  /** Data-driven buttons. Fills buttons that children do not already render. */
  items?: readonly ToggleButtonGroupItem[];
  /** `multiple` — independent toggles; `single` — one selected. Default `multiple`. */
  selectionMode?: ToggleButtonGroupType;
  orientation?: ToggleButtonGroupOrientation;
  /** `true` — gap between buttons (like `ButtonGroup` `segmented`), no glue. */
  segmented?: boolean;
  disabled?: boolean;
  size?: ToggleButtonSize;
  variant?: ToggleButtonVariant;
  /** Controlled item when `selectionMode="single"`. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** Controlled items when `selectionMode="multiple"`. */
  values?: string[];
  defaultValues?: string[];
  onValuesChange?: (values: string[]) => void;
  classNames?: Prettify<ToggleButtonGroupClassNames>;
  /**
   * Per-slot motion (`root`). Items keep ToggleButton motion — group does not wrap item hosts.
   * `change` plays when selection identity updates. Defaults are empty.
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   */
  motion?: Prettify<MotionMapWithEvents<ToggleButtonGroupMotion>>;
  /**
   * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
   * Forwarded to the motion Provider (`controller`), not onto the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
export type ToggleButtonGroupClassNamesProviderProps = {
  classNames?: Prettify<ToggleButtonGroupClassNames>;
  children: ReactNode;
};
 
export type UseToggleButtonGroupRootStateProps = Pick<
  ToggleButtonGroupProps,
  | "children"
  | "selectionMode"
  | "disabled"
  | "size"
  | "variant"
  | "value"
  | "defaultValue"
  | "onValueChange"
  | "values"
  | "defaultValues"
  | "onValuesChange"
  | "onKeyDown"
  | "orientation"
>;
 