import { forwardRef } from "react";

import "../utils/glossInteractive.css";

import { useCardAnimations } from "./cardAnimations";
import {
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHeadingBlock,
  CardRootShell,
  CardTitle,
} from "./cardParts";
import { CardClassNamesProvider } from "./cardContext";
import { cardGlossPanelClass, cardRootClass } from "./cardStyles";
import type { CardProps, CardVariant } from "./cardTypes";
import { useCardRootState } from "./useCardRootState";

import { cn } from "@/utils/cn";

export type {
  CardPressEvent,
  CardProps,
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
    pressable = false,
    animated = true,
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
    pressable,
    onClick: onClickProp,
    onKeyDown: onKeyDownProp,
    onPointerDown: onPointerDownProp,
  });

  const animations = useCardAnimations({
    pressable,
    isGloss: state.isGloss,
    animated,
    onPress,
    onClick: onClickProp,
    onKeyDown: onKeyDownProp,
    onPointerDown: onPointerDownProp,
    onPointerOver: onPointerOverProp,
    onPointerOut: onPointerOutProp,
    forwardedRef: ref,
  });

  const glossPanelClass = cardGlossPanelClass(
    cn(classNames?.root, className),
  );

  const rootClassName = state.isGloss
    ? ""
    : cardRootClass(
        state.variant as Exclude<CardVariant, "gloss">,
        pressable,
        animations.pressableLiftMotionClass,
        cn(classNames?.root, className),
      );

  return (
    <CardClassNamesProvider classNames={classNames}>
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
    </CardClassNamesProvider>
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
