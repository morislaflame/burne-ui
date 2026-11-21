import {
  createContext,
  createElement,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

/** Shared side for every floating overlay. */
export const OVERLAY_SIDES = ["top", "right", "bottom", "left"] as const;
export type OverlaySide = (typeof OVERLAY_SIDES)[number];
export type OverlayAlign = "start" | "center" | "end";

/**
 * Placement lives on one part (the floating panel) and may be repeated on the
 * root so the simple API can set it. The panel value wins.
 */
export type OverlayPlacementProps = {
  side?: OverlaySide;
  align?: OverlayAlign;
  offset?: number;
  /** Viewport inset used when flipping and clamping. Default 8. */
  collisionPadding?: number;
  /** Flip to a side that fits. Default true. */
  avoidCollisions?: boolean;
};

export type OverlayDismissEvent = {
  preventDefault: () => void;
  readonly defaultPrevented: boolean;
  target: EventTarget | null;
};

/**
 * One close dictionary for Dialog, Drawer, AlertDialog, Popover, Dropdown,
 * HoverCard and Tooltip.
 * `preventDefault()` on the callback keeps the overlay open.
 */
export type OverlayDismissProps = {
  /** Escape closes. Default true. */
  closeOnEscape?: boolean;
  /** Pointer outside the panel (backdrop or document) closes. */
  closeOnInteractOutside?: boolean;
  onEscapeKeyDown?: (event: OverlayDismissEvent) => void;
  onInteractOutside?: (event: OverlayDismissEvent) => void;
  /** Element to focus when the overlay opens. Default: first tab stop in the panel. */
  initialFocus?: RefObject<HTMLElement | null> | null;
};

/** Runs the handler, then returns whether the overlay should close. */
export function overlayShouldClose(
  event: OverlayDismissEvent,
  handler: ((event: OverlayDismissEvent) => void) | undefined,
  allow: boolean,
): boolean {
  handler?.(event);
  if (event.defaultPrevented) return false;
  return allow;
}

export type OverlayDelayValue = {
  openDelay?: number;
  closeDelay?: number;
};

const OverlayDelayContext = createContext<OverlayDelayValue>({});

/** Shared open/close delays for Tooltip and HoverCard in a subtree. */
export function OverlayDelayProvider({
  openDelay,
  closeDelay,
  children,
}: OverlayDelayValue & { children: ReactNode }) {
  const value = useMemo(() => ({ openDelay, closeDelay }), [openDelay, closeDelay]);
  return createElement(OverlayDelayContext.Provider, { value }, children);
}

export function useOverlayDelay(): OverlayDelayValue {
  return useContext(OverlayDelayContext);
}

/* -------------------------------------------------------------------------- */
/* LIFO Overlay Layer Stack (Modal + Floating Portals)                        */
/* -------------------------------------------------------------------------- */

export type OverlayLayerKind = "modal" | "floating";

type ActiveOverlayLayer = {
  id: symbol;
  parentId: symbol | null;
  kind: OverlayLayerKind;
  onEscapeRef: RefObject<((event: OverlayDismissEvent) => boolean) | undefined>;
  containsNodeRef: RefObject<((node: Node) => boolean) | undefined>;
};

const activeOverlayLayers: ActiveOverlayLayer[] = [];
let escapeKeydownInFlight = false;
let removeGlobalEscapeListeners: (() => void) | null = null;

function makeDismissEvent(source: { target: EventTarget | null }): {
  dismissEvent: OverlayDismissEvent;
  wasPrevented: () => boolean;
} {
  let prevented = false;
  return {
    dismissEvent: {
      preventDefault() {
        prevented = true;
      },
      get defaultPrevented() {
        return prevented;
      },
      target: source.target,
    },
    wasPrevented: () => prevented,
  };
}

function installGlobalEscapeListeners(): void {
  if (removeGlobalEscapeListeners || typeof document === "undefined") return;

  const onCaptureKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || event.isComposing || event.keyCode === 229) return;
    escapeKeydownInFlight = true;
    queueMicrotask(() => {
      escapeKeydownInFlight = false;
    });
  };

  const onBubbleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;
    escapeKeydownInFlight = false;
    if (event.defaultPrevented || event.isComposing || event.keyCode === 229) return;
    const top = activeOverlayLayers[activeOverlayLayers.length - 1];
    if (!top) return;
    const handler = top.onEscapeRef.current;
    if (!handler) return;
    const { dismissEvent } = makeDismissEvent(event);
    const handled = handler(dismissEvent);
    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  document.addEventListener("keydown", onCaptureKeyDown, true);
  document.addEventListener("keydown", onBubbleKeyDown);
  removeGlobalEscapeListeners = () => {
    document.removeEventListener("keydown", onCaptureKeyDown, true);
    document.removeEventListener("keydown", onBubbleKeyDown);
    removeGlobalEscapeListeners = null;
    escapeKeydownInFlight = false;
  };
}

const OverlayLayerParentContext = createContext<symbol | null>(null);

/** Provide the current overlay layer ID so portaled child overlays link to it. */
export function OverlayLayerProvider({
  layerId,
  children,
}: {
  layerId: symbol;
  children: ReactNode;
}) {
  return createElement(OverlayLayerParentContext.Provider, { value: layerId }, children);
}

export function useParentOverlayLayerId(): symbol | null {
  return useContext(OverlayLayerParentContext);
}

