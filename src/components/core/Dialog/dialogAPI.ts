import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { Button, type ButtonProps } from "@/components/core/Button";
import type { ButtonSize } from "@/components/core/Button/buttonTypes";

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
