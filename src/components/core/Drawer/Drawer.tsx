import { animate, remove } from "animejs";
import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { createPortal } from "react-dom";

import { CloseButton, type CloseButtonProps } from "@/components/core/CloseButton";
import { prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import { motionInteractive } from "@/components/core/utils/motionConfig";
import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

import type { DrawerPlacement } from "./drawerTypes";
import { useDrawerHandleDrag } from "./useDrawerHandleDrag";

export type { DrawerPlacement };

// ─── public types ─────────────────────────────────────────────────────────────

export type DrawerSize = "default" | "mid" | "full";

export type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: ReactNode;
  /** Откуда выезжает ящик. По умолчанию `right`. */
  placement?: DrawerPlacement;
  /** Ширина/высота панели. `default` — до 24rem, `mid` — половина экрана, `full` — весь экран. */
  size?: DrawerSize;
  /** Доп. класс на панель. */
  className?: string;
};

export type DrawerBackdropProps = HTMLAttributes<HTMLDivElement> & {
  /** Закрывать по клику вне панели. По умолчанию `true`. */
  isDismissable?: boolean;
};

export type DrawerHandleProps = HTMLAttributes<HTMLDivElement>;
export type DrawerHeaderProps = HTMLAttributes<HTMLDivElement>;
export type DrawerHeadingBlockProps = HTMLAttributes<HTMLDivElement>;
export type DrawerTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type DrawerDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
export type DrawerBodyProps = HTMLAttributes<HTMLDivElement>;
export type DrawerFooterProps = HTMLAttributes<HTMLDivElement>;
export type DrawerCloseProps = CloseButtonProps;

// ─── context ──────────────────────────────────────────────────────────────────

type DrawerContextValue = {
  titleId: string;
  descriptionId: string;
  hasDescription: boolean;
  setHasDescription: (v: boolean) => void;
  onOpenChange: (open: boolean) => void;
  placement: DrawerPlacement;
  panelRef: React.RefObject<HTMLDivElement | null>;
  /** Поставить в true перед вызовом onOpenChange(false) из Handle, чтобы
   *  корень пропустил повторную анимацию выхода. */
  skipCloseAnimRef: React.RefObject<boolean>;
};

const DrawerContext = createContext<DrawerContextValue | null>(null);

function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error("Компоненты Drawer.* должны быть внутри <Drawer>.");
  return ctx;
}

// ─── layout helpers ───────────────────────────────────────────────────────────

const PANEL_PLACEMENT_CLASS: Record<DrawerPlacement, string> = {
  left: "left-0 top-0 h-full",
  right: "right-0 top-0 h-full",
  bottom: "bottom-0 inset-x-0 w-full",
  top: "top-0 inset-x-0 w-full",
};

type SizeEntry = { horizontal: string; vertical: string };

const PANEL_SIZE_CLASS: Record<DrawerSize, SizeEntry> = {
  default: {
    horizontal: "max-w-[min(100vw,24rem)] w-full",
    vertical: "max-h-[90dvh]",
  },
  mid: {
    horizontal: "w-[50vw] max-w-full",
    vertical: "max-h-[50dvh]",
  },
  full: {
    horizontal: "w-screen",
    vertical: "h-dvh",
  },
};

const PANEL_ROUNDING_CLASS: Record<DrawerPlacement, string> = {
  left: "rounded-r-mid",
  right: "rounded-l-mid",
  bottom: "rounded-t-mid",
  top: "rounded-b-mid",
};

/** Отступ полоски Handle от внешнего края панели (сторона выезда). */
const HANDLE_EDGE_PADDING_CLASS: Record<DrawerPlacement, string> = {
  bottom: "pt-plus",
  top: "pb-plus",
  left: "pr-plus",
  right: "pl-plus",
};

function panelSizeClass(placement: DrawerPlacement, size: DrawerSize): string {
  const entry = PANEL_SIZE_CLASS[size];
  return placement === "left" || placement === "right" ? entry.horizontal : entry.vertical;
}

function getSlideIn(placement: DrawerPlacement): Record<string, string[]> {
  switch (placement) {
    case "left":   return { translateX: ["-100%", "0%"] };
    case "right":  return { translateX: ["100%", "0%"] };
    case "top":    return { translateY: ["-100%", "0%"] };
    case "bottom": return { translateY: ["100%", "0%"] };
  }
}

function getSlideOut(placement: DrawerPlacement): Record<string, string[]> {
  switch (placement) {
    case "left":   return { translateX: ["0%", "-100%"] };
    case "right":  return { translateX: ["0%", "100%"] };
    case "top":    return { translateY: ["0%", "-100%"] };
    case "bottom": return { translateY: ["0%", "100%"] };
  }
}