export type UseRegisterOverlayLayerOptions = {
  enabled: boolean;
  kind: OverlayLayerKind;
  /**
   * Optional centralized Escape handler. Return `true` when this layer consumed
   * the Escape press (either by closing or by honouring `closeOnEscape={false}`).
   */
  onEscape?: (event: OverlayDismissEvent) => boolean;
  /** Whether `node` belongs to this layer's own DOM (trigger or floating panel). */
  containsNode?: (node: Node) => boolean;
};

/**
 * Register an open modal or floating overlay in the global LIFO stack.
 * Returns a stable layer `symbol` to pass into `<OverlayLayerProvider>`.
 */
export function useRegisterOverlayLayer({
  enabled,
  kind,
  onEscape,
  containsNode,
}: UseRegisterOverlayLayerOptions): symbol {
  const parentId = useParentOverlayLayerId();
  const [layerId] = useState(() => Symbol("burne-overlay-layer"));

  const onEscapeRef = useRef(onEscape);
  const containsNodeRef = useRef(containsNode);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest callbacks for synchronous Escape / outside-click dispatch
  onEscapeRef.current = onEscape;
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest callbacks for synchronous Escape / outside-click dispatch
  containsNodeRef.current = containsNode;

  useLayoutEffect(() => {
    if (!enabled) return undefined;
    installGlobalEscapeListeners();
    const existingIdx = activeOverlayLayers.findIndex((item) => item.id === layerId);
    if (existingIdx !== -1) activeOverlayLayers.splice(existingIdx, 1);
    const entry: ActiveOverlayLayer = {
      id: layerId,
      parentId,
      kind,
      onEscapeRef,
      containsNodeRef,
    };
    const firstDescendantIdx = activeOverlayLayers.findIndex((item) =>
      isDescendantLayerOf(item, layerId),
    );
    if (firstDescendantIdx !== -1) {
      activeOverlayLayers.splice(firstDescendantIdx, 0, entry);
    } else {
      activeOverlayLayers.push(entry);
    }
    return () => {
      const idx = activeOverlayLayers.findIndex((item) => item.id === layerId);
      if (idx !== -1) activeOverlayLayers.splice(idx, 1);
      if (activeOverlayLayers.length === 0 && removeGlobalEscapeListeners) {
        removeGlobalEscapeListeners();
      }
    };
  }, [enabled, kind, layerId, parentId]);

  return layerId;
}

/** True when `layerId` is the topmost open overlay in the LIFO stack. */
export function isTopmostOverlayLayer(layerId: symbol): boolean {
  if (activeOverlayLayers.length === 0) return true;
  return activeOverlayLayers[activeOverlayLayers.length - 1]?.id === layerId;
}

/** True when another overlay was opened after `layerId` and is still open. */
export function hasOverlayLayerAbove(layerId: symbol): boolean {
  const idx = activeOverlayLayers.findIndex((item) => item.id === layerId);
  if (idx === -1) return false;
  if (idx < activeOverlayLayers.length - 1) return true;
  return activeOverlayLayers.some(
    (item) => item.id !== layerId && isDescendantLayerOf(item, layerId),
  );
}

/** Whether a native `Escape` keydown is currently travelling toward bubble listeners. */
export function isEscapeKeydownInFlight(): boolean {
  return escapeKeydownInFlight;
}

/**
 * Dismiss the topmost overlay above `layerId` when a native `cancel` / CloseWatcher
 * fires without a `keydown` event (e.g. Android system Back).
 */
export function dismissTopmostOverlayAbove(
  layerId: symbol,
  target: EventTarget | null,
): boolean {
  if (!hasOverlayLayerAbove(layerId)) return false;
  const top = activeOverlayLayers[activeOverlayLayers.length - 1];
  const handler = top?.onEscapeRef.current;
  if (!handler) return true;
  const { dismissEvent } = makeDismissEvent({ target });
  handler(dismissEvent);
  return true;
}

function buildActiveLayerMap(): Map<symbol, ActiveOverlayLayer> {
  const byId = new Map<symbol, ActiveOverlayLayer>();
  for (const item of activeOverlayLayers) {
    byId.set(item.id, item);
  }
  return byId;
}

function isDescendantLayerOf(
  entry: ActiveOverlayLayer,
  ancestorId: symbol,
  byId: Map<symbol, ActiveOverlayLayer> = buildActiveLayerMap(),
): boolean {
  let currentParent = entry.parentId;
  const visited = new Set<symbol>();
  while (currentParent != null && !visited.has(currentParent)) {
    if (currentParent === ancestorId) return true;
    visited.add(currentParent);
    const parentEntry = byId.get(currentParent);
    currentParent = parentEntry?.parentId ?? null;
  }
  return false;
}

/**
 * True when `node` lives inside any open child/descendant overlay of `layerId`
 * (e.g. a portaled Select, DatePicker, ColorPicker, or Dropdown opened inside a Popover).
 */
export function isNodeInChildOverlayLayer(layerId: symbol, node: Node): boolean {
  const byId = buildActiveLayerMap();
  for (const entry of activeOverlayLayers) {
    if (entry.id === layerId) continue;
    if (!isDescendantLayerOf(entry, layerId, byId)) continue;
    if (entry.containsNodeRef.current?.(node)) return true;
  }
  return false;
}
