import {
  useCallback,
  useLayoutEffect,
  useRef,
  type RefObject,
} from "react";

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

export function applyCollapsibleInstantState(shell: HTMLElement, open: boolean) {
  if (open) {
    shell.style.height = "auto";
    shell.style.overflow = "";
  } else {
    shell.style.height = "0px";
    shell.style.overflow = "hidden";
  }
}

const COLLAPSIBLE_INIT_ATTR = "data-collapsible-init";

/**
 * Ref-callback: синхронно до paint выставляет высоту по начальному `open`.
 * Не через React `style` — иначе re-render (hasPanel и т.п.) сбросит inline-стили.
 */
export function useCollapsibleShellRef(
  shellRef: RefObject<HTMLElement | null>,
  open: boolean,
) {
  const initialOpenRef = useRef(open);

  return useCallback(
    (node: HTMLElement | null) => {
      shellRef.current = node;
      if (node && !node.hasAttribute(COLLAPSIBLE_INIT_ATTR)) {
        node.setAttribute(COLLAPSIBLE_INIT_ATTR, "");
        applyCollapsibleInstantState(node, initialOpenRef.current);
      }
    },
    [shellRef],
  );
}

/**
 * GSAP-анимация высоты collapsible-панели (Expandable, Accordion).
 */
export function useCollapsibleHeight(
  open: boolean,
  shellRef: RefObject<HTMLElement | null>,
  innerRef: RefObject<HTMLElement | null>,
  enabled = () => getMotionConfig().enableExpandable,
) {
  const prevOpenRef = useRef<boolean | undefined>(undefined);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    const inner = innerRef.current;
    if (!shell || !inner) return;

    const reduceMotion = prefersReducedInteractiveHoverLift() || !enabled();

    if (prevOpenRef.current === undefined) {
      prevOpenRef.current = open;
      applyCollapsibleInstantState(shell, open);
      return;
    }

    if (prevOpenRef.current === open) return;
    prevOpenRef.current = open;

    killMotion(shell);

    if (reduceMotion) {
      applyCollapsibleInstantState(shell, open);
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
