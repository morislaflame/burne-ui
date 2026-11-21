import {
  Children,
  Fragment,
  forwardRef,
  isValidElement,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ForwardedRef,
  type ReactNode,
} from "react";

import { useSkinVariant } from "@/skins/skinContext";

import { resolveResizableMotionDefaults, useResizableRootMotion } from "./resizableAnimations";
import { ResizableLayoutProvider, ResizableMotionProvider } from "./resizableContext";
import { ResizableHandle, ResizablePanel } from "./resizableParts";
import { resizableRootClass } from "./resizableStyles";
import type {
  ResizableLayoutValue,
  ResizableOrientation,
  ResizablePanelConstraints,
  ResizablePartMotion,
  ResizableProps,
} from "./resizableTypes";

export type {
  ResizableClassNames,
  ResizableHandleProps,
  ResizableMotion,
  ResizableOrientation,
  ResizablePanelProps,
  ResizablePartMotion,
  ResizableProps,
} from "./resizableTypes";

const DEFAULT_MIN_SIZE = 8;
const DEFAULT_MAX_SIZE = 100;

function normalizeResizableSizes(
  order: string[],
  specs: Map<string, ResizablePanelConstraints>,
  prev: Record<string, number>,
  preserveExisting: boolean,
): Record<string, number> {
  if (order.length === 0) {
    return Object.keys(prev).length === 0 ? prev : {};
  }

  const n = order.length;
  const bounds = new Map<string, { min: number; max: number }>();
  for (const id of order) {
    const spec = specs.get(id);
    const min = Math.min(100, Math.max(0, Number.isFinite(spec?.minSize) ? (spec?.minSize ?? DEFAULT_MIN_SIZE) : DEFAULT_MIN_SIZE));
    const rawMax = Number.isFinite(spec?.maxSize) ? (spec?.maxSize ?? DEFAULT_MAX_SIZE) : DEFAULT_MAX_SIZE;
    const max = Math.min(100, Math.max(min, rawMax));
    bounds.set(id, { min, max });
  }

  const existingIds = preserveExisting
    ? order.filter((id) => id in prev && Number.isFinite(prev[id]))
    : [];
  const newIds = preserveExisting
    ? order.filter((id) => !(id in prev && Number.isFinite(prev[id])))
    : order;
  const prevKeys = Object.keys(prev);

  if (preserveExisting && existingIds.length === n && prevKeys.length === n) {
    const currentSum = order.reduce((acc, id) => acc + (prev[id] ?? 0), 0);
    const allWithinBounds = order.every((id) => {
      const b = bounds.get(id)!;
      const v = prev[id] ?? 0;
      return v >= b.min - 1e-4 && v <= b.max + 1e-4;
    });
    if (allWithinBounds && Math.abs(currentSum - 100) < 1e-2) {
      return prev;
    }
  }

  const raw: Record<string, number> = {};
  if (existingIds.length === 0) {
    let definedSum = 0;
    let missingCount = 0;
    for (const id of order) {
      const def = specs.get(id)?.defaultSize;
      if (def != null && Number.isFinite(def) && def >= 0) {
        definedSum += def;
      } else {
        missingCount += 1;
      }
    }
    const fallbackShare = missingCount > 0 ? Math.max(0, 100 - definedSum) / missingCount : 0;
    for (const id of order) {
      const def = specs.get(id)?.defaultSize;
      raw[id] = def != null && Number.isFinite(def) && def >= 0 ? def : fallbackShare;
    }
  } else if (newIds.length === 0) {
    for (const id of order) {
      raw[id] = Math.max(0, prev[id] ?? 0);
    }
  } else {
    let desiredNewSum = 0;
    for (const id of newIds) {
      const def = specs.get(id)?.defaultSize;
      const share = def != null && Number.isFinite(def) && def >= 0 ? def : 100 / n;
      raw[id] = share;
      desiredNewSum += share;
    }
    const cappedNewSum = Math.min(90, desiredNewSum);
    const newScale = desiredNewSum > 0 ? cappedNewSum / desiredNewSum : 1;
    for (const id of newIds) {
      raw[id] = (raw[id] ?? 0) * newScale;
    }
    const existingSum = existingIds.reduce((acc, id) => acc + Math.max(0, prev[id] ?? 0), 0);
    const remainingForExisting = Math.max(0, 100 - cappedNewSum);
    for (const id of existingIds) {
      raw[id] =
        existingSum > 0
          ? (Math.max(0, prev[id] ?? 0) / existingSum) * remainingForExisting
          : remainingForExisting / existingIds.length;
    }
  }

  const next: Record<string, number> = {};
  const rawTotal = order.reduce((acc, id) => acc + Math.max(0, raw[id] ?? 0), 0);
  for (const id of order) {
    next[id] = rawTotal > 0 ? (Math.max(0, raw[id] ?? 0) / rawTotal) * 100 : 100 / n;
  }

  const locked = new Set<string>();
  for (let iter = 0; iter < n + 2; iter += 1) {
    let changed = false;
    for (const id of order) {
      if (locked.has(id)) continue;
      const b = bounds.get(id)!;
      if (next[id]! < b.min - 1e-6) {
        next[id] = b.min;
        locked.add(id);
        changed = true;
      } else if (next[id]! > b.max + 1e-6) {
        next[id] = b.max;
        locked.add(id);
        changed = true;
      }
    }
    if (!changed) break;
    const unlocked = order.filter((id) => !locked.has(id));
    if (unlocked.length === 0) break;
    const lockedSum = order
      .filter((id) => locked.has(id))
      .reduce((acc, id) => acc + (next[id] ?? 0), 0);
    const remaining = Math.max(0, 100 - lockedSum);
    const unlockedSum = unlocked.reduce((acc, id) => acc + Math.max(0, next[id] ?? 0), 0);
    for (const id of unlocked) {
      next[id] =
        unlockedSum > 0
          ? (Math.max(0, next[id] ?? 0) / unlockedSum) * remaining
          : remaining / unlocked.length;
    }
  }

  const sameKeys =
    prevKeys.length === n && order.every((id) => id in prev && Math.abs((prev[id] ?? 0) - (next[id] ?? 0)) < 1e-4);
  return sameKeys ? prev : next;
}

