/**
 * Slot motion for SearchInput — look here first.
 *
 * DOM slots: `root` (search shell), `icon`, `clear`, `input`, `expandTrigger`
 *
 * Host: root (`useSearchInputAnimations`) plays hover/press when not,
 * and `enter` / `leave` on expand/collapse (`searchExpand` width/radius + `searchIconShift` on icon).
 * hover/press/focus stay on `useFieldShellMotion` (field-shell focus lift).
 *
 * Defaults: `resolveSearchInputMotionDefaults`.
 */
import { useCallback, useLayoutEffect, useMemo, useRef, type MutableRefObject } from "react";
 
import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { readControlHeightPx } from "@/components/core/utils/controlHeightMeasure";
import { shouldSkipInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import {
  mergeMotionPointerHandlers,
  useMotionPointerPhases,
} from "@/components/core/utils/slotMotion";
import { applySearchExpandInstant } from "@/components/core/utils/searchInputExpandMotion";
import { useSecondLevelShadow } from "@/components/core/utils/useShadowMotion";
import { isKitVariant, overlaySkinMotion } from "@/skins/resolveVariantVisual";
import { readSearchExpandedRadiusPx } from "./searchInputStyles";
import type {
  SearchInputMotion,
  SearchInputSize,
  SearchInputVariant,
  SearchSizeLayout,
  UseSearchInputAnimationsProps,
} from "./searchInputTypes";
import { KIT_SEARCH_INPUT_VARIANTS } from "./searchInputTypes";
import { useSearchInputMotionScope } from "./searchInputContext";

export function resolveSearchInputMotionDefaults({
  variant,
  blocked,
  groupSegment,
  expanded,
}: {
  variant: SearchInputVariant;
  blocked: boolean;
  groupSegment?: unknown;
  expanded: boolean;
}): SearchInputMotion {
  const hover = !blocked && groupSegment == null;
  const press = !blocked && !expanded && groupSegment == null;
  return overlaySkinMotion(
    {
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
    },
    variant,
    KIT_SEARCH_INPUT_VARIANTS,
    "searchInput",
  );
}

export function resolveSearchInputMotionParams({
  variant,
  size,
  layout,
  targetW,
  expanded,
  blocked,
  groupSegment,
  pointerInside,
}: {
  variant: SearchInputVariant;
  size: SearchInputSize;
  layout: SearchSizeLayout;
  targetW: number;
  expanded: boolean;
  blocked: boolean;
  groupSegment?: unknown;
  pointerInside: MutableRefObject<boolean>;
}) {
  const kitSurface = isKitVariant(variant, KIT_SEARCH_INPUT_VARIANTS);
  return {
    targetW,
    collapsedDim: readControlHeightPx(size),
    expandedRadius: readSearchExpandedRadiusPx(size),
    padX: layout.padX,
    iconBox: layout.iconBox,
    iconLeftCollapsedCss: `calc(50% - ${layout.iconBox / 2}px)`,
    shadowSize: expanded ? ("base" as const) : ("none" as const),
    hasHoverShadow: !blocked && kitSurface && groupSegment == null,
    pointerInside,
  };
}
 
export function useSearchInputAnimations({
  size,
  expanded,
  blocked,
  variant,
  groupSegment,
  layout,
  targetW,
  motion,
  rootRef,
  iconRef,
  pointerInsideRef,
}: UseSearchInputAnimationsProps) {
  const scope = useSearchInputMotionScope();
  const rootMotionRef = useRef(motion?.root);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
  rootMotionRef.current = motion?.root;
  const squeezePromiseRef = useRef<Promise<void> | null>(null);
  const layoutReadyRef = useRef(false);
  const prevExpandedRef = useRef(expanded);
  const initialExpandedRef = useRef(expanded);
 
  const collapsedDim = readControlHeightPx(size);
  const iconLeftCollapsedCss = `calc(50% - ${layout.iconBox / 2}px)`;
 
  const kitSurface = isKitVariant(variant, KIT_SEARCH_INPUT_VARIANTS);
  const shellActive = !blocked && groupSegment == null;

  const standardShellHover = useSecondLevelShadow(
    rootRef,
    shellActive && kitSurface,
    {
      shadowSize: expanded ? "base" : "none",
      idleSyncKey: expanded,
      interactive: false,
      pointerInsideRef,
    },
  );

  const bindRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      scope.registerTarget("root", node);
    },
    [rootRef, scope],
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
      if (blocked) return;
      const el = rootRef.current;
      if (!el) return;
      const value = scope.resolve("root", phase, rootMotionRef.current);
      if (value === undefined || value === false) return;
      scope.play("root", phase, { partMotion: rootMotionRef.current, el });
    },
    [blocked, rootRef, scope],
  );

  const motionPointer = useMotionPointerPhases<HTMLDivElement>({
    enabled: shellActive,
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
    const pressIn = scope.resolve("root", "pressIn", rootMotionRef.current);
    if (pressIn === false || pressIn === undefined) {
      squeezePromiseRef.current = Promise.resolve();
      return;
    }
    squeezePromiseRef.current = scope.play("root", "pressIn", {
      partMotion: rootMotionRef.current,
      el: shell,
    }).finished;
  }, [blocked, expanded, rootRef, scope]);

  const awaitPressSqueeze = useCallback(async () => {
    await (squeezePromiseRef.current ?? Promise.resolve());
    squeezePromiseRef.current = null;
  }, []);

  return {
    bindRootRef,
    bindIconRef,
    beginPressSqueeze,
    awaitPressSqueeze,
    handlePointerEnter: hoverHandlers.onPointerOver,
    handlePointerLeave: hoverHandlers.onPointerOut,
    shellHoverMotionClass: kitSurface ? standardShellHover.motionClass : "",
    expandMetrics,
  };
}
 
