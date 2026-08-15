import { createElement, forwardRef, useMemo, type ForwardedRef, type HTMLAttributes } from "react";

import { resolveTextAs } from "./textA11y";
import { resolveTextMotionDefaults, useTextRootMotion } from "./textAnimations";
import { TextMotionProvider } from "./textContext";
import { TEXT_VARIANT_DEFAULT_AS, textRootClass } from "./textStyles";
import type { TextPartMotion, TextProps } from "./textTypes";

export type { TextProps, TextVariant, TextMotion, TextPartMotion } from "./textTypes";

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  {
    variant,
    as,
    inheritColor,
    className,
    children,
    motion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
    ...rest
  },
  ref,
) {
  const motionDefaults = useMemo(() => resolveTextMotionDefaults(), []);

  return (
    <TextMotionProvider motion={motion} defaults={motionDefaults}>
      <TextSurface
        variant={variant}
        as={as}
        inheritColor={inheritColor}
        className={className}
        forwardedRef={ref}
        rootMotion={motion?.root}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        rest={rest}
      >
        {children}
      </TextSurface>
    </TextMotionProvider>
  );
});

function TextSurface({
  variant,
  as,
  inheritColor,
  className,
  children,
  forwardedRef,
  rootMotion,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  rest,
}: {
  variant: TextProps["variant"];
  as: TextProps["as"];
  inheritColor: TextProps["inheritColor"];
  className: TextProps["className"];
  children: TextProps["children"];
  forwardedRef: ForwardedRef<HTMLElement>;
  rootMotion?: TextPartMotion;
  onPointerOver: TextProps["onPointerOver"];
  onPointerOut: TextProps["onPointerOut"];
  onPointerDown: TextProps["onPointerDown"];
  onPointerUp: TextProps["onPointerUp"];
  rest: Omit<
    HTMLAttributes<HTMLElement>,
    | "className"
    | "children"
    | "onPointerOver"
    | "onPointerOut"
    | "onPointerDown"
    | "onPointerUp"
  >;
}) {
  const Comp = resolveTextAs(as, TEXT_VARIANT_DEFAULT_AS[variant]);
  const part = useTextRootMotion({
    forwardedRef,
    motion: rootMotion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });

  return createElement(
    Comp,
    {
      ...rest,
      ref: part.setRef,
      className: textRootClass(variant, inheritColor, className),
      ...part.pointerHandlers,
    },
    children,
  );
}
