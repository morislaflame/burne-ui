import { cardHasExplicitHandlers, cardRenderAsButton } from "./cardAPI";
import { resolveCardSize } from "./cardStyles";
import type { CardVariant, UseCardRootStateProps } from "./cardTypes";

export function useCardRootState({
  variant = "default",
  size: sizeProp,
  pressable = false,
  onClick,
  onKeyDown,
  onPointerDown,
}: UseCardRootStateProps) {
  const size = resolveCardSize(sizeProp);
  const isGloss = variant === "gloss";
  const glossPressable = pressable && isGloss;
  const renderAsButton = cardRenderAsButton(
    pressable,
    cardHasExplicitHandlers({ onClick, onKeyDown, onPointerDown }),
  );

  return {
    variant: variant as CardVariant,
    size,
    pressable,
    isGloss,
    glossPressable,
    renderAsButton,
  };
}