// ─── Backdrop (sentinel) ─────────────────────────────────────────────────────
// Renders null — root reads isDismissable via React.Children.

export function DrawerBackdropInner(_props: DrawerBackdropProps) {
  return null;
}
(DrawerBackdropInner as { _drawerBackdrop?: boolean })._drawerBackdrop = true;

// ─── Handle ───────────────────────────────────────────────────────────────────

export function DrawerHandleInner({ className = "", onPointerDown, ...rest }: DrawerHandleProps) {
  const { onOpenChange, placement, panelRef, skipCloseAnimRef } = useDrawer();
  const { onPointerDown: dragPD } = useDrawerHandleDrag(
    panelRef,
    placement,
    () => onOpenChange(false),
    false,
    skipCloseAnimRef,
  );
  const isHorizontal = placement === "left" || placement === "right";
  const label =
    placement === "bottom" ? "Потянуть вниз для закрытия"
    : placement === "top"  ? "Потянуть вверх для закрытия"
    : placement === "left" ? "Потянуть влево для закрытия"
    :                        "Потянуть вправо для закрытия";

  return (
    <div
      aria-label={label}
      className={cn(
        "flex touch-none select-none shrink-0 items-center justify-center cursor-grab active:cursor-grabbing box-content",
        isHorizontal ? "self-stretch w-xsmall" : "h-xsmall w-full",
        HANDLE_EDGE_PADDING_CLASS[placement],
        className,
      )}
      onPointerDown={(e) => {
        onPointerDown?.(e);
        dragPD(e);
      }}
      {...rest}
    >
      <span
        aria-hidden
        className={cn(
          "rounded-full bg-tertiary",
          isHorizontal ? "h-10 w-1" : "h-1 w-10",
        )}
      />
    </div>
  );
}

// ─── Structural parts ─────────────────────────────────────────────────────────

export function DrawerHeader({ className = "", ...rest }: DrawerHeaderProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-start gap-plus px-mid pt-mid pb-plus text-left",
        className,
      )}
      {...rest}
    />
  );
}

export function DrawerHeadingBlock({ className = "", ...rest }: DrawerHeadingBlockProps) {
  return (
    <div
      className={cn("flex min-w-0 flex-1 flex-col gap-base text-left", className)}
      {...rest}
    />
  );
}

export const DrawerTitle = forwardRef<HTMLHeadingElement, DrawerTitleProps>(
  function DrawerTitle({ className = "", id, ...rest }, ref) {
    const { titleId } = useDrawer();
    return (
      <Text
        ref={ref as Ref<HTMLElement>}
        as="h2"
        variant="mid"
        id={id ?? titleId}
        className={cn("min-w-0", className)}
        {...rest}
      />
    );
  },
);

export function DrawerDescription({ className = "", id, ...rest }: DrawerDescriptionProps) {
  const { descriptionId, setHasDescription } = useDrawer();
  useLayoutEffect(() => {
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription]);
  return (
    <Text
      as="p"
      variant="base"
      id={id ?? descriptionId}
      className={cn("text-muted", className)}
      {...rest}
    />
  );
}

export const DrawerClose = forwardRef<HTMLButtonElement, DrawerCloseProps>(
  function DrawerClose(
    { className = "", onClick, "aria-label": ariaLabel = "Закрыть", ...rest },
    ref,
  ) {
    const { onOpenChange } = useDrawer();
    return (
      <CloseButton
        ref={ref}
        size="small"
        variant="secondary"
        aria-label={ariaLabel}
        className={cn("-m-xsmall", className)}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) onOpenChange(false);
        }}
        {...rest}
      />
    );
  },
);

export function DrawerBody({ className = "", ...rest }: DrawerBodyProps) {
  return (
    <div
      className={cn("min-h-0 flex-1 overflow-y-auto py-plus px-mid", className)}
      {...rest}
    />
  );
}

export function DrawerFooter({ className = "", ...rest }: DrawerFooterProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 flex-wrap items-center justify-end gap-base border-t-token py-plus px-mid",
        className,
      )}
      {...rest}
    />
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

function readBurneLightTheme(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.dataset.brnTheme === "light";
}

