import type { ComponentSize } from "@/components/core/utils/componentSize";

export type FieldSetSizeLayout = {
  /** Отступ между legend и основным контентом fieldset. */
  legendGap: string;
  /** Зазор между секциями stack (group, loose, actions). */
  stackGap: string;
  /** Зазор между полями внутри `FieldSet.Group`. */
  groupGap: string;
  /** Зазор между кнопками в `FieldSet.Actions`. */
  actionsGap: string;
};

/** Шкала отступов fieldset: `base` — текущие дефолты библиотеки. */
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
