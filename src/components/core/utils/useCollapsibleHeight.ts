import { useLayoutEffect, useRef, type RefObject } from "react";

import { gsap, killMotion } from "./gsapMotion";
import { getMotionConfig, motionExpandClose, motionExpandOpen } from "./motionConfig";
import { prefersReducedInteractiveHoverLift } from "./hoverInteractiveLift";

export function releaseExpandedShellHeight(shell: HTMLElement, inner: HTMLElement) {
  const measured = inner.scrollHeight;
  shell.style.height = `${measured}px`;
  requestAnimationFrame(() => {
    shell.style.height = "auto";
    shell.style.overflow = "";
  });
}

/**
 * GSAP-анимация высоты collapsible-панели (Expandable, Accordion).
 * Не задавайте `style.height` на shell снаружи — React перезапишет tween.
 */
export function useCollapsibleHeight(
  open: boolean,
  shellRef: RefObject<HTMLElement | null>,
  innerRef: RefObject<HTMLElement | null>,
  enabled = () => getMotionConfig().enableExpandable,
) {
  const isFirstRender = useRef(true);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    const inner = innerRef.current;
    if (!shell || !inner) return;

    const reduceMotion = prefersReducedInteractiveHoverLift() || !enabled();

    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (!open) {
        shell.style.height = "0px";
        shell.style.overflow = "hidden";
      }
      return;
    }

    killMotion(shell);

    if (reduceMotion) {
      if (open) {
        shell.style.height = "auto";
        shell.style.overflow = "";
      } else {
        shell.style.height = "0px";
        shell.style.overflow = "hidden";
      }
      return;
    }

    if (open) {
      shell.style.overflow = "hidden";
      gsap.fromTo(
        shell,
        { height: 0 },
        {
          height: () => inner.scrollHeight,
          ...motionExpandOpen(),
          overwrite: "auto",
          onComplete: () => releaseExpandedShellHeight(shell, inner),
        },
      );
    } else {
      const current = shell.scrollHeight || shell.getBoundingClientRect().height;
      shell.style.height = `${current}px`;
      shell.style.overflow = "hidden";
      gsap.to(shell, {
        height: 0,
        ...motionExpandClose(),
        overwrite: "auto",
        onComplete: () => {
          shell.style.height = "0px";
          shell.style.overflow = "hidden";
        },
      });
    }
  }, [open, shellRef, innerRef, enabled]);
}
