import type { HTMLAttributes, ReactNode } from "react";

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

export type ToggleButtonGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
  children?: ReactNode;
  /** `multiple` — independent toggle; `single` — only one selected (radio). By default `multiple`. */
  type?: ToggleButtonGroupType;
  orientation?: ToggleButtonGroupOrientation;
  separated?: boolean;
  disabled?: boolean;
  size?: ToggleButtonSize;
  variant?: ToggleButtonVariant;
  /** Controlled value: `string` when `type="single"`, `string[]` when `type="multiple"`. */
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
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
