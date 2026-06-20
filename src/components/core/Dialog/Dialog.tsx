import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import "../utils/glossPanel.css";
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
import {
  burneLightThemePortalProps,
  useBurneLightTheme,
  usePortalThemeAnchor,
} from "@/components/core/utils/burneLightTheme";
import { cn } from "@/utils/cn";

export type DialogVariant = "default" | "gloss";

export type DialogProps = {
  /** Управляемое открытие. */
  open: boolean;
  /** Изменение открытия. */
  onOpenChange: (open: boolean) => void;
  /** Контент модалки. */
  children?: ReactNode;
  /** Доп. класс на панель (контент модалки). */
  className?: string;
  /** Стиль панели. `gloss` — стеклянная поверхность. */
  variant?: DialogVariant;
  /** Закрытие по клику на подложку (вне панели). Для `AlertDialog` обычно `false`. */
  dismissOnBackdrop?: boolean;
  /**
   * Якорь для наследования светлой темы с обёртки (`data-theme`).
   * По умолчанию — `document.activeElement` в момент открытия.
   */
  themeAnchor?: HTMLElement | null;
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
        "flex shrink-0 items-start gap-plus px-large pt-mid pb-plus text-left",
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
        "flex min-w-0 flex-1 flex-col gap-xsmall text-left",
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

/** Область контента между шапкой и футером: вертикальный скролл здесь; хедер и футер остаются на месте (`shrink-0` + `min-h-0` у панели). */
export function DialogBody({ className = "", ...rest }: DialogBodyProps) {
  return (
    <div
      className={cn(
        "min-h-0 flex-1 overflow-y-auto py-plus px-large",
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
        "flex shrink-0 flex-wrap items-center justify-end gap-base border-t-token py-plus px-large",
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
  variant = "default",
  dismissOnBackdrop = true,
  themeAnchor,
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

  const portalThemeAnchor = usePortalThemeAnchor(open, themeAnchor);
  const lightUi = useBurneLightTheme(portalThemeAnchor);

  useLayoutEffect(() => {
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

  useLayoutEffect(() => {
    if (open || !mounted) return;

    const overlay = overlayRef.current;
    const panel = panelRef.current;
    let cancelled = false;

    const finishClose = () => {
      if (!cancelled) setMounted(false);
    };

    if (!overlay || !panel || prefersReducedInteractiveHoverLift()) {
      finishClose();
      return undefined;
    }

    killMotion(overlay, panel);
    const vars = { ...motionInteractive(), overwrite: "auto" as const };
    const tl = gsap.timeline({ onComplete: finishClose });
    // opacity, не autoAlpha — visibility:hidden на blur-подложке даёт мигание в конце
    tl.to(overlay, { opacity: 0, ...vars }, 0);
    tl.to(panel, { autoAlpha: 0, scale: 0.97, ...vars }, 0);

    return () => {
      cancelled = true;
      tl.kill();
      killMotion(overlay, panel);
    };
  }, [open, mounted]);

  useLayoutEffect(() => {
    if (!open || !mounted) return;

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

    killMotion(overlay, panel);
    const vars = { ...motionInteractive(), overwrite: "auto" as const };
    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, ...vars });
    gsap.fromTo(panel, { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, ...vars });
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

  const portalTheme = burneLightThemePortalProps(portalThemeAnchor);

  return createPortal(
    <DialogContext.Provider value={ctxValue}>
      <dialog
        {...portalTheme}
        ref={dialogRef}
        onClose={() => onOpenChange(false)}
        aria-labelledby={titleId}
        aria-describedby={hasDescription ? descriptionId : undefined}
        className={cn(
          "fixed inset-0 z-[100] m-0 flex h-full w-full max-h-none max-w-none items-center justify-center border-0 bg-transparent p-mid open:flex [&::backdrop]:bg-transparent",
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
            "relative z-10 w-full max-w-component-mid outline-none",
            variant !== "gloss" &&
              "flex min-h-0 max-h-[min(90dvh,36rem)] flex-col overflow-hidden rounded-mid border-token bg-surface text-left text-foreground shadow-token-lg",
            className,
          )}
          style={
            prefersReducedInteractiveHoverLift()
              ? undefined
              : { opacity: 0 }
          }
        >
          {variant === "gloss" ? (
            <div className="gloss-wrap rounded-mid">
              <div className="gloss-shadow" aria-hidden />
              <div className="gloss-panel flex min-h-0 max-h-[min(90dvh,36rem)] w-full flex-col text-left text-foreground">
                <div className="gloss-content flex min-h-0 flex-1 flex-col">{children}</div>
              </div>
            </div>
          ) : (
            children
          )}
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
