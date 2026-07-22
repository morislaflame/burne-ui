import { createElement, forwardRef } from "react";

import { resolveTextAs } from "./textA11y";
import { TEXT_VARIANT_DEFAULT_AS, textRootClass } from "./textStyles";
import type { TextProps } from "./textTypes";

export type { TextProps, TextVariant } from "./textTypes";

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { variant, as, inheritColor, className, children, ...rest },
  ref,
) {
  const Comp = resolveTextAs(as, TEXT_VARIANT_DEFAULT_AS[variant]);

  return createElement(
    Comp,
    {
      ...rest,
      ref,
      className: textRootClass(variant, inheritColor, className),
    },
    children,
  );
});
