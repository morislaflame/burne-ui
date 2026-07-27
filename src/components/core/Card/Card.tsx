import { forwardRef } from "react";

import "../utils/glossInteractive.css";

import { useCardAnimations } from "./cardAnimations";
import { CardBody, CardDescription, CardFooter, CardHeader, CardHeadingBlock, CardRootShell, CardTitle } from "./cardParts";
import { CardProvider } from "./cardContext";
import { cardGlossPanelClass, cardRootClass } from "./cardStyles";
import type { CardProps, CardVariant } from "./cardTypes";
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
} from "./cardTypes";

export const CardRoot = forwardRef<HTMLElement, CardProps>(function Card(
  {
    className = "",
    variant = "default",
    size = "base",
    pressable = false,
    classNames,
    onPress,
    onPointerOver: onPointerOverProp,
    onPointerOut: onPointerOutProp,
    onPointerDown: onPointerDownProp,
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

  const animations = useCardAnimations({
    pressable,
    isGloss: state.isGloss,
    onPress,
    onClick: onClickProp,
    onKeyDown: onKeyDownProp,
    onPointerDown: onPointerDownProp,
    onPointerOver: onPointerOverProp,
    onPointerOut: onPointerOutProp,
    forwardedRef: ref,
  });

  const glossPanelClass = cardGlossPanelClass(
    state.size,
    cn(classNames?.root, className),
  );

  const rootClassName = state.isGloss
    ? ""
    : cardRootClass(
        state.variant as Exclude<CardVariant, "gloss">,
        pressable,
        animations.pressableLiftMotionClass,
        state.size,
        cn(classNames?.root, className),
      );

  return (
    <CardProvider classNames={classNames} size={state.size}>
      <CardRootShell
        pressable={pressable}
        isGloss={state.isGloss}
        renderAsButton={state.renderAsButton}
        glossPanelClass={glossPanelClass}
        rootClassName={rootClassName}
        setRootRef={animations.setRootRef}
        rest={rest}
        onPointerOver={animations.onPointerOver}
        onPointerOut={animations.onPointerOut}
        onPointerDown={pressable ? animations.handlePointerDown : animations.onPointerDownProp}
        onClick={pressable ? animations.handleClick : animations.onClickProp}
        onKeyDown={pressable ? animations.handleKeyDown : animations.onKeyDownProp}
      >
        {children}
      </CardRootShell>
    </CardProvider>
  );
});

CardRoot.displayName = "Card";

export {
  CardHeader,
  CardHeadingBlock,
  CardBody,
  CardTitle,
  CardDescription,
  CardFooter,
};
