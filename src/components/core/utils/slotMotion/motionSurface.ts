import type { MotionConfig } from "@/components/core/utils/motionConfig";
import {
  resolveAdaptiveHoverLiftScale,
  resolveAdaptivePressSqueezeScale,
} from "@/components/core/utils/hoverInteractiveLift";
import {
  playShadowFade,
  snapShadowFade,
  type ShadowFadeKind,
  type ShadowFadeName,
} from "@/components/core/utils/shadowFade";

export type MotionShadowFadeOptions = {
  kind?: ShadowFadeKind;
  /** Seconds. Omit to snap opacities. */
  duration?: number;
  ease?: string;
};

export function createMotionSurfaceApi(host: {
  el: HTMLElement;
  config: Readonly<MotionConfig>;
}) {
  return {
    shadowFade(state: ShadowFadeName, options?: MotionShadowFadeOptions) {
      const kind = options?.kind ?? "elevation";
      if (options?.duration == null) {
        snapShadowFade(host.el, state, kind);
        return;
      }
      playShadowFade(host.el, state, {
        duration: options.duration,
        ease: options.ease ?? host.config.hoverLiftEase,
        kind,
      });
    },
    adaptiveScale(which: "hover" | "press") {
      return which === "press"
        ? resolveAdaptivePressSqueezeScale(host.el, host.config)
        : resolveAdaptiveHoverLiftScale(host.el, host.config);
    },
  };
}
