import { cardHasExplicitHandlers, cardRenderAsButton } from "./cardAPI";
import type { CardVariant, UseCardRootStateProps } from "./cardTypes";

export function useCardRootState({
  variant = "default",
  pressable = false,
  onClick,
  onKeyDown,
  onPointerDown,
}: UseCardRootStateProps) {
  const isGloss = variant === "gloss";
  const glossPressable = pressable && isGloss;
  const renderAsButton = cardRenderAsButton(
    pressable,
    cardHasExplicitHandlers({ onClick, onKeyDown, onPointerDown }),
  );

  return {
    variant: variant as CardVariant,
    pressable,
    isGloss,
    glossPressable,
    renderAsButton,
  };
}
