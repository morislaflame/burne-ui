import type { HTMLAttributes, ReactNode, RefObject } from "react";

import type { SelectionIndicatorSize, SelectionIndicatorVariant } from "./selectionIndicatorTokens";

export type SelectionIndicatorClassNames = {
  shell?: string;
  fill?: string;
  mark?: string;
};

export type SelectionIndicatorProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  size?: SelectionIndicatorSize;
  variant?: SelectionIndicatorVariant;
  selected: boolean;
  check?: boolean;
  dot?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
  classNames?: SelectionIndicatorClassNames;
};

export type SelectionIndicatorFillProps = HTMLAttributes<HTMLSpanElement>;

export type SelectionIndicatorMarkProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

export type ResolvedSelectionIndicatorClassNames = {
  shell: string;
  fill: string;
  mark: string;
};

export type SelectionIndicatorContextValue = {
  fillRef: RefObject<HTMLSpanElement | null>;
  markRef: RefObject<HTMLSpanElement | null>;
  fillClassName: string;
  markClassName: string;
  markContent?: ReactNode;
};
