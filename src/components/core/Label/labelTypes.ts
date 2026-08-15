import type { LabelHTMLAttributes, ReactNode } from "react";
import type { TextVariant } from "@/components/core/Text";
import type { Prettify } from "@/utils/prettify";
import type { MotionValue } from "@/components/core/utils/slotMotion";

export type LabelClassNames = {
  root?: string;
  text?: string;
  required?: string;
};

export type LabelPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};

export type LabelMotion = {
  root?: LabelPartMotion;
  text?: LabelPartMotion;
  required?: LabelPartMotion;
};

export type LabelProps = Omit<LabelHTMLAttributes<HTMLLabelElement>, "children"> & {
  children?: ReactNode;
  required?: boolean;
  /** Text size for the label copy. Default `base`. */
  variant?: TextVariant;
  classNames?: Prettify<LabelClassNames>;
  /**
   * Per-slot motion (`root`, `text`, `required`). Defaults are empty — custom factories are opt-in.
   */
  motion?: Prettify<LabelMotion>;
};

export type LabelClassNamesProviderProps = {
  classNames?: Prettify<LabelClassNames>;
  children: ReactNode;
};

export type FieldLabelContextValue = {
  controlId?: string;
  labelId?: string;
  required?: boolean;
};

export type UseLabelRootStateProps = Pick<
  LabelProps,
  "required" | "htmlFor" | "id"
>;

export type LabelContentProps = {
  children?: ReactNode;
  required: boolean;
  variant?: TextVariant;
};
