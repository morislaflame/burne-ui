import type { HTMLAttributes, ReactNode, RefObject } from "react";

import type { SelectionIndicatorSize } from "../SelectionIndicator/selectionIndicatorTokens";

export type SelectionThumbClassNames = {
  root?: string;
  fill?: string;
};

export type SelectionThumbIconClassNames = {
  root?: string;
  icon?: string;
};

export type SelectionThumbProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  active: boolean;
  size?: SelectionIndicatorSize;
  shellRef?: RefObject<HTMLSpanElement | null>;
  fillRef?: RefObject<HTMLSpanElement | null>;
  gloss?: boolean;
  children?: ReactNode;
  classNames?: SelectionThumbClassNames;
};

export type SelectionThumbIconProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  size?: SelectionIndicatorSize;
  highlighted?: boolean;
  gloss?: boolean;
  iconRef?: RefObject<HTMLSpanElement | null>;
  children?: ReactNode;
  classNames?: SelectionThumbIconClassNames;
};
