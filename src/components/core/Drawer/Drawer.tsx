import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
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
  overlayRef: React.RefObject<HTMLDivElement | null>;
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

function getSlideInFrom(placement: DrawerPlacement): gsap.TweenVars {
  switch (placement) {
    case "left": return { xPercent: -100 };
    case "right": return { xPercent: 100 };
    case "top": return { yPercent: -100 };
    case "bottom": return { yPercent: 100 };
  }
}

function getSlideInTo(placement: DrawerPlacement): gsap.TweenVars {
  switch (placement) {
    case "left":
    case "right":
      return { xPercent: 0 };
    case "top":
    case "bottom":
      return { yPercent: 0 };
  }
}

function getSlideOutTo(placement: DrawerPlacement): gsap.TweenVars {
  switch (placement) {
    case "left": return { xPercent: -100 };
    case "right": return { xPercent: 100 };
    case "top": return { yPercent: -100 };
    case "bottom": return { yPercent: 100 };
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
  const { onOpenChange, placement, overlayRef, panelRef, skipCloseAnimRef } = useDrawer();
  const { onPointerDown: dragPD } = useDrawerHandleDrag(
    panelRef,
    overlayRef,
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
  useLayoutEffect(() => {
    if (open || !mounted) return;
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    let cancelled = false;
    const finish = () => {
      if (!cancelled) {
        // Размонтируем без dialog.close(): close() снимает open раньше unmount
        // и на кадр вспыхивает нативный ::backdrop. clearProps тоже не нужен —
        // сброс inline opacity перед unmount давал обратное мигание.
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

    killMotion(overlay, panel);
    const vars = { ...motionInteractive(), overwrite: "auto" as const };
    const tl = gsap.timeline({ onComplete: finish });
    // opacity, не autoAlpha — visibility:hidden на blur-подложке даёт мигание в конце
    tl.to(overlay, { opacity: 0, ...vars }, 0);
    tl.to(panel, { ...getSlideOutTo(placement), ...vars }, 0);

    return () => {
      cancelled = true;
      tl.kill();
      killMotion(overlay, panel);
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

    killMotion(overlay, panel);
    const vars = { ...motionInteractive(), overwrite: "auto" as const };
    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, ...vars });
    gsap.fromTo(panel, getSlideInFrom(placement), { ...getSlideInTo(placement), ...vars });
  }, [open, mounted, placement]);

  // focus trap
  useLayoutEffect(() => {
    if (!open || !mounted || !panelRef.current) return;
    panelRef.current.focus();
  }, [open, mounted]);

  if (typeof document === "undefined" || !mounted) return null;

  const lightUi = readBurneLightTheme();
  const isHorizontal = placement === "left" || placement === "right";

  const ctxValue: DrawerContextValue = {
    titleId,
    descriptionId,
    hasDescription,
    setHasDescription: setHasDescriptionStable,
    onOpenChange,
    placement,
    overlayRef,
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
        className="fixed inset-0 z-[100] m-0 h-full w-full max-h-none max-w-none border-0 bg-transparent p-0 open:block [&::backdrop]:bg-transparent"
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

