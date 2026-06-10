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
  type Ref,
} from "react";
import { createPortal } from "react-dom";

import {
  CloseButton,
  type CloseButtonProps,
} from "@/components/core/CloseButton";
import { prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import { motionInteractive } from "@/components/core/utils/motionConfig";
import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

/** Светлая тема UI: только `document.documentElement` (портал в `body`). */
function readBurneLightTheme(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.dataset.brnTheme === "light";
}

export type DialogProps = {
  /** Управляемое открытие. */
  open: boolean;
  /** Изменение открытия. */
  onOpenChange: (open: boolean) => void;
  /** Контент модалки. */
  children?: ReactNode;
  /** Доп. класс на панель (контент модалки). */
  className?: string;
  /** Закрытие по клику на подложку (вне панели). Для `AlertDialog` обычно `false`. */
  dismissOnBackdrop?: boolean;
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
type DialogCloseProps = CloseButtonProps;

export function DialogHeader({ className = "", ...rest }: DialogHeaderProps) {
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

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  function DialogTitle({ className = "", id, ...rest }, ref) {
    const { titleId } = useDialog();
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

export function DialogDescription({
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
    <Text
      as="p"
      variant="base"
      id={id ?? descriptionId}
      className={cn("text-muted", className)}
      {...rest}
    />
  );
}

/** Заголовок и подзаголовок: колонка с токенным зазором (`gap-base`). */
export function DialogHeadingBlock({
  className = "",
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-base text-left",
        className,
      )}
      {...rest}
    />
  );
}

export const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
  function DialogClose(
    { className = "", onClick, "aria-label": ariaLabel = "Закрыть", ...rest },
    ref,
  ) {
    const { onOpenChange } = useDialog();
    return (
      <CloseButton
        ref={ref}
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

/** Область контента между шапкой и футером: вертикальный скролл здесь; хедер и футер остаются на месте (`shrink-0` + `min-h-0` у панели). */
export function DialogBody({ className = "", ...rest }: DialogBodyProps) {
  return (
    <div
      className={cn(
        "min-h-0 flex-1 overflow-y-auto py-plus px-mid",
        className,
      )}
      {...rest}
    />
  );
}

export function DialogFooter({ className = "", ...rest }: DialogFooterProps) {
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

export const DialogRoot = function Dialog({
  open,
  onOpenChange,
  children,
  className = "",
  dismissOnBackdrop = true,
}: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [hasDescription, setHasDescription] = useState(false);
  /** Пока true — портал остаётся в DOM (включая анимацию закрытия). */
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const setHasDescriptionStable = useCallback((v: boolean) => {
    setHasDescription(v);
  }, []);

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
      if (!cancelled) {
        dialogRef.current?.close();
        setMounted(false);
      }
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
      ...motionInteractive(),
    });
    const animPanel = animate(panel, {
      opacity: [1, 0],
      scale: [1, 0.97],
      ...motionInteractive(),
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

  useLayoutEffect(() => {
    if (!open) return;
    if (!mounted) {
      setMounted(true);
      return;
    }

    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();

    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    if (prefersReducedInteractiveHoverLift()) {
      overlay.style.opacity = "1";
      panel.style.opacity = "1";
      panel.focus();
      return;
    }

    remove(overlay);
    remove(panel);
    animate(overlay, {
      opacity: [0, 1],
      ...motionInteractive(),
    });
    animate(panel, {
      opacity: [0, 1],
      scale: [0.97, 1],
      ...motionInteractive(),
    });
    panel.focus();
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
      if (!dismissOnBackdrop) return;
      if (e.target === e.currentTarget) onOpenChange(false);
    },
    [onOpenChange, dismissOnBackdrop],
  );

  if (typeof document === "undefined") return null;
  if (!mounted) return null;

  const lightUi = readBurneLightTheme();

  return createPortal(
    <DialogContext.Provider value={ctxValue}>
      <dialog
        ref={dialogRef}
        onClose={() => onOpenChange(false)}
        aria-labelledby={titleId}
        aria-describedby={hasDescription ? descriptionId : undefined}
        className={cn(
          "fixed inset-0 z-[100] m-0 flex h-full w-full max-h-none max-w-none items-center justify-center border-0 bg-transparent p-mid open:flex",
        )}
      >
        <div
          ref={overlayRef}
          className={cn(
            "absolute inset-0",
            lightUi
              ? "bg-[color-mix(in_oklab,var(--color-foreground)_14%,transparent)] backdrop-blur-[14px] backdrop-saturate-150 motion-reduce:backdrop-blur-none"
              : "bg-[color-mix(in_oklab,black_58%,transparent)]",
          )}
          style={{ opacity: prefersReducedInteractiveHoverLift() ? 1 : 0 }}
          aria-hidden
          onMouseDown={handleBackdropPointerDown}
        />
        <div
          ref={panelRef}
          tabIndex={-1}
          className={cn(
            "relative z-10 flex min-h-0 max-h-[min(90dvh,36rem)] w-full max-w-component-mid flex-col overflow-hidden rounded-mid border-token bg-surface text-left text-foreground shadow-token-lg outline-none",
            className,
          )}
          style={
            prefersReducedInteractiveHoverLift()
              ? undefined
              : { opacity: 0 }
          }
        >
          {children}
        </div>
      </dialog>
    </DialogContext.Provider>,
    document.body,
  );
};

export type {
  DialogHeaderProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogBodyProps,
  DialogFooterProps,
  DialogCloseProps,
};
