import { forwardRef, useMemo, useRef, type HTMLAttributes } from "react";

import { useSkinRegistryRevision, useSkinSurfaceStyle } from "@/skins/skinContext";
import { hasKitMember } from "@/skins/resolveVariantVisual";
import { cn } from "@/utils/cn";

import { resolveCardMotionDefaults, useCardAnimations } from "./cardAnimations";
import { CardBody, CardDescription, CardFooter, CardHeader, CardHeadingBlock, CardRootShell, CardTitle } from "./cardParts";
import { CardMotionProvider, CardProvider } from "./cardContext";
import { cardRootClass } from "./cardStyles";
import type { CardMotion, CardProps, CardVariant } from "./cardTypes";
import { KIT_CARD_VARIANTS } from "./cardTypes";
import { useCardRootState } from "./useCardRootState";

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

const CARD_VARIANT_HAS_HOVER_SHADOW = new Set<(typeof KIT_CARD_VARIANTS)[number]>([
  "default",
  "outline",
  "secondary",
]);

export const CardRoot = forwardRef<HTMLElement, CardProps>(function Card(
  {
    className = "",
    variant,
    size = "base",
    shadow = "base",
    pressable = false,
    classNames,
    motion,
    motionController,
    motionState,
    motionPayload,
    playInitialState,
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
  ref) {
  const state = useCardRootState({
    variant,
    size,
    pressable,
    onClick: onClickProp,
    onKeyDown: onKeyDownProp,
    onPointerDown: onPointerDownProp,
  });

  const surfaceStyle = useSkinSurfaceStyle(state.variant);
  const hoverPointerInsideRef = useRef(false);
  const skinRevision = useSkinRegistryRevision();
  const motionDefaults = useMemo(
    () => {
      void skinRevision;
      return resolveCardMotionDefaults({ variant: state.variant, pressable });
    },
    [pressable, skinRevision, state.variant]);
  const motionParams = useMemo(
    () => ({
      pointerInside: hoverPointerInsideRef,
      hasHoverShadow:
        pressable &&
        hasKitMember(state.variant, KIT_CARD_VARIANTS, CARD_VARIANT_HAS_HOVER_SHADOW),
      shadowSize: shadow,
    }),
    [pressable, shadow, state.variant]);

  return (
    <CardProvider classNames={classNames} size={state.size}>
      <CardMotionProvider
        motion={motion}
        defaults={motionDefaults}
        params={motionParams}
        controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}
      >
        <CardSurface
          pressable={pressable}
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
          rest={{ ...rest, style: { ...surfaceStyle, ...rest.style } }}
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
    variant,
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

  const rootClassName = cardRootClass(
    variant,
    pressable,
    animations.pressableLiftMotionClass,
    size,
    shadow,
    cn(classNames?.root, className));

  return (
    <CardRootShell
      pressable={pressable}
      renderAsButton={renderAsButton}
      variant={variant}
      size={size}
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
