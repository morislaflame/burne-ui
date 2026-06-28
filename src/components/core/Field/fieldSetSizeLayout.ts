import type { ComponentSize } from "@/components/core/utils/componentSize";

export type FieldSetSizeLayout = {
  legendGap: string;
  stackGap: string;
  groupGap: string;
  actionsGap: string;
};

export const FIELD_SET_SIZE_LAYOUT: Record<ComponentSize, FieldSetSizeLayout> = {
  small: {
    legendGap: "mt-mid",
    stackGap: "gap-mid",
    groupGap: "gap-base",
    actionsGap: "gap-base",
  },
  base: {
    legendGap: "mt-large",
    stackGap: "gap-large",
    groupGap: "gap-plus",
    actionsGap: "gap-plus",
  },
  mid: {
    legendGap: "mt-xlarge",
    stackGap: "gap-xlarge",
    groupGap: "gap-mid",
    actionsGap: "gap-mid",
  },
  large: {
    legendGap: "mt-xlarge",
    stackGap: "gap-xlarge",
    groupGap: "gap-large",
    actionsGap: "gap-large",
  },
};
