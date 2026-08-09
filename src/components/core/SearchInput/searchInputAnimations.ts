import { useCallback, useLayoutEffect, useRef } from "react";

import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { animateInteractivePressSqueeze } from "@/components/core/utils/hoverInteractiveLift";
import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";
import {
  animateGlossInteractivePressSqueeze,
  useGlossFieldShellMotion,
} from "@/components/core/utils/glossInteractiveMotion";
import { motionInteractive } from "@/components/core/utils/motionConfig";
import { readControlHeightPx } from "@/components/core/utils/controlHeightMeasure";
import { useSecondLevelShadow } from "@/components/core/utils/useShadowMotion";

import { readSearchExpandedRadiusPx } from "./searchInputStyles";
import type { UseSearchInputAnimationsProps } from "./searchInputTypes";

import "../utils/glossInteractive.css";

export function useSearchInputAnimations({
  size,
  expanded,
  blocked,
  isGloss,
  groupSegment,
  layout,
  targetW,
}: UseSearchInputAnimationsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const squeezePromiseRef = useRef<Promise<void> | null>(null);
  const layoutReadyRef = useRef(false);
  const prevExpandedRef = useRef(expanded);
  const initialExpandedRef = useRef(expanded);

  const collapsedDim = readControlHeightPx(size);

  const standardShellHover = useSecondLevelShadow(
    rootRef,
    !blocked && !isGloss && groupSegment == null,
    {
      shadowSize: expanded ? "base" : "none",
      idleSyncKey: expanded,
    },
  );
  const glossShellMotion = useGlossFieldShellMotion(
    rootRef,
    !blocked && isGloss && groupSegment == null,
  );

  const bindRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (!blocked && isGloss && groupSegment == null) {
        glossShellMotion.bindShellRef(node);
      }
    },
    [blocked, glossShellMotion, groupSegment, isGloss],
  );

  const shellHorizontalBorderPx = useCallback(
    (shellEl: HTMLElement) => shellEl.offsetWidth - shellEl.clientWidth,
    [],
  );

  const iconLeftCollapsedAtBorderBoxWidth = useCallback(
    (borderBoxWidth: number, borderPx: number) =>
      (borderBoxWidth - borderPx - layout.iconBox) / 2,
    [layout.iconBox],
  );

  const iconLeftCollapsedCss = `calc(50% - ${layout.iconBox / 2}px)`;

  const bindIconRef = useCallback(
    (node: HTMLSpanElement | null) => {
      iconRef.current = node;
      if (node && !node.hasAttribute("data-search-icon-init")) {
        node.setAttribute("data-search-icon-init", "");
        const open = initialExpandedRef.current;
        node.style.left = open ? `${layout.padX}px` : iconLeftCollapsedCss;
      }
    },
    [iconLeftCollapsedCss, layout.padX],
  );

  const applyShellMetrics = useCallback(
    (open: boolean) => {
      const el = rootRef.current;
      const iconEl = iconRef.current;
      if (!el || !iconEl) return;
      if (open) {
        el.style.width = `${targetW}px`;
      } else {
        el.style.removeProperty("width");
      }
      el.style.removeProperty("height");
      el.style.removeProperty("borderRadius");
      iconEl.style.left = open ? `${layout.padX}px` : iconLeftCollapsedCss;
    },
    [iconLeftCollapsedCss, layout.padX, targetW],
  );

  const runExpandMotion = useCallback(
    (open: boolean) => {
      const el = rootRef.current;
      const iconEl = iconRef.current;
      if (!el || !iconEl) return;

      if (prefersReducedMotion()) {
        applyShellMetrics(open);
        return;
      }

      killMotion(el);
      killMotion(iconEl);
      el.style.removeProperty("borderRadius");

      const expandedRadius = readSearchExpandedRadiusPx(size);

      if (open) {
        el.style.width = `${collapsedDim}px`;
        el.style.borderRadius = `${collapsedDim / 2}px`;
        const iconLeftFrom = (el.clientWidth - layout.iconBox) / 2;
        iconEl.style.left = `${iconLeftFrom}px`;

        const vars = motionInteractive();
        gsap
          .timeline({
            onComplete: () => {
              el.style.removeProperty("borderRadius");
            },
          })
          .to(
            el,
            {
              width: targetW,
              borderRadius: expandedRadius,
              ...vars,
              overwrite: "auto",
            },
            0,
          )
          .to(
            iconEl,
            {
              left: layout.padX,
              ...vars,
              overwrite: "auto",
            },
            0,
          );
        return;
      }

      const borderPx = shellHorizontalBorderPx(el);
      const iconLeftTo = iconLeftCollapsedAtBorderBoxWidth(collapsedDim, borderPx);

      iconEl.style.left = `${layout.padX}px`;
      const vars = motionInteractive();
      gsap
        .timeline({
          onComplete: () => {
            el.style.removeProperty("width");
            el.style.removeProperty("borderRadius");
            iconEl.style.left = iconLeftCollapsedCss;
          },
        })
        .to(
          el,
          {
            width: collapsedDim,
            borderRadius: collapsedDim / 2,
            ...vars,
            overwrite: "auto",
          },
          0,
        )
        .to(
          iconEl,
          {
            left: iconLeftTo,
            ...vars,
            overwrite: "auto",
          },
          0,
        );
    },
    [
      applyShellMetrics,
      collapsedDim,
      iconLeftCollapsedAtBorderBoxWidth,
      iconLeftCollapsedCss,
      layout.iconBox,
      layout.padX,
      shellHorizontalBorderPx,
      size,
      targetW,
    ],
  );

  useLayoutEffect(() => {
    if (!layoutReadyRef.current) {
      layoutReadyRef.current = true;
      applyShellMetrics(expanded);
      prevExpandedRef.current = expanded;
      return;
    }
    if (prevExpandedRef.current === expanded) return;
    prevExpandedRef.current = expanded;
    runExpandMotion(expanded);
  }, [applyShellMetrics, expanded, runExpandMotion]);

  const beginPressSqueeze = useCallback(() => {
    if (blocked || expanded) return;
    const shell = rootRef.current;
    if (!shell || prefersReducedMotion()) {
      squeezePromiseRef.current = Promise.resolve();
      return;
    }
    squeezePromiseRef.current =
      isGloss && groupSegment == null
        ? animateGlossInteractivePressSqueeze(shell)
        : animateInteractivePressSqueeze(shell).then(() => {});
  }, [blocked, expanded, groupSegment, isGloss]);

  const awaitPressSqueeze = useCallback(async () => {
    await (squeezePromiseRef.current ?? Promise.resolve());
    squeezePromiseRef.current = null;
  }, []);

  const handlePointerEnter =
    isGloss && groupSegment == null
      ? glossShellMotion.onShellPointerEnter
      : standardShellHover.onPointerEnter;
  const handlePointerLeave =
    isGloss && groupSegment == null
      ? glossShellMotion.onShellPointerLeave
      : standardShellHover.onPointerLeave;

  return {
    rootRef,
    bindRootRef,
    bindIconRef,
    beginPressSqueeze,
    awaitPressSqueeze,
    handlePointerEnter,
    handlePointerLeave,
    onShellFocusIn:
      isGloss && groupSegment == null ? glossShellMotion.onShellFocusIn : undefined,
    onShellFocusOut:
      isGloss && groupSegment == null ? glossShellMotion.onShellFocusOut : undefined,
    shellHoverMotionClass: glossShellMotion.shellHoverMotionClass,
    standardMotionClass: standardShellHover.motionClass,
  };
}
