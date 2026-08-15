import { forwardRef, useMemo, useRef, type HTMLAttributes } from "react";

import "../utils/glossInteractive.css";

import { resolveCardMotionDefaults, useCardAnimations } from "./cardAnimations";
import { CardBody, CardDescription, CardFooter, CardHeader, CardHeadingBlock, CardRootShell, CardTitle } from "./cardParts";
import { CardMotionProvider, CardProvider } from "./cardContext";
import { cardGlossPanelClass, cardRootClass } from "./cardStyles";
import type { CardMotion, CardProps, CardVariant } from "./cardTypes";
import { useCardRootState } from "./useCardRootState";

import { cn } from "@/utils/cn";

export type {
  CardPressEvent,
  CardProps,
  CardSize,
  CardVariant,
  CardHeaderProps,
  CardHeadingBlockProps,
  CardBodyProps,
  CardTitleProps,
  CardDescriptionProps,
  CardFooterProps,
  CardClassNames,
  CardMotion,
  CardPartMotion,
  CardRootMotion,
  CardPointerMotion,
} from "./cardTypes";

export const CardRoot = forwardRef<HTMLElement, CardProps>(function Card(
  {
    className = "",
    variant = "default",
    size = "base",
    shadow = "base",
    pressable = false,
    classNames,
    motion,
    onPress,
    onPointerOver: onPointerOverProp,
    onPointerOut: onPointerOutProp,
    onPointerDown: onPointerDownProp,
    onPointerUp: onPointerUpProp,
    onClick: onClickProp,
    onKeyDown: onKeyDownProp,
    children,
    ...rest
  },
  ref,
) {
  const state = useCardRootState({
    variant,
    size,
    pressable,
    onClick: onClickProp,
    onKeyDown: onKeyDownProp,
    onPointerDown: onPointerDownProp,
  });

  const hoverPointerInsideRef = useRef(false);
  const motionDefaults = useMemo(
    () => resolveCardMotionDefaults({ variant: state.variant, pressable }),
    [pressable, state.variant],
  );
  const motionParams = useMemo(
    () => ({
      pointerInside: hoverPointerInsideRef,
      hasHoverShadow: pressable && !state.isGloss,
      isGloss: state.isGloss,
      shadowSize: shadow,
    }),
    [pressable, shadow, state.isGloss],
  );

  return (
    <CardProvider classNames={classNames} size={state.size}>
      <CardMotionProvider motion={motion} defaults={motionDefaults} params={motionParams}>
        <CardSurface
          pressable={pressable}
          isGloss={state.isGloss}
          renderAsButton={state.renderAsButton}
          variant={state.variant}
          size={state.size}
          shadow={shadow}
          classNames={classNames}
          className={className}
          motion={motion}
          onPress={onPress}
          onPointerOver={onPointerOverProp}
          onPointerOut={onPointerOutProp}
          onPointerDown={onPointerDownProp}
          onPointerUp={onPointerUpProp}
          onClick={onClickProp}
          onKeyDown={onKeyDownProp}
          hoverPointerInsideRef={hoverPointerInsideRef}
          forwardedRef={ref}
          rest={rest}
        >
          {children}
        </CardSurface>
      </CardMotionProvider>
    </CardProvider>
  );
});

CardRoot.displayName = "Card";

function CardSurface({
  pressable,
  isGloss,
  renderAsButton,
  variant,
  size,
  shadow,
  classNames,
  className,
  motion,
  onPress,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  onClick,
  onKeyDown,
  hoverPointerInsideRef,
  forwardedRef,
  rest,
  children,
}: {
  pressable: boolean;
  isGloss: boolean;
  renderAsButton: boolean;
  variant: CardVariant;
  size: ReturnType<typeof useCardRootState>["size"];
  shadow: NonNullable<CardProps["shadow"]>;
  classNames: CardProps["classNames"];
  className: string;
  motion?: CardMotion;
  onPress: CardProps["onPress"];
  onPointerOver: CardProps["onPointerOver"];
  onPointerOut: CardProps["onPointerOut"];
  onPointerDown: CardProps["onPointerDown"];
  onPointerUp: CardProps["onPointerUp"];
  onClick: CardProps["onClick"];
  onKeyDown: CardProps["onKeyDown"];
  hoverPointerInsideRef: React.RefObject<boolean>;
  forwardedRef: React.ForwardedRef<HTMLElement>;
  rest: HTMLAttributes<HTMLElement>;
  children: CardProps["children"];
}) {
  const animations = useCardAnimations({
    pressable,
    isGloss,
    shadow,
    motion,
    onPress,
    onClick,
    onKeyDown,
    onPointerDown,
    onPointerUp,
    onPointerOver,
    onPointerOut,
    hoverPointerInsideRef,
    forwardedRef,
  });

  const glossPanelClass = cardGlossPanelClass(
    size,
    cn(classNames?.root, className),
  );

  const rootClassName = isGloss
    ? ""
    : cardRootClass(
        variant as Exclude<CardVariant, "gloss">,
        pressable,
        animations.pressableLiftMotionClass,
        size,
        shadow,
        cn(classNames?.root, className),
      );

  return (
    <CardRootShell
      pressable={pressable}
      isGloss={isGloss}
      renderAsButton={renderAsButton}
      glossPanelClass={glossPanelClass}
      rootClassName={rootClassName}
      setRootRef={animations.setRootRef}
      rest={rest}
      onPointerOver={animations.onPointerOver}
      onPointerOut={animations.onPointerOut}
      onPointerDown={pressable ? animations.handlePointerDown : animations.onPointerDownProp}
      onPointerUp={pressable ? animations.handlePointerUp : animations.onPointerUpProp}
      onClick={pressable ? animations.handleClick : animations.onClickProp}
      onKeyDown={pressable ? animations.handleKeyDown : animations.onKeyDownProp}
    >
      {children}
    </CardRootShell>
  );
}

export {
  CardHeader,
  CardHeadingBlock,
  CardBody,
  CardTitle,
  CardDescription,
  CardFooter,
};
