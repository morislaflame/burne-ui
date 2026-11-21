import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactElement,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";

import { Dropdown, type DropdownItemProps } from "@/components/core/Dropdown";
import { useDropdown, useDropdownClassNames } from "@/components/core/Dropdown/dropdownContext";
import { burneLightThemePortalProps } from "@/components/core/utils/burneLightTheme";
import { dataOpenState } from "@/components/core/utils/dataContract";
import { mergeAsChildProps } from "@/components/core/utils/mergeAsChildProps";
import { mergeRefs } from "@/components/core/utils/mergeRefs";
import { resolveFloatingPortalContainer } from "@/components/core/utils/portalContainer";
import { isRtlElement } from "@/components/core/utils/readingDirection";

import { isContextMenuKey, nudgeOpenContextMenu, placeContextMenuAnchor } from "./contextMenuAPI";
import { ContextMenuAnchorProvider, useContextMenuAnchor } from "./contextMenuContext";
import { CONTEXT_MENU_ANCHOR_CLASS, CONTEXT_MENU_TRIGGER_CLASS } from "./contextMenuStyles";
import type { ContextMenuPopoverProps, ContextMenuProps, ContextMenuTriggerProps } from "./contextMenuTypes";

import { cn } from "@/utils/cn";

const LONG_PRESS_DELAY_MS = 500;
const LONG_PRESS_MOVE_SLOP_PX = 10;
const SUPPRESS_CLICK_RESET_MS = 450;

function ContextMenuPoint() {
  const anchorRef = useContextMenuAnchor();
  const { open, triggerRef, portalContainer } = useDropdown();

  // Portal after mount: the server renders nothing here, so the first client render must too.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    if (!open) {
      if (anchor) {
        anchor.style.left = "";
        anchor.style.top = "";
      }
      return;
    }
    if (!mounted) return;
    const trigger = triggerRef.current;
    if (!anchor || !trigger) return;
    if (!anchor.style.left) {
      const rect = trigger.getBoundingClientRect();
      placeContextMenuAnchor(anchor, rect.left, rect.bottom);
    }
    nudgeOpenContextMenu();
  }, [anchorRef, mounted, open, triggerRef]);

  if (!mounted || typeof document === "undefined") return null;
  const trigger = triggerRef.current;
  const host =
    resolveFloatingPortalContainer(portalContainer, trigger) ?? document.body;
  const anchorTheme = burneLightThemePortalProps(trigger);
  const dirAncestor = trigger?.closest?.("[dir]");
  const rawDir =
    dirAncestor && dirAncestor !== document.documentElement
      ? dirAncestor.getAttribute("dir")
      : null;
  const anchorDir =
    rawDir === "rtl" || rawDir === "ltr"
      ? rawDir
      : trigger && isRtlElement(trigger)
        ? "rtl"
        : undefined;
  return createPortal(
    <span
      ref={anchorRef}
      aria-hidden
      tabIndex={-1}
      dir={anchorDir}
      {...anchorTheme}
      className={CONTEXT_MENU_ANCHOR_CLASS}
    />,
    host,
  );
}

export function ContextMenuRoot({ children, ...rest }: ContextMenuProps) {
  const anchorRef = useRef<HTMLElement | null>(null);

  return (
    <ContextMenuAnchorProvider anchorRef={anchorRef}>
      <Dropdown {...rest}>
        <ContextMenuPoint />
        {children}
      </Dropdown>
    </ContextMenuAnchorProvider>
  );
}

ContextMenuRoot.displayName = "ContextMenu";

function openContextMenu(
  anchor: HTMLElement | null,
  x: number,
  y: number,
  open: boolean,
  setOpen: (next: boolean) => void,
) {
  placeContextMenuAnchor(anchor, x, y);
  if (open) {
    nudgeOpenContextMenu();
    return;
  }
  setOpen(true);
}

