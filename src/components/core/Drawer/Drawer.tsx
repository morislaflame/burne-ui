import { killMotion } from "@/components/core/utils/gsapMotion";
import {
  animateModalClose,
  animateModalOpen,
  applyReducedModalMotion,
  isReducedModalMotion,
  modalOverlayEnterStyle,
  type GsapMotionVars,
} from "@/components/core/utils/modalSurfaceMotion";
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
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { createPortal } from "react-dom";

import { CloseButton, type CloseButtonProps } from "@/components/core/CloseButton";
import {
  createGlossInteractiveRefCallback,
} from "@/components/core/utils/glossInteractiveMotion";
import "../utils/glossInteractive.css";
import {
  burneLightThemePortalProps,
  useBurneLightTheme,
  usePortalThemeAnchor,
} from "@/components/core/utils/burneLightTheme";
import { motionInteractive } from "@/components/core/utils/motionConfig";
import { MODAL_BODY_SCROLL_CLASS, MODAL_CONTENT_CLASS } from "@/components/core/utils/modalPanelLayout";
import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

import type { DrawerPlacement } from "./drawerTypes";
import { useDrawerHandleDrag } from "./useDrawerHandleDrag";

export type { DrawerPlacement };


export type DrawerSize = "default" | "mid" | "full";
export type DrawerVariant = "default" | "gloss";

export type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: ReactNode;
  placement?: DrawerPlacement;
  size?: DrawerSize;
  variant?: DrawerVariant;
  className?: string;
  themeAnchor?: HTMLElement | null;
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


type DrawerContextValue = {
  titleId: string;
  descriptionId: string;
  hasDescription: boolean;
  setHasDescription: (v: boolean) => void;
  onOpenChange: (open: boolean) => void;
  placement: DrawerPlacement;
  overlayRef: React.RefObject<HTMLDivElement | null>;
  panelRef: React.RefObject<HTMLDivElement | null>;
  skipCloseAnimRef: React.RefObject<boolean>;
};

const DrawerContext = createContext<DrawerContextValue | null>(null);

function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error("Компоненты Drawer.* должны быть внутри <Drawer>.");
  return ctx;
}


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

function getSlideInFrom(placement: DrawerPlacement): GsapMotionVars {
  switch (placement) {
    case "left": return { xPercent: -100 };
    case "right": return { xPercent: 100 };
    case "top": return { yPercent: -100 };
    case "bottom": return { yPercent: 100 };
  }
}

function getSlideInTo(placement: DrawerPlacement): GsapMotionVars {
  switch (placement) {
    case "left":
    case "right":
      return { xPercent: 0 };
    case "top":
    case "bottom":
      return { yPercent: 0 };
  }
}

function getSlideOutTo(placement: DrawerPlacement): GsapMotionVars {
  switch (placement) {
    case "left": return { xPercent: -100 };
    case "right": return { xPercent: 100 };
    case "top": return { yPercent: -100 };
    case "bottom": return { yPercent: 100 };
  }
}

export function DrawerBackdropInner(_props: DrawerBackdropProps) {
  return null;
}
(DrawerBackdropInner as { _drawerBackdrop?: boolean })._drawerBackdrop = true;

function DrawerContent({ className = "", ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(MODAL_CONTENT_CLASS, className)} {...rest} />;
}

export { DrawerContent };


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
(DrawerHandleInner as { _drawerHandle?: boolean })._drawerHandle = true;


export function DrawerHeader({ className = "", ...rest }: DrawerHeaderProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-start gap-plus text-left",
        className,
      )}
      {...rest}
    />
  );
}

export function DrawerHeadingBlock({ className = "", ...rest }: DrawerHeadingBlockProps) {
  return (
    <div
      className={cn("flex min-w-0 flex-1 flex-col gap-xsmall text-left", className)}
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
        className={cn("shrink-0", className)}
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
      className={cn(MODAL_BODY_SCROLL_CLASS, className)}
      {...rest}
    />
  );
}

export function DrawerFooter({ className = "", ...rest }: DrawerFooterProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 flex-wrap items-center justify-end gap-base",
        className,
      )}
      {...rest}
    />
  );
}


