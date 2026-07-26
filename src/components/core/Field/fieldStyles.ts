import type { ComponentSize } from "@/components/core/utils/sizeLayout";

import type { FieldHintStatus } from "./fieldTypes";

import { cn } from "@/utils/cn";

export type FieldSetSizeLayout = {
  legendGap: string;
  stackGap: string;
  groupGap: string;
  actionsGap: string;
};

export const FIELD_ROOT_CLASS = "flex w-full flex-col gap-xsmall";

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

export const FIELD_LEGEND_HEADER_CLASS = "flex flex-col w-fit";

export const FIELD_SET_GROUP_BASE_CLASS = "flex min-w-0 w-full flex-col";

export const FIELD_SET_ACTIONS_BASE_CLASS = "flex flex-wrap w-fit items-center";

export const FIELD_SET_SIZE_LAYOUT: Record<ComponentSize, FieldSetSizeLayout> = {
  small: {
    legendGap: "mt-large",
    stackGap: "gap-large",
    groupGap: "gap-base",
    actionsGap: "gap-base",
  },
  base: {
    legendGap: "mt-xlarge",
    stackGap: "gap-xlarge",
    groupGap: "gap-mid",
    actionsGap: "gap-mid",
  },
  mid: {
    legendGap: "mt-2xlarge",
    stackGap: "gap-2xlarge",
    groupGap: "gap-large",
    actionsGap: "gap-large",
  },
  large: {
    legendGap: "mt-2xlarge",
    stackGap: "gap-2xlarge",
    groupGap: "gap-xlarge",
    actionsGap: "gap-xlarge",
  },
};

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

export function fieldSetStackClass({
  size,
  hasLegend,
  slotClass,
}: {
  size: ComponentSize;
  hasLegend: boolean;
  slotClass?: string;
}): string {
  const layout = FIELD_SET_SIZE_LAYOUT[size];

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
  size: ComponentSize;
  className?: string;
  slotClass?: string;
}): string {
  return cn(
    FIELD_SET_GROUP_BASE_CLASS,
    FIELD_SET_SIZE_LAYOUT[size].groupGap,
    slotClass,
    className,
  );
}

export function fieldSetActionsClass({
  size,
  className,
  slotClass,
}: {
  size: ComponentSize;
  className?: string;
  slotClass?: string;
}): string {
  return cn(
    FIELD_SET_ACTIONS_BASE_CLASS,
    FIELD_SET_SIZE_LAYOUT[size].actionsGap,
    slotClass,
    className,
  );
}
