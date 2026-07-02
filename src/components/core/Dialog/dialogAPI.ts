import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import type { ClassValue } from "clsx";

import { Button, type ButtonProps } from "@/components/core/Button";
import { cn } from "@/utils/cn";
import type { ButtonSize } from "@/components/core/Button/buttonTypes";

export function mergeDialogSlotClass(...parts: ClassValue[]): string {
  return cn(...parts);
}

export function injectFooterButtonSize(
  children: ReactNode,
  buttonSize: ButtonSize,
): ReactNode {
  return Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    if (child.type === Button) {
      const props = child.props as ButtonProps;
      return cloneElement(child as ReactElement<ButtonProps>, {
        size: props.size ?? buttonSize,
      });
    }
    if (child.type === Fragment) {
      const f = child as ReactElement<{ children?: ReactNode }>;
      return cloneElement(
        f,
        { key: f.key ?? undefined },
        injectFooterButtonSize(f.props.children, buttonSize),
      );
    }
    return child;
  });
}