export const Resizable = forwardRef<HTMLDivElement, ResizableProps>(function Resizable(
  {
    orientation = "horizontal",
    className = "",
    classNames,
    children,
    motion,
    motionController,
    motionState,
    motionPayload,
    playInitialState,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
    ...rest
  },
  ref,
) {
  const motionDefaults = useMemo(() => resolveResizableMotionDefaults(), []);
  const [sizes, setSizes] = useState<Record<string, number>>({});
  const [registryVersion, setRegistryVersion] = useState(0);
  const specsRef = useRef(new Map<string, ResizablePanelConstraints>());
  const rootElRef = useRef<HTMLDivElement | null>(null);
  const userResizedRef = useRef(false);

  const commit = useCallback((updater: (prev: Record<string, number>) => Record<string, number>) => {
    userResizedRef.current = true;
    setSizes((prev) => updater(prev));
  }, []);

  const syncNormalizedSizes = useCallback(() => {
    const specs = specsRef.current;
    let order = Array.from(specs.keys());
    const root = rootElRef.current;
    if (root && order.length > 1) {
      const domOrder: string[] = [];
      for (const child of Array.from(root.children)) {
        if (child instanceof HTMLElement && child.dataset.value && specs.has(child.dataset.value)) {
          domOrder.push(child.dataset.value);
        }
      }
      if (domOrder.length === order.length) {
        order = domOrder;
      }
    }
    const preserve = userResizedRef.current;
    setSizes((prev) => normalizeResizableSizes(order, specs, prev, preserve));
  }, []);

  useLayoutEffect(() => {
    syncNormalizedSizes();
  }, [registryVersion, syncNormalizedSizes]);

  const registerPanel = useCallback(
    (id: string, spec: ResizablePanelConstraints) => {
      specsRef.current.set(id, spec);
      setRegistryVersion((v) => v + 1);
    },
    [],
  );

  const unregisterPanel = useCallback(
    (id: string) => {
      if (!specsRef.current.has(id)) return;
      specsRef.current.delete(id);
      setRegistryVersion((v) => v + 1);
    },
    [],
  );

  const handleCount = countResizableHandles(children);

  const layout = useMemo<ResizableLayoutValue>(() => ({
    orientation,
    sizes,
    panelClass: classNames?.panel,
    handleClass: classNames?.handle,
    commit,
    registerPanel,
    unregisterPanel,
    minOf: (id) => {
      const min = specsRef.current.get(id)?.minSize ?? DEFAULT_MIN_SIZE;
      return Number.isFinite(min) ? Math.min(100, Math.max(0, min)) : DEFAULT_MIN_SIZE;
    },
    maxOf: (id) => {
      const spec = specsRef.current.get(id);
      const min = Number.isFinite(spec?.minSize) ? Math.min(100, Math.max(0, spec!.minSize)) : DEFAULT_MIN_SIZE;
      const max = Number.isFinite(spec?.maxSize) ? spec!.maxSize : DEFAULT_MAX_SIZE;
      return Math.min(100, Math.max(min, max));
    },
  }), [classNames?.handle, classNames?.panel, commit, orientation, registerPanel, sizes, unregisterPanel]);

  return (
    <ResizableMotionProvider
      motion={motion}
      defaults={motionDefaults}
      controller={motionController}
      motionState={motionState}
      motionPayload={motionPayload}
      playInitialState={playInitialState}
    >
      <ResizableLayoutProvider value={layout}>
        <ResizableSurface
          orientation={orientation}
          className={className}
          slotClass={classNames?.root}
          forwardedRef={ref}
          rootElRef={rootElRef}
          rootMotion={motion?.root}
          onPointerOver={onPointerOver}
          onPointerOut={onPointerOut}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          rest={rest}
          handleCount={handleCount}
        >
          {children}
        </ResizableSurface>
      </ResizableLayoutProvider>
    </ResizableMotionProvider>
  );
});

