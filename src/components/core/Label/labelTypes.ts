import type { LabelHTMLAttributes, ReactNode } from "react";

export type LabelClassNames = {
  root?: string;
  text?: string;
  required?: string;
};

export type LabelProps = Omit<LabelHTMLAttributes<HTMLLabelElement>, "children"> & {
  children?: ReactNode;
  isRequired?: boolean;
  classNames?: LabelClassNames;
};

export type LabelClassNamesProviderProps = {
  classNames?: LabelClassNames;
  children: ReactNode;
};

export type FieldLabelContextValue = {
  controlId?: string;
  labelId?: string;
  isRequired?: boolean;
};

export type UseLabelRootStateProps = Pick<
  LabelProps,
  "isRequired" | "htmlFor" | "id"
>;

export type LabelContentProps = {
  children?: ReactNode;
  isRequired: boolean;
};