export const DrawerRoot = function Drawer({
  open,
  onOpenChange,
  children,
  placement = "right",
  size = "default",
  className = "",
}: DrawerProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [hasDescription, setHasDescription] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  /** true = Handle уже выполнил анимацию выхода, повторная не нужна */
  const skipCloseAnimRef = useRef(false);

  const setHasDescriptionStable = useCallback((v: boolean) => setHasDescription(v), []);

  // Extract Drawer.Backdrop config
  let backdropIsDismissable = true;
  const panelChildren: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (
      isValidElement(child) &&
      (child.type as { _drawerBackdrop?: boolean })._drawerBackdrop
    ) {
      const props = child.props as DrawerBackdropProps;
      if (props.isDismissable === false) backdropIsDismissable = false;
    } else {
      panelChildren.push(child);
    }
  });

  useLayoutEffect(() => {
    if (open) {
      skipCloseAnimRef.current = false;
      setMounted(true);
    }
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [mounted]);

  // close animation
  useEffect(() => {
    if (open || !mounted) return;
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    let cancelled = false;
    const finish = () => {
      if (!cancelled) {
        dialogRef.current?.close();
        setMounted(false);
      }
    };

    // Handle уже анимировал выход — просто убираем из DOM
    if (skipCloseAnimRef.current) {
      skipCloseAnimRef.current = false;
      finish();
      return undefined;
    }

    if (!overlay || !panel || prefersReducedInteractiveHoverLift()) {
      finish();
      return undefined;
    }

    remove(overlay);
    remove(panel);
    const slideOut = getSlideOut(placement);
    const p1 = Promise.resolve(
      animate(overlay, { opacity: [1, 0], ...motionInteractive() }),
    ).then(() => undefined);
    const p2 = Promise.resolve(
      animate(panel, { ...slideOut, ...motionInteractive() }),
    ).then(() => undefined);
    void Promise.all([p1, p2]).then(finish);

    return () => {
      cancelled = true;
      remove(overlay);
      remove(panel);
    };
  }, [open, mounted, placement]);

  // open animation
  useLayoutEffect(() => {
    if (!open || !mounted) return;

    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();

    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    if (prefersReducedInteractiveHoverLift()) {
      overlay.style.opacity = "1";
      panel.style.transform = "";
      return;
    }

    remove(overlay);
    remove(panel);
    animate(overlay, { opacity: [0, 1], ...motionInteractive() });
    animate(panel, { ...getSlideIn(placement), ...motionInteractive() });
  }, [open, mounted, placement]);

  // focus trap
  useLayoutEffect(() => {
    if (!open || !mounted || !panelRef.current) return;
    panelRef.current.focus();
  }, [open, mounted]);

  if (typeof document === "undefined" || !mounted) return null;

  const lightUi = readBurneLightTheme();
  const reduced = prefersReducedInteractiveHoverLift();
  const isHorizontal = placement === "left" || placement === "right";

  const ctxValue: DrawerContextValue = {
    titleId,
    descriptionId,
    hasDescription,
    setHasDescription: setHasDescriptionStable,
    onOpenChange,
    placement,
    panelRef,
    skipCloseAnimRef,
  };

  return createPortal(
    <DrawerContext.Provider value={ctxValue}>
      <dialog
        ref={dialogRef}
        onClose={() => onOpenChange(false)}
        aria-labelledby={titleId}
        aria-describedby={hasDescription ? descriptionId : undefined}
        className="fixed inset-0 z-[100] m-0 h-full w-full max-h-none max-w-none border-0 bg-transparent p-0 open:block"
      >
        <div
          ref={overlayRef}
          className={cn(
            "absolute inset-0",
            lightUi
              ? "bg-[color-mix(in_oklab,var(--color-foreground)_14%,transparent)] backdrop-blur-[14px] backdrop-saturate-150 motion-reduce:backdrop-blur-none"
              : "bg-[color-mix(in_oklab,black_55%,transparent)]",
            backdropIsDismissable ? "cursor-pointer" : "cursor-default",
          )}
          style={{ opacity: reduced ? 1 : 0 }}
          aria-hidden
          onMouseDown={(e) => {
            if (backdropIsDismissable && e.target === e.currentTarget) onOpenChange(false);
          }}
        />

        <div
          ref={panelRef}
          tabIndex={-1}
          className={cn(
            "absolute z-10 flex flex-col",
            "border-token bg-surface text-foreground shadow-token-lg outline-none overflow-hidden",
            PANEL_PLACEMENT_CLASS[placement],
            panelSizeClass(placement, size),
            size !== "full" && (isHorizontal ? PANEL_ROUNDING_CLASS[placement] : PANEL_ROUNDING_CLASS[placement]),
            className,
          )}
        >
          {panelChildren}
        </div>
      </dialog>
    </DrawerContext.Provider>,
    document.body,
  );
};

// ─── compound export ──────────────────────────────────────────────────────────

