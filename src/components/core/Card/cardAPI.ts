import { cn } from "@/utils/cn";

export function mergeCardSlotClass(...parts: Array<string | undefined>): string {
  return cn(...parts);
}

export function cardRenderAsButton(
  pressable: boolean,
  hasExplicitHandlers: boolean,
): boolean {
  return pressable || hasExplicitHandlers;
}

export function cardHasExplicitHandlers(props: {
  onClick?: unknown;
  onKeyDown?: unknown;
  onPointerDown?: unknown;
}): boolean {
  return Boolean(props.onClick || props.onKeyDown || props.onPointerDown);
}
