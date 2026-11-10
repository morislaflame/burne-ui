import { findMotionController } from "./studioNodes";

export const FORCE_STATE_TOKENS = ["hover", "focus", "press", "disabled"] as const;

export type ForceStateToken = (typeof FORCE_STATE_TOKENS)[number];

/**
 * Tailwind `hover:` / `focus:` / `focus-visible:` / `active:` / `disabled:` also match
 * `data-force-state` (`src/styles.css`). Tokens are space-separated.
 */
export function forceStateAttribute(
  states: readonly ForceStateToken[],
): { "data-force-state": string } | undefined {
  if (states.length === 0) return undefined;
  return { "data-force-state": states.join(" ") };
}

/**
 * Play the lift or press that `data-force-state` asks for.
 * The attribute itself only matches Tailwind variants and the focus-ring utilities.
 * GSAP hover and press listen to the pointer, so the studio calls this after it writes the attribute.
 * One play: a second play on the same node cancels the first. Press wins over hover.
 * `focus` and `disabled` have no GSAP phase.
 */
export function playForceStateMotion(node: HTMLElement): void {
  const controller = findMotionController(node);
  if (!controller) return;
  const tokens = new Set((node.getAttribute("data-force-state") ?? "").split(/\s+/).filter(Boolean));
  if (tokens.has("press")) {
    controller.play("pressIn");
    return;
  }
  controller.play(tokens.has("hover") ? "hoverIn" : "hoverOut");
}
