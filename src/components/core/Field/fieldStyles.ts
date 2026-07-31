import type { TextVariant } from "@/components/core/Text";
import {
  resolveComponentSize,
  type ComponentSize,
} from "@/components/core/utils/sizeLayout";

import type { FieldHintStatus } from "./fieldTypes";

import { cn } from "@/utils/cn";

export type FieldSize = ComponentSize;

export type FieldSizeLayout = {
  /** Gap between Field Label / control / Hint */
  fieldGap: string;
  legendGap: string;
  legendHeaderGap: string;
  stackGap: string;
  groupGap: string;
  actionsGap: string;
  labelVariant: TextVariant;
  hintVariant: TextVariant;
};

export const FIELD_ROOT_BASE_CLASS = "flex w-full flex-col";

export const FIELD_HINT_STATUS_CLASS: Record<FieldHintStatus, string> = {
  default: "text-muted",
  danger: "text-danger",
  success: "text-success",
  info: "text-info",
  warning: "text-warning",
};

export const FIELD_SET_CLASS =
  "m-0 min-w-0 border-0 p-0 disabled:pointer-events-none disabled:opacity-55";

export const FIELD_SET_STACK_BASE_CLASS = "flex min-w-0 w-full flex-col";

export const FIELD_LEGEND_CLASS = "m-0 block w-full max-w-full border-0 p-0";

export const FIELD_LEGEND_HEADER_BASE_CLASS = "flex w-fit flex-col";

export const FIELD_SET_GROUP_BASE_CLASS = "flex min-w-0 w-full flex-col";

export const FIELD_SET_ACTIONS_BASE_CLASS = "flex w-fit flex-wrap items-center";

export const FIELD_SIZE_LAYOUT: Record<FieldSize, FieldSizeLayout> = {
  small: {
    fieldGap: "gap-xsmall",
    legendGap: "mt-large",
    legendHeaderGap: "gap-xsmall",
    stackGap: "gap-large",
    groupGap: "gap-base",
    actionsGap: "gap-base",
    labelVariant: "small",
    hintVariant: "xsmall",
  },
  base: {
    fieldGap: "gap-xsmall",
    legendGap: "mt-xlarge",
    legendHeaderGap: "gap-xsmall",
    stackGap: "gap-xlarge",
    groupGap: "gap-mid",
    actionsGap: "gap-mid",
    labelVariant: "base",
    hintVariant: "small",
  },
  mid: {
    fieldGap: "gap-small",
    legendGap: "mt-2xlarge",
    legendHeaderGap: "gap-small",
    stackGap: "gap-2xlarge",
    groupGap: "gap-large",
    actionsGap: "gap-large",
    labelVariant: "mid",
    hintVariant: "small",
  },
  large: {
    fieldGap: "gap-small",
    legendGap: "mt-2xlarge",
    legendHeaderGap: "gap-small",
    stackGap: "gap-2xlarge",
    groupGap: "gap-xlarge",
    actionsGap: "gap-xlarge",
    labelVariant: "mid",
    hintVariant: "base",
  },
};

/** Alias — same grid as `FIELD_SIZE_LAYOUT`. */
export const FIELD_SET_SIZE_LAYOUT = FIELD_SIZE_LAYOUT;

export function resolveFieldSize(size?: FieldSize): FieldSize {
  return resolveComponentSize(size);
}

export function fieldSizeLayout(size?: FieldSize): FieldSizeLayout {
  return FIELD_SIZE_LAYOUT[resolveFieldSize(size)];
}

export function fieldRootClass({
  size,
  className,
  slotClass,
}: {
  size?: FieldSize;
  className?: string;
  slotClass?: string;
}): string {
  return cn(
    FIELD_ROOT_BASE_CLASS,
    fieldSizeLayout(size).fieldGap,
    slotClass,
    className,
  );
}

export function fieldHintClass({
  status,
  className,
  slotClass,
}: {
  status: FieldHintStatus;
  className?: string;
  slotClass?: string;
}): string {
  return cn(
    FIELD_HINT_STATUS_CLASS[status],
    slotClass,
    className,
  );
}

export function fieldHintVariant(size?: FieldSize): TextVariant {
  return fieldSizeLayout(size).hintVariant;
}

export function fieldLabelVariant(size?: FieldSize): TextVariant {
  return fieldSizeLayout(size).labelVariant;
}

export function fieldLegendHeaderClass({
  size,
  className,
  slotClass,
}: {
  size?: FieldSize;
  className?: string;
  slotClass?: string;
}): string {
  return cn(
    FIELD_LEGEND_HEADER_BASE_CLASS,
    fieldSizeLayout(size).legendHeaderGap,
    slotClass,
    className,
  );
}

export function fieldSetStackClass({
  size,
  hasLegend,
  slotClass,
}: {
  size: FieldSize;
  hasLegend: boolean;
  slotClass?: string;
}): string {
  const layout = fieldSizeLayout(size);

  return cn(
    FIELD_SET_STACK_BASE_CLASS,
    layout.stackGap,
    hasLegend && layout.legendGap,
    slotClass,
  );
}

export function fieldSetGroupClass({
  size,
  className,
  slotClass,
}: {
  size: FieldSize;
  className?: string;
  slotClass?: string;
}): string {
  return cn(
    FIELD_SET_GROUP_BASE_CLASS,
    fieldSizeLayout(size).groupGap,
    slotClass,
    className,
  );
}

export function fieldSetActionsClass({
  size,
  className,
  slotClass,
}: {
  size: FieldSize;
  className?: string;
  slotClass?: string;
}): string {
  return cn(
    FIELD_SET_ACTIONS_BASE_CLASS,
    fieldSizeLayout(size).actionsGap,
    slotClass,
    className,
  );
}
