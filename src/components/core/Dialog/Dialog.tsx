import { animate, remove } from "animejs";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import {
  MOTION_INTERACTIVE_EASE,
  MOTION_INTERACTIVE_MS,
} from "../utils/motionTokens";
import { prefersReducedInteractiveHoverLift } from "../utils/hoverInteractiveLift";

/** Светлая тема UI: на `<html>` или на любой обёртке (портал читает страницу). */
function readBurneLightTheme(): boolean {
  if (typeof document === "undefined") return false;
  if (document.documentElement.dataset.bTheme === "light") return true;
  return document.querySelector("[data-b-theme=\"light\"]") != null;
}

function IconClose({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export type DialogProps = {
  /** Управляемое открытие. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: ReactNode;
  /** Доп. класс на панель (контент модалки). */
  className?: string;
};

type DialogContextValue = {
  titleId: string;
  descriptionId: string;
  hasDescription: boolean;
  setHasDescription: (v: boolean) => void;
  onOpenChange: (open: boolean) => void;
};

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("Компоненты Dialog.* должны быть внутри <Dialog>.");
  return ctx;
}

type DialogHeaderProps = HTMLAttributes<HTMLDivElement>;
type DialogTitleProps = HTMLAttributes<HTMLHeadingElement>;
type DialogDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
type DialogBodyProps = HTMLAttributes<HTMLDivElement>;
type DialogFooterProps = HTMLAttributes<HTMLDivElement>;
type DialogCloseProps = Omit<
  HTMLAttributes<HTMLButtonElement>,
  "type" | "children"
>;

function DialogHeader({ className = "", ...rest }: DialogHeaderProps) {
  return (
    <div
      className={[
        "flex items-start gap-3 px-4 pt-4 pb-3",
        className,
      ].join(" ")}
      {...rest}
    />
  );
}

const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  function DialogTitle({ className = "", id, ...rest }, ref) {
    const { titleId } = useDialog();
    return (
      <h2
        ref={ref}
        id={id ?? titleId}
        className={[
          "min-w-0 text-b-text font-medium text-sm leading-snug",
          className,
        ].join(" ")}
        {...rest}
      />
    );
  },
);

function DialogDescription({
  className = "",
  id,
  ...rest
}: DialogDescriptionProps) {
  const { descriptionId, setHasDescription } = useDialog();
  useLayoutEffect(() => {
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription]);

  return (
    <p
      id={id ?? descriptionId}
      className={[
        "text-sm leading-normal text-b-muted",
        className,
      ].join(" ")}
      {...rest}
    />
  );
}

/** Заголовок и подзаголовок: колонка с `gap`, как отступ между Title и Description в Expandable. */
function DialogHeadingBlock({
  className = "",
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={["flex min-w-0 flex-1 flex-col gap-2", className].join(" ")}
      {...rest}
    />
  );
}

const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
  function DialogClose(
    { className = "", onClick, "aria-label": ariaLabel = "Закрыть", ...rest },
    ref,
  ) {
    const { onOpenChange } = useDialog();
    return (
      <button
        ref={ref}
        type="button"
        aria-label={ariaLabel}
        className={[
          "-m-1 shrink-0 rounded-md p-1.5 text-b-muted outline-none",
          "transition-colors duration-200 ease-out hover:bg-b-surface hover:text-b-text",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-b-accent focus-visible:outline-offset-2",
          className,
        ].join(" ")}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) onOpenChange(false);
        }}
        {...rest}
      >
        <IconClose />
      </button>
    );
  },
);

function DialogBody({ className = "", ...rest }: DialogBodyProps) {
  return (
    <div
      className={[
        "min-h-0 flex-1 overflow-y-auto px-4 py-3",
        className,
      ].join(" ")}
      {...rest}
    />
  );
}

function DialogFooter({ className = "", ...rest }: DialogFooterProps) {
  return (
    <div
      className={[
        "flex flex-wrap items-center justify-end gap-2 border-t border-b-border px-4 py-3",
        className,
      ].join(" ")}
      {...rest}
    />
  );
}

