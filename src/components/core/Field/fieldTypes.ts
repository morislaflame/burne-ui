import type { FieldsetHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";
import type { MotionValue } from "@/components/core/utils/slotMotion";

import type { LabelProps } from "@/components/core/Label";
import type { TextVariant } from "@/components/core/Text";
import type { ComponentSize } from "@/components/core/utils/sizeLayout";
import type { SemanticStatus } from "@/components/core/utils/semanticStatusIcons";

export type FieldHintStatus = SemanticStatus;
export type FieldSize = ComponentSize;
export type FieldSetSize = FieldSize;

export type FieldClassNames = {
  root?: string;
  hint?: string;
  error?: string;
};

export type FieldPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};

export type FieldMotion = {
  root?: FieldPartMotion;
  hint?: FieldPartMotion;
  error?: FieldPartMotion;
};

export type FieldSetMotion = {
  root?: FieldPartMotion;
  stack?: FieldPartMotion;
  legend?: FieldPartMotion;
  legendHeader?: FieldPartMotion;
  group?: FieldPartMotion;
  actions?: FieldPartMotion;
};

export type FieldSetClassNames = {
  root?: string;
  stack?: string;
  legend?: string;
  legendHeader?: string;
  group?: string;
  actions?: string;
};

export type FieldProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  classNames?: Prettify<FieldClassNames>;
  /**
   * Scales Field chrome (gap, Label / Hint / Error type).
   * Inside `Field.Set`, inherits Set size unless overridden.
   * Does not cascade into embedded controls.
   */
  size?: FieldSize;
  /**
   * Per-slot motion (`root`, `hint`, `error`). Does not steal child Input motion.
   * Defaults are empty.
   */
  motion?: Prettify<FieldMotion>;
};

export type FieldClassNamesProviderProps = {
  classNames?: Prettify<FieldClassNames>;
  children: ReactNode;
};

export type FieldSetClassNamesProviderProps = {
  classNames?: Prettify<FieldSetClassNames>;
  children: ReactNode;
};

export type FieldHintProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  status?: FieldHintStatus;
  as?: "p" | "span";
  variant?: TextVariant;
  motion?: Prettify<FieldPartMotion>;
};

export type FieldLabelProps = LabelProps;
export type FieldErrorProps = Omit<FieldHintProps, "status">;

export type FieldLegendProps = HTMLAttributes<HTMLLegendElement> & {
  children?: ReactNode;
  motion?: Prettify<FieldPartMotion>;
};

export type FieldLegendHeaderProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
  motion?: Prettify<FieldPartMotion>;
};

export type FieldSetGroupProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  motion?: Prettify<FieldPartMotion>;
};

export type FieldSetActionsProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  motion?: Prettify<FieldPartMotion>;
};

export type FieldSetProps = Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "children"> & {
  children?: ReactNode;
  hintId?: string;
  errorId?: string;
  /**
   * Scales Set chrome (stack / group / actions gaps, legend header, Label / Hint type via context).
   * Does not cascade into embedded controls (`Input`, `Button`, …).
   */
  size?: FieldSetSize;
  classNames?: Prettify<FieldSetClassNames>;
  /**
   * Per-slot motion (`root`, `stack`, `legend`, `legendHeader`, `group`, `actions`).
   * Defaults are empty.
   */
  motion?: Prettify<FieldSetMotion>;
};

export type UseFieldSetRootStateResult = {
  legend: ReactNode;
  loose: ReactNode[];
  groups: ReactNode[];
  actions: ReactNode | null;
};
