import { gsap } from "@/components/core/utils/gsapMotion";
import { motionInteractiveFor, type MotionConfig } from "@/components/core/utils/motionConfig";

/**
 * Disabled chrome on Checkbox / Radio track. Not a public slot: the track
 * is not in `classNames` or `motion`, so this stays an internal recipe helper.
 */
export function tweenDisabledTrack(
  track: HTMLElement,
  disabled: boolean,
  config: Readonly<MotionConfig>,
): gsap.core.Tween {
  const from = Number.parseFloat(getComputedStyle(track).opacity);
  const start = Number.isFinite(from) ? from : 1;
  return gsap.fromTo(
    track,
    { autoAlpha: start },
    {
      autoAlpha: disabled ? 0.48 : 1,
      ...motionInteractiveFor(config),
      overwrite: "auto",
    },
  );
}
