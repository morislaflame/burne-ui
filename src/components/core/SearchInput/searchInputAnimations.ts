/**
 * Slot motion for SearchInput — look here first.
 *
 * DOM slots: `root` (search shell), `icon`, `clear`, `input`, `expandTrigger`
 *
 * Host: root (`useSearchInputAnimations`) plays hover/press when not gloss,
 * and `enter` / `leave` on expand/collapse (FLIP: `searchExpand` + `searchIconShift` on icon).
 * Gloss hover/press/focus stay on `useGlossFieldShellMotion` (field-shell focus lift).
 *
 * Defaults: `resolveSearchInputMotionDefaults`.
 */
import { useCallback, useLayoutEffect, useMemo, useRef, type MutableRefObject } from "react";

import { useMotionConfig } from "@/components/core/utils/motionConfigContext";
import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";
import {
  animateGlossInteractivePressSqueeze,
  useGlossFieldShellMotion,
} from "@/components/core/utils/glossInteractiveMotion";
import { readControlHeightPx } from "@/components/core/utils/controlHeightMeasure";
import { shouldSkipInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import {
  mergeMotionPointerHandlers,
  useMotionPointerPhases,
  type MotionValue,
} from "@/components/core/utils/slotMotion";
import { applySearchExpandInstant } from "@/components/core/utils/searchInputExpandMotion";
import { useSecondLevelShadow } from "@/components/core/utils/useShadowMotion";
import { readSearchExpandedRadiusPx } from "./searchInputStyles";
import type {
  SearchInputMotion,
  SearchInputSize,
  SearchSizeLayout,
  UseSearchInputAnimationsProps,
} from "./searchInputTypes";
import { useSearchInputMotionScope } from "./searchInputContext";

import "../utils/glossInteractive.css";

function isKitPressSqueeze(value: MotionValue | undefined): boolean {
  if (typeof value === "string") {
    return value === "pressSqueeze" || value === "pressSqueezeGloss";
  }
  if (value && typeof value === "object" && "recipe" in value) {
    const recipe = (value as { recipe?: unknown }).recipe;
    return recipe === "pressSqueeze" || recipe === "pressSqueezeGloss";
  }
  return false;
}

export function resolveSearchInputMotionDefaults({
  isGloss,
  blocked,
  groupSegment,
  expanded,
}: {
  isGloss: boolean;
  blocked: boolean;
  groupSegment?: unknown;
  expanded: boolean;
}): SearchInputMotion {
  const hover = !blocked && !isGloss && groupSegment == null;
  const press = !blocked && !expanded && !isGloss && groupSegment == null;
  return {
    root: {
      hoverIn: hover ? "hoverLiftSecondLevel" : false,
      hoverOut: hover ? "hoverLiftSecondLevel" : false,
      pressIn: press ? "pressSqueeze" : false,
      pressOut: false,
      enter: "searchExpand",
      leave: "searchExpand",
    },
    icon: {
      enter: "searchIconShift",
      leave: "searchIconShift",
    },
  };
}

export function resolveSearchInputMotionParams({
  size,
  layout,
  targetW,
  expanded,
  blocked,
  isGloss,
  groupSegment,
  pointerInside,
}: {
  size: SearchInputSize;
  layout: SearchSizeLayout;
  targetW: number;
  expanded: boolean;
  blocked: boolean;
  isGloss: boolean;
  groupSegment?: unknown;
  pointerInside: MutableRefObject<boolean>;
}) {
  return {
    targetW,
    collapsedDim: readControlHeightPx(size),
    expandedRadius: readSearchExpandedRadiusPx(size),
    padX: layout.padX,
    iconBox: layout.iconBox,
    iconLeftCollapsedCss: `calc(50% - ${layout.iconBox / 2}px)`,
    shadowSize: expanded ? ("base" as const) : ("none" as const),
    hasHoverShadow: !blocked && !isGloss && groupSegment == null,
    isGloss,
    pointerInside,
  };
}

export function useSearchInputAnimations({
  size,
  expanded,
  blocked,
  isGloss,
  groupSegment,
  layout,
  targetW,
  motion,
  rootRef,
  iconRef,
  pointerInsideRef,
}: UseSearchInputAnimationsProps) {
  const config = useMotionConfig();
  const scope = useSearchInputMotionScope();
  const rootMotionRef = useRef(motion?.root);
  rootMotionRef.current = motion?.root;
  const squeezePromiseRef = useRef<Promise<void> | null>(null);
  const layoutReadyRef = useRef(false);
  const prevExpandedRef = useRef(expanded);
  const initialExpandedRef = useRef(expanded);

  const collapsedDim = readControlHeightPx(size);
  const iconLeftCollapsedCss = `calc(50% - ${layout.iconBox / 2}px)`;

  const standardShellHover = useSecondLevelShadow(
    rootRef,
    !blocked && !isGloss && groupSegment == null,
    {
      shadowSize: expanded ? "base" : "none",
      idleSyncKey: expanded,
      interactive: false,
      pointerInsideRef,
    },
  );
  const glossShellMotion = useGlossFieldShellMotion(
    rootRef,
    !blocked && isGloss && groupSegment == null,
  );

  const bindRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      scope.registerTarget("root", node);
      if (!blocked && isGloss && groupSegment == null) {
        glossShellMotion.bindShellRef(node);
      }
    },
    [blocked, glossShellMotion, groupSegment, isGloss, rootRef, scope],
  );

  const bindIconRef = useCallback(
    (node: HTMLSpanElement | null) => {
      iconRef.current = node;
      scope.registerTarget("icon", node);
      if (node && !node.hasAttribute("data-search-icon-init")) {
        node.setAttribute("data-search-icon-init", "");
        node.style.left = initialExpandedRef.current ? `${layout.padX}px` : iconLeftCollapsedCss;
      }
    },
    [iconLeftCollapsedCss, iconRef, layout.padX, scope],
  );

  const expandMetrics = useMemo(
    () => ({
      targetW,
      collapsedDim,
      expandedRadius: readSearchExpandedRadiusPx(size),
      padX: layout.padX,
      iconBox: layout.iconBox,
      iconLeftCollapsedCss,
    }),
    [collapsedDim, iconLeftCollapsedCss, layout.iconBox, layout.padX, size, targetW],
  );

  const applyInstant = useCallback(
    (open: boolean) => {
      const el = rootRef.current;
      const iconEl = iconRef.current;
      if (!el) return;
      applySearchExpandInstant(el, iconEl, open, expandMetrics);
    },
    [expandMetrics, iconRef, rootRef],
  );

  const playExpandPhase = useCallback(
    (open: boolean) => {
      const phase = open ? "enter" : "leave";
      const rootValue = scope.resolve("root", phase, rootMotionRef.current);
      if (rootValue === false || rootValue === undefined) {
        applyInstant(open);
      } else {
        scope.play("root", phase, { partMotion: rootMotionRef.current, el: rootRef.current });
      }
      void scope.playBroadcast(phase, { exclude: ["root"] });
    },
    [applyInstant, rootRef, scope],
  );

  useLayoutEffect(() => {
    if (!layoutReadyRef.current) {
      layoutReadyRef.current = true;
      applyInstant(expanded);
      prevExpandedRef.current = expanded;
      return;
    }
    if (prevExpandedRef.current === expanded) return;
    prevExpandedRef.current = expanded;
    playExpandPhase(expanded);
  }, [applyInstant, expanded, playExpandPhase]);

  const playRoot = useCallback(
    (phase: "hoverIn" | "hoverOut" | "pressIn" | "pressOut") => {
      if (blocked || isGloss) return;
      const el = rootRef.current;
      if (!el) return;
      const value = scope.resolve("root", phase, rootMotionRef.current);
      if (value === undefined) return;
      scope.play("root", phase, { partMotion: rootMotionRef.current, el });
    },
    [blocked, isGloss, rootRef, scope],
  );

  const motionPointer = useMotionPointerPhases<HTMLDivElement>({
    enabled: !blocked && !isGloss && groupSegment == null,
    targetRef: rootRef,
    pointerInsideRef,
    skipHover: shouldSkipInteractiveHoverLift,
    onHoverIn: () => playRoot("hoverIn"),
    onHoverOut: () => playRoot("hoverOut"),
  });

  const hoverHandlers = useMemo(
    () =>
      mergeMotionPointerHandlers(
        undefined,
        undefined,
        motionPointer.onPointerOver,
        motionPointer.onPointerOut,
      ),
    [motionPointer.onPointerOut, motionPointer.onPointerOver],
  );

  const beginPressSqueeze = useCallback(() => {
    if (blocked || expanded) return;
    const shell = rootRef.current;
    if (!shell || prefersReducedMotion()) {
      squeezePromiseRef.current = Promise.resolve();
      return;
    }
    if (isGloss && groupSegment == null) {
      squeezePromiseRef.current = animateGlossInteractivePressSqueeze(
        shell,
        false,
        undefined,
        undefined,
        { config },
      ).then(() => {});
      return;
    }
    const pressIn = scope.resolve("root", "pressIn", rootMotionRef.current);
    if (pressIn === false || pressIn === undefined) {
      squeezePromiseRef.current = Promise.resolve();
      return;
    }
    if (isKitPressSqueeze(pressIn) || pressIn) {
      squeezePromiseRef.current = scope.play("root", "pressIn", {
        partMotion: rootMotionRef.current,
        el: shell,
      }).finished;
    }
  }, [blocked, config, expanded, groupSegment, isGloss, rootRef, scope]);

  const awaitPressSqueeze = useCallback(async () => {
    await (squeezePromiseRef.current ?? Promise.resolve());
    squeezePromiseRef.current = null;
  }, []);

  const handlePointerEnter =
    isGloss && groupSegment == null
      ? glossShellMotion.onShellPointerEnter
      : hoverHandlers.onPointerOver;
  const handlePointerLeave =
    isGloss && groupSegment == null
      ? glossShellMotion.onShellPointerLeave
      : hoverHandlers.onPointerOut;

  return {
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
    expandMetrics,
  };
}