function ResizableSurface({
  orientation,
  className,
  slotClass,
  children,
  forwardedRef,
  rootElRef,
  rootMotion,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  rest,
  handleCount,
}: {
  orientation: ResizableOrientation;
  className: string;
  slotClass?: string;
  children: ResizableProps["children"];
  forwardedRef: ForwardedRef<HTMLDivElement>;
  rootElRef: React.MutableRefObject<HTMLDivElement | null>;
  rootMotion?: ResizablePartMotion;
  onPointerOver: ResizableProps["onPointerOver"];
  onPointerOut: ResizableProps["onPointerOut"];
  onPointerDown: ResizableProps["onPointerDown"];
  onPointerUp: ResizableProps["onPointerUp"];
  handleCount: number;
  rest: Omit<
    ResizableProps,
    | "orientation"
    | "className"
    | "classNames"
    | "children"
    | "motion"
    | "motionController"
    | "motionState"
    | "motionPayload"
    | "playInitialState"
    | "onPointerOver"
    | "onPointerOut"
    | "onPointerDown"
    | "onPointerUp"
  >;
}) {
  const skinVariant = useSkinVariant(undefined);
  const part = useResizableRootMotion({
    forwardedRef,
    motion: rootMotion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootElRef.current = node;
      part.setRef(node);
    },
    [part, rootElRef],
  );

  return (
    <div
      ref={setRef}
      className={resizableRootClass({ orientation, skinVariant, slotClass, className })}
      {...rest}
      {...part.pointerHandlers}
      style={{ ...rest.style, "--resizable-handles": handleCount } as CSSProperties}
      data-orientation={orientation}
    >
      {children}
    </div>
  );
}

function countResizableHandles(children: ReactNode): number {
  let count = 0;
  const walk = (nodes: ReactNode) => {
    Children.forEach(nodes, (child) => {
      if (!isValidElement<{ children?: ReactNode }>(child)) return;
      if (child.type === Fragment) {
        walk(child.props.children);
        return;
      }
      if ((child.type as { displayName?: string }).displayName === "Resizable.Handle") {
        count += 1;
      }
    });
  };
  walk(children);
  return count;
}

Resizable.displayName = "Resizable";

export { ResizableHandle, ResizablePanel };
