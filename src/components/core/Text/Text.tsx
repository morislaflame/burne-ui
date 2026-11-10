import { createElement, forwardRef, useMemo, type ForwardedRef, type HTMLAttributes } from "react";
 
import { resolveTextAs } from "./textA11y";
import { resolveTextMotionDefaults, useTextRootMotion } from "./textAnimations";
import { TextMotionProvider } from "./textContext";
import { TEXT_VARIANT_DEFAULT_AS, textRootClass } from "./textStyles";
import type { TextPartMotion, TextProps } from "./textTypes";
 
export type { TextProps, TextVariant, TextMotion, TextPartMotion } from "./textTypes";
 
export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  {
    textStyle = "base",
    as,
    inheritColor,
    className,
    children,
    motion,
    motionController,
    motionState,
    motionPayload,
    playInitialState,
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
    <TextMotionProvider motion={motion} defaults={motionDefaults} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
      <TextSurface
        textStyle={textStyle}
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
  textStyle,
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
  textStyle: TextProps["textStyle"];
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
  const style = textStyle ?? "base";
  const Comp = resolveTextAs(as, TEXT_VARIANT_DEFAULT_AS[style]);
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
      className: textRootClass(style, inheritColor, className),
      ...part.pointerHandlers,
    },
    children,
  );
}
 