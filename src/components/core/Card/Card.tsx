import { forwardRef } from "react";

import "../utils/glossInteractive.css";

import { mergeCardSlotClass } from "./cardAPI";
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
    onPress,
    onClick: onClickProp,
    onKeyDown: onKeyDownProp,
    onPointerDown: onPointerDownProp,
    onPointerOver: onPointerOverProp,
    onPointerOut: onPointerOutProp,
    forwardedRef: ref,
  });

  const glossPanelClass = cardGlossPanelClass(
    mergeCardSlotClass(classNames?.root, className),
  );

  const rootClassName = state.isGloss
    ? ""
    : cardRootClass(
        state.variant as Exclude<CardVariant, "gloss">,
        pressable,
        animations.pressableLift.motionClass,
        mergeCardSlotClass(classNames?.root, className),
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
        glossPointerHandlers={animations.glossPointerHandlers}
        pressableLift={animations.pressableLift}
        onPointerOverProp={animations.onPointerOverProp}
        onPointerOutProp={animations.onPointerOutProp}
        handlePointerDown={animations.handlePointerDown}
        handleClick={animations.handleClick}
        handleKeyDown={animations.handleKeyDown}
        onPointerDownProp={onPointerDownProp}
        onClickProp={onClickProp}
        onKeyDownProp={onKeyDownProp}
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
