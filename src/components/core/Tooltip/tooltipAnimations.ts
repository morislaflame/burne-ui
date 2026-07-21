import { useLayoutEffect, type RefObject } from "react";

import { killMotion } from "@/components/core/utils/gsapMotion";
import { animatePortalClose, animatePortalOpen, applyReducedPortalMotion, isReducedModalMotion } from "@/components/core/utils/modalSurfaceMotion";
import { motionTooltip } from "@/components/core/utils/motionConfig";

export function useTooltipPortalMotion({
  open,
  portalMounted,
  setPortalMounted,
  tipRef,
}: {
  open: boolean;
  portalMounted: boolean;
  setPortalMounted: (mounted: boolean) => void;
  tipRef: RefObject<HTMLDivElement | null>;
}) {
  useLayoutEffect(() => {
    if (!portalMounted) return undefined;
    const el = tipRef.current;
    if (!el) return undefined;

    const reduced = isReducedModalMotion();
    let cancelled = false;

    if (reduced) {
      killMotion(el);
      if (open) {
        applyReducedPortalMotion(el);
      } else {
        setPortalMounted(false);
      }
      return () => {
        cancelled = true;
      };
    }

    killMotion(el);

    if (open) {
      animatePortalOpen({
        surface: el,
        vars: { ...motionTooltip(), overwrite: "auto" },
      });
      return () => {
        cancelled = true;
        killMotion(el);
      };
    }

    const anim = animatePortalClose({
      surface: el,
      vars: { ...motionTooltip(), overwrite: "auto" },
      onComplete: () => {
        if (!cancelled) setPortalMounted(false);
      },
    });
    return () => {
      cancelled = true;
      killMotion(el);
      anim.kill();
    };
  }, [open, portalMounted, setPortalMounted, tipRef]);
}
