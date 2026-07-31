import type { LabelHTMLAttributes, ReactNode } from "react";
import type { TextVariant } from "@/components/core/Text";
import type { Prettify } from "@/utils/prettify";

export type LabelClassNames = {
  root?: string;
  text?: string;
  required?: string;
};

export type LabelProps = Omit<LabelHTMLAttributes<HTMLLabelElement>, "children"> & {
  children?: ReactNode;
  required?: boolean;
  /** Text size for the label copy. Default `base`. */
  variant?: TextVariant;
  classNames?: Prettify<LabelClassNames>;
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