const DialogRoot = function Dialog({
  open,
  onOpenChange,
  children,
  className = "",
}: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [hasDescription, setHasDescription] = useState(false);
  /** Пока true — портал остаётся в DOM (включая анимацию закрытия). */
  const [mounted, setMounted] = useState(open);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const setHasDescriptionStable = useCallback((v: boolean) => {
    setHasDescription(v);
  }, []);

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  useEffect(() => {
    if (open || !mounted) return;

    const overlay = overlayRef.current;
    const panel = panelRef.current;
    let cancelled = false;

    const finishClose = () => {
      if (!cancelled) setMounted(false);
    };

    if (!overlay || !panel) {
      finishClose();
      return undefined;
    }

    if (prefersReducedInteractiveHoverLift()) {
      finishClose();
      return undefined;
    }

    remove(overlay);
    remove(panel);
    const animOverlay = animate(overlay, {
      opacity: [1, 0],
      duration: 200,
      ease: MOTION_INTERACTIVE_EASE,
    });
    const animPanel = animate(panel, {
      opacity: [1, 0],
      scale: [1, 0.97],
      duration: MOTION_INTERACTIVE_MS,
      ease: MOTION_INTERACTIVE_EASE,
    });

    const pOverlay = Promise.resolve(animOverlay).then(() => undefined);
    const pPanel = Promise.resolve(animPanel).then(() => undefined);
    void Promise.all([pOverlay, pPanel]).then(finishClose);

    return () => {
      cancelled = true;
      remove(overlay);
      remove(panel);
    };
  }, [open, mounted]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  useLayoutEffect(() => {
    if (!open || !mounted) return;
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    if (prefersReducedInteractiveHoverLift()) {
      overlay.style.opacity = "1";
      panel.style.opacity = "1";
      return;
    }

    remove(overlay);
    remove(panel);
    animate(overlay, {
      opacity: [0, 1],
      duration: 200,
      ease: MOTION_INTERACTIVE_EASE,
    });
    animate(panel, {
      opacity: [0, 1],
      scale: [0.97, 1],
      duration: MOTION_INTERACTIVE_MS,
      ease: MOTION_INTERACTIVE_EASE,
    });
  }, [open, mounted]);

  useLayoutEffect(() => {
    if (!open || !mounted || !panelRef.current) return;
    panelRef.current.focus();
  }, [open, mounted]);

  const ctxValue: DialogContextValue = {
    titleId,
    descriptionId,
    hasDescription,
    setHasDescription: setHasDescriptionStable,
    onOpenChange,
  };

  const handleBackdropPointerDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onOpenChange(false);
    },
    [onOpenChange],
  );

  if (typeof document === "undefined") return null;
  if (!mounted) return null;

  const lightUi = readBurneLightTheme();

  return createPortal(
    <DialogContext.Provider value={ctxValue}>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        role="presentation"
        {...(lightUi ? { "data-b-theme": "light" as const } : {})}
      >
        <div
          ref={overlayRef}
          className={[
            "absolute inset-0",
            lightUi
              ? "bg-[color-mix(in_oklab,var(--b-color-text)_14%,transparent)] backdrop-blur-[14px] backdrop-saturate-150 motion-reduce:backdrop-blur-none"
              : "bg-[color-mix(in_oklab,black_58%,transparent)]",
          ].join(" ")}
          style={{ opacity: prefersReducedInteractiveHoverLift() ? 1 : 0 }}
          aria-hidden
          onMouseDown={handleBackdropPointerDown}
        />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal={open}
          aria-hidden={!open}
          aria-labelledby={titleId}
          aria-describedby={hasDescription ? descriptionId : undefined}
          tabIndex={-1}
          className={[
            "relative z-10 flex max-h-[min(90dvh,36rem)] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-b-border bg-b-surface text-b-text shadow-lg outline-none",
            className,
          ].join(" ")}
          style={
            prefersReducedInteractiveHoverLift()
              ? undefined
              : { opacity: 0 }
          }
        >
          {children}
        </div>
      </div>
    </DialogContext.Provider>,
    document.body,
  );
};

export const Dialog = Object.assign(DialogRoot, {
  Header: DialogHeader,
  HeadingBlock: DialogHeadingBlock,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
  Body: DialogBody,
  Footer: DialogFooter,
});

export type {
  DialogHeaderProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogBodyProps,
  DialogFooterProps,
  DialogCloseProps,
};