export const DrawerRoot = function Drawer({
  open,
  onOpenChange,
  children,
  placement = "right",
  size = "default",
  variant = "default",
  className = "",
  themeAnchor,
}: DrawerProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [hasDescription, setHasDescription] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const glossPanelRef = useRef<HTMLDivElement>(null);
  const bindGlossPanelRef = useMemo(
    () => createGlossInteractiveRefCallback(glossPanelRef, variant === "gloss"),
    [variant],
  );
  const skipCloseAnimRef = useRef(false);

  const setHasDescriptionStable = useCallback((v: boolean) => setHasDescription(v), []);

  const portalThemeAnchor = usePortalThemeAnchor(open, themeAnchor);
  const lightUi = useBurneLightTheme(portalThemeAnchor);

  let backdropIsDismissable = true;
  const panelNodes: ReactNode[] = [];
  let contentChunk: ReactNode[] = [];

  const flushContent = () => {
    if (contentChunk.length === 0) return;
    const chunk = contentChunk;
    contentChunk = [];
    panelNodes.push(
      variant === "gloss" ? (
        <div
          key={`drawer-content-${panelNodes.length}`}
          className="gloss-content flex min-h-0 min-w-0 flex-1 flex-col"
        >
          <DrawerContent>{chunk}</DrawerContent>
        </div>
      ) : (
        <DrawerContent key={`drawer-content-${panelNodes.length}`}>{chunk}</DrawerContent>
      ),
    );
  };

  Children.forEach(children, (child) => {
    if (
      isValidElement(child) &&
      (child.type as { _drawerBackdrop?: boolean })._drawerBackdrop
    ) {
      const props = child.props as DrawerBackdropProps;
      if (props.isDismissable === false) backdropIsDismissable = false;
      return;
    }

    if (
      isValidElement(child) &&
      (child.type as { _drawerHandle?: boolean })._drawerHandle
    ) {
      flushContent();
      panelNodes.push(child);
      return;
    }

    contentChunk.push(child);
  });
  flushContent();

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

  useLayoutEffect(() => {
    if (open || !mounted) return;
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    let cancelled = false;
    const finish = () => {
      if (!cancelled) {
        setMounted(false);
      }
    };

    if (skipCloseAnimRef.current) {
      skipCloseAnimRef.current = false;
      finish();
      return undefined;
    }

    if (!overlay || !panel || isReducedModalMotion()) {
      finish();
      return undefined;
    }

    killMotion(overlay, panel);
    const vars = { ...motionInteractive(), overwrite: "auto" as const };
    const tl = animateModalClose({
      overlay,
      panel,
      vars,
      onComplete: finish,
      panelExit: getSlideOutTo(placement),
    });

    return () => {
      cancelled = true;
      tl.kill();
      killMotion(overlay, panel);
    };
  }, [open, mounted, placement]);

  useLayoutEffect(() => {
    if (!open || !mounted) return;

    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();

    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    if (isReducedModalMotion()) {
      applyReducedModalMotion(overlay, panel);
      return;
    }

    animateModalOpen({
      overlay,
      panel,
      vars: { ...motionInteractive(), overwrite: "auto" as const },
      panelFrom: getSlideInFrom(placement),
      panelTo: getSlideInTo(placement),
    });
  }, [open, mounted, placement]);

  useLayoutEffect(() => {
    if (!open || !mounted || !panelRef.current) return;
    panelRef.current.focus();
  }, [open, mounted]);

  if (typeof document === "undefined" || !mounted) return null;

  const portalTheme = burneLightThemePortalProps(portalThemeAnchor);
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
        {...portalTheme}
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
          style={modalOverlayEnterStyle()}
          aria-hidden
          onMouseDown={(e) => {
            if (backdropIsDismissable && e.target === e.currentTarget) onOpenChange(false);
          }}
        />

        <div
          ref={panelRef}
          tabIndex={-1}
          className={cn(
            "absolute z-10 flex flex-col outline-none overflow-hidden",
            variant !== "gloss" &&
              "border-token bg-surface text-foreground shadow-token-lg",
            PANEL_PLACEMENT_CLASS[placement],
            panelSizeClass(placement, size),
            size !== "full" && (isHorizontal ? PANEL_ROUNDING_CLASS[placement] : PANEL_ROUNDING_CLASS[placement]),
            className,
          )}
        >
          {variant === "gloss" ? (
            <div
              ref={bindGlossPanelRef}
              className={cn(
                "gloss-panel gloss-deep flex min-h-0 flex-1 flex-col text-foreground",
                size !== "full" && (isHorizontal ? PANEL_ROUNDING_CLASS[placement] : PANEL_ROUNDING_CLASS[placement]),
              )}
            >
              {panelNodes}
            </div>
          ) : (
            panelNodes
          )}
        </div>
      </dialog>
    </DrawerContext.Provider>,
    document.body,
  );
};


