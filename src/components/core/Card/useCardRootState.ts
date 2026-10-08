import { useSkinVariant } from "@/skins/skinContext";

import { cardHasExplicitHandlers, cardRenderAsButton } from "./cardAPI";
import { resolveCardSize } from "./cardStyles";
import type { CardVariant, UseCardRootStateProps } from "./cardTypes";

export function useCardRootState({
  variant: variantProp,
  size: sizeProp,
  pressable = false,
  onClick,
  onKeyDown,
  onPointerDown,
}: UseCardRootStateProps) {
  const variant = useSkinVariant(variantProp) as CardVariant;
  const size = resolveCardSize(sizeProp);
  const renderAsButton = cardRenderAsButton(
    pressable,
    cardHasExplicitHandlers({ onClick, onKeyDown, onPointerDown }));

  return {
    variant,
    size,
    pressable,
    renderAsButton,
  };
}
