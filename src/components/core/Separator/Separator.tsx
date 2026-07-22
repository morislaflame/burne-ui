import { forwardRef, type Ref } from "react";

import { separatorAriaOrientation } from "./separatorA11y";
import { separatorRootClass } from "./separatorStyles";
import type { SeparatorProps } from "./separatorTypes";

export type { SeparatorOrientation, SeparatorProps } from "./separatorTypes";

export const Separator = forwardRef<HTMLElement, SeparatorProps>(function Separator(
  { orientation = "horizontal", className = "", ...rest },
  ref,
) {
  const sharedClassName = separatorRootClass(orientation, className);

  if (orientation === "horizontal") {
    return <hr ref={ref as Ref<HTMLHRElement>} className={sharedClassName} {...rest} />;
  }

  return (
    <div
      ref={ref as Ref<HTMLDivElement>}
      role="separator"
      aria-orientation={separatorAriaOrientation(orientation)}
      className={sharedClassName}
      {...rest}
    />
  );
});

Separator.displayName = "Separator";
