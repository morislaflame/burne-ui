import type { FieldsetHTMLAttributes, HTMLAttributes, ReactNode } from "react";

import type { LabelProps } from "@/components/core/Label";
import type { TextVariant } from "@/components/core/Text";
import type { ComponentSize } from "@/components/core/utils/componentSize";
import type { SemanticStatus } from "@/components/core/utils/semanticStatusIcons";

export type FieldHintStatus = SemanticStatus;
export type FieldSetSize = ComponentSize;

export type FieldClassNames = {
  root?: string;
  hint?: string;
  error?: string;
};

export type FieldSetClassNames = {
  set?: string;
  stack?: string;
  legend?: string;
  legendHeader?: string;
  group?: string;
  actions?: string;
};

export type FieldRootProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  classNames?: FieldClassNames;
};

export type FieldClassNamesProviderProps = {
  classNames?: FieldClassNames;
  children: ReactNode;
};

export type FieldSetClassNamesProviderProps = {
  classNames?: FieldSetClassNames;
  children: ReactNode;
};

export type FieldHintProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  status?: FieldHintStatus;
  as?: "p" | "span";
  variant?: TextVariant;
};

export type FieldLabelProps = LabelProps;
export type FieldErrorProps = Omit<FieldHintProps, "status">;

export type FieldLegendProps = HTMLAttributes<HTMLLegendElement> & {
  children?: ReactNode;
};

export type FieldLegendHeaderProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

export type FieldSetGroupProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export type FieldSetActionsProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export type FieldSetProps = Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "children"> & {
  children?: ReactNode;
  hintId?: string;
  errorId?: string;
  size?: FieldSetSize;
  classNames?: FieldSetClassNames;
};

export type UseFieldSetRootStateResult = {
  legend: ReactNode;
  loose: ReactNode[];
  groups: ReactNode[];
  actions: ReactNode | null;
};