export const ContextMenuTrigger = forwardRef<HTMLElement, ContextMenuTriggerProps>(
  function ContextMenuTrigger(
    {
      children,
      className,
      asChild,
      tabIndex,
      onContextMenu,
      onKeyDown,
      onPointerDown,
      onClick,
      ...rest
    },
    forwardedRef,
  ) {
    const { open, setOpen, triggerRef, contentId } = useDropdown();
    const anchorRef = useContextMenuAnchor();
    const slotClassNames = useDropdownClassNames();
    const openLatestRef = useRef(open);
    const setOpenLatestRef = useRef(setOpen);
    // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest state for touch long-press timer
    openLatestRef.current = open;
    // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest state for touch long-press timer
    setOpenLatestRef.current = setOpen;

    const longPressCleanupRef = useRef<(() => void) | null>(null);
    const suppressClickCleanupRef = useRef<(() => void) | null>(null);
    const suppressNextClickRef = useRef(false);

    useEffect(() => {
      return () => {
        longPressCleanupRef.current?.();
        longPressCleanupRef.current = null;
        suppressClickCleanupRef.current?.();
        suppressClickCleanupRef.current = null;
      };
    }, []);

    const armSuppressTriggerClick = useCallback(() => {
      suppressClickCleanupRef.current?.();
      suppressNextClickRef.current = true;

      const clear = () => {
        suppressNextClickRef.current = false;
        window.removeEventListener("click", onCaptureClick, true);
        clearTimeout(resetTimer);
        if (suppressClickCleanupRef.current === clear) {
          suppressClickCleanupRef.current = null;
        }
      };

      const onCaptureClick = (ev: globalThis.MouseEvent) => {
        if (!suppressNextClickRef.current) {
          clear();
          return;
        }
        if (ev.target instanceof Node && triggerRef.current?.contains(ev.target)) {
          ev.preventDefault();
          ev.stopPropagation();
          clear();
        }
      };

      const resetTimer = window.setTimeout(clear, SUPPRESS_CLICK_RESET_MS);
      window.addEventListener("click", onCaptureClick, true);
      suppressClickCleanupRef.current = clear;
    }, [triggerRef]);

    const mergedRef = useCallback(
      (node: HTMLElement | null) => {
        mergeRefs(forwardedRef, triggerRef)(node);
      },
      [forwardedRef, triggerRef],
    );

    const handleContextMenu = useCallback(
      (event: MouseEvent<HTMLElement>) => {
        onContextMenu?.(event);
        if (event.defaultPrevented) return;
        event.preventDefault();
        openContextMenu(anchorRef.current, event.clientX, event.clientY, open, setOpen);
      },
      [anchorRef, onContextMenu, open, setOpen],
    );

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || !isContextMenuKey(event)) return;
        event.preventDefault();
        const rect = event.currentTarget.getBoundingClientRect();
        openContextMenu(anchorRef.current, rect.left, rect.bottom, open, setOpen);
      },
      [anchorRef, onKeyDown, open, setOpen],
    );

    const handlePointerDown = useCallback(
      (event: PointerEvent<HTMLElement>) => {
        onPointerDown?.(event);
        if (event.defaultPrevented || event.pointerType !== "touch") return;

        longPressCleanupRef.current?.();
        const startX = event.clientX;
        const startY = event.clientY;
        const pointerId = event.pointerId;
        let fired = false;

        const cancelGesture = () => {
          clearTimeout(timer);
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);
          window.removeEventListener("pointercancel", onCancel);
          window.removeEventListener("scroll", onScroll, true);
          if (longPressCleanupRef.current === cancelGesture) {
            longPressCleanupRef.current = null;
          }
        };

        const onMove = (ev: globalThis.PointerEvent) => {
          if (ev.pointerId !== pointerId) return;
          if (Math.hypot(ev.clientX - startX, ev.clientY - startY) > LONG_PRESS_MOVE_SLOP_PX) {
            cancelGesture();
          }
        };

        const onUp = (ev: globalThis.PointerEvent) => {
          if (ev.pointerId !== pointerId) return;
          cancelGesture();
          if (fired) armSuppressTriggerClick();
        };

        const onCancel = (ev: globalThis.PointerEvent) => {
          if (ev.pointerId !== pointerId) return;
          cancelGesture();
        };

        const onScroll = () => {
          cancelGesture();
        };

        const timer = window.setTimeout(() => {
          fired = true;
          armSuppressTriggerClick();
          openContextMenu(
            anchorRef.current,
            startX,
            startY,
            openLatestRef.current,
            setOpenLatestRef.current,
          );
        }, LONG_PRESS_DELAY_MS);

        longPressCleanupRef.current = cancelGesture;
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
        window.addEventListener("pointercancel", onCancel);
        window.addEventListener("scroll", onScroll, { capture: true, passive: true });
      },
      [anchorRef, armSuppressTriggerClick, onPointerDown],
    );

    const handleClick = useCallback(
      (event: MouseEvent<HTMLElement>) => {
        if (suppressNextClickRef.current) {
          suppressNextClickRef.current = false;
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        onClick?.(event);
      },
      [onClick],
    );

    const shared = {
      className: cn(CONTEXT_MENU_TRIGGER_CLASS, slotClassNames.trigger, className),
      "aria-expanded": open,
      "aria-haspopup": "menu" as const,
      "aria-controls": open ? contentId : undefined,
      onContextMenu: handleContextMenu,
      onKeyDown: handleKeyDown,
      onPointerDown: handlePointerDown,
      onClick: handleClick,
      "data-state": dataOpenState(open),
    };

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement;
      return cloneElement(
        child,
        mergeAsChildProps(
          child,
          {
            ...rest,
            ...shared,
            ...(tabIndex !== undefined ? { tabIndex } : null),
          },
          mergedRef,
          { runBeforeChild: ["onClick"] },
        ),
      );
    }

    return (
      <div
        ref={mergedRef}
        {...rest}
        {...shared}
        tabIndex={tabIndex ?? 0}
        data-state={dataOpenState(open)}
      >
        {children}
      </div>
    );
  },
);

ContextMenuTrigger.displayName = "ContextMenu.Trigger";

export const ContextMenuPopover = forwardRef<HTMLDivElement, ContextMenuPopoverProps>(
  function ContextMenuPopover({ side = "bottom", align = "start", offset = 4, ...rest }, forwardedRef) {
    const anchorRef = useContextMenuAnchor();
    return (
      <Dropdown.Popover
        ref={forwardedRef}
        side={side}
        align={align}
        offset={offset}
        {...rest}
        anchorRef={anchorRef}
        matchAnchorWidth={false}
      />
    );
  },
);

ContextMenuPopover.displayName = "ContextMenu.Popover";

export const ContextMenuItem = forwardRef<HTMLElement, DropdownItemProps>(
  function ContextMenuItem({ selection = false, ...rest }, ref) {
    return <Dropdown.Item ref={ref} selection={selection} {...rest} />;
  },
);

ContextMenuItem.displayName = "ContextMenu.Item";
