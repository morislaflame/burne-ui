import type { HTMLAttributes, ReactNode, RefObject } from "react";
import type { Prettify } from "@/utils/prettify";

import type { SelectionIndicatorSize } from "../SelectionIndicator/selectionIndicatorTokens";

export type SelectionThumbClassNames = {
  root?: string;
};

export type SelectionThumbIconClassNames = {
  root?: string;
  icon?: string;
};

export type SelectionThumbProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  size?: SelectionIndicatorSize;
  shellRef?: RefObject<HTMLSpanElement | null>;
  gloss?: boolean;
  children?: ReactNode;
  classNames?: Prettify<SelectionThumbClassNames>;
};

export type SelectionThumbIconProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  size?: SelectionIndicatorSize;
  gloss?: boolean;
  iconRef?: RefObject<HTMLSpanElement | null>;
  children?: ReactNode;
  classNames?: Prettify<SelectionThumbIconClassNames>;
};
