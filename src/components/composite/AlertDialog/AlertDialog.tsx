import { killMotion } from "@/components/core/utils/gsapMotion";
import {
  Children,
  createContext,
  cloneElement,
  forwardRef,
  Fragment,
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
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { createPortal } from "react-dom";

import { resolveAlertStatus, type AlertStatus } from "@/components/core/Alert/alertUtils";
import {
  messageBannerCloseCellClass,
  messageBannerDescriptionCellClass,
  messageBannerGridClass,
  messageBannerIndicatorCellClass,
  messageBannerTitleCellClass,
  type MessageBannerGridSlots,
} from "@/components/core/utils/messageBannerGridLayout";
import {
  alertDialogDefaultHeaderIcon,
  alertDialogHasClose,
  alertDialogHasIndicator,
  alertDialogHeaderIconWrapperClass,
  alertDialogShowsDefaultHeaderIcon,
  resolveAlertDialogHeaderGridSlots,
} from "./alertDialogHeaderUtils";
import {
  Button,
  type ButtonProps,
  type ButtonSize,
} from "@/components/core/Button";
import { CloseButton } from "@/components/core/CloseButton";
import {
  animateModalClose,
  animateModalOpen,
  applyReducedModalMotion,
  isReducedModalMotion,
  modalOverlayEnterStyle,
} from "@/components/core/utils/modalSurfaceMotion";
import {
  burneLightThemePortalProps,
  useBurneLightTheme,
  usePortalThemeAnchor,
} from "@/components/core/utils/burneLightTheme";
import { motionInteractive } from "@/components/core/utils/motionConfig";
import { Text } from "@/components/core/Text";
import { MODAL_BODY_SCROLL_CLASS } from "@/components/core/utils/modalPanelLayout";
import { cn } from "@/utils/cn";

import { createGlossInteractiveRefCallback } from "@/components/core/utils/glossInteractiveMotion";
import "@/components/core/utils/glossInteractive.css";

import { footerButtonSizeForAlertDialog } from "./alertDialogFooterUtils";
import { ALERT_DIALOG_SIZE } from "./alertDialogSizePresets";
import type {
  AlertDialogBodyProps,
  AlertDialogCloseProps,
  AlertDialogContextValue,
  AlertDialogDescriptionProps,
  AlertDialogFooterProps,
  AlertDialogHeaderProps,
  AlertDialogIndicatorProps,
  AlertDialogProps,
  AlertDialogTitleProps,
} from "./alertDialogTypes";
import { AlertDialogContext, useAlertDialog } from "./useAlertDialog";
import type { AlertDialogSizePreset } from "./alertDialogSizePresets";

export type {
  AlertDialogBodyProps,
  AlertDialogCloseProps,
  AlertDialogDescriptionProps,
  AlertDialogFooterProps,
  AlertDialogHeaderProps,
  AlertDialogIndicatorProps,
  AlertDialogProps,
  AlertDialogSize,
  AlertDialogTitleProps,
} from "./alertDialogTypes";

function injectFooterButtonSize(
  children: ReactNode,
  buttonSize: ButtonSize,
): ReactNode {
  return Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    if (child.type === Button) {
      const props = child.props as ButtonProps;
      return cloneElement(child as ReactElement<ButtonProps>, {
        size: props.size ?? buttonSize,
      });
    }
    if (child.type === Fragment) {
      const f = child as ReactElement<{ children?: ReactNode }>;
      return (
        <Fragment key={f.key ?? undefined}>
          {injectFooterButtonSize(f.props.children, buttonSize)}
        </Fragment>
      );
    }
    return child;
  });
}

const ALERT_DIALOG_SHELL_FILLED =
  "bg-surface text-foreground border-token shadow-token-lg";

function AlertDialogContent({
  className = "",
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  const { sizePreset } = useAlertDialog();
  return <div className={cn(sizePreset.contentClass, className)} {...rest} />;
}

export { AlertDialogContent };

function alertDialogPanelClass(tone: AlertStatus): string {
  if (tone === "outline") {
    return "bg-transparent border-token text-foreground shadow-token-lg";
  }
  if (tone === "secondary") {
    return "bg-secondary border-token text-secondary-foreground shadow-token-lg";
  }
  return ALERT_DIALOG_SHELL_FILLED;
}

type AlertDialogHeaderContextValue = {
  tone: AlertStatus;
  sizePreset: AlertDialogSizePreset;
  gridSlots: MessageBannerGridSlots;
  headerIcon?: ReactNode | null;
};

const AlertDialogHeaderContext = createContext<AlertDialogHeaderContextValue | null>(
  null,
);

function useAlertDialogHeaderContext(who: string): AlertDialogHeaderContextValue {
  const ctx = useContext(AlertDialogHeaderContext);
  if (!ctx) {
    throw new Error(`${who} должен быть внутри <AlertDialog.Header>.`);
  }
  return ctx;
}

function useOptionalAlertDialogHeaderContext() {
  return useContext(AlertDialogHeaderContext);
}

export const AlertDialogClose = forwardRef<
  HTMLButtonElement,
  AlertDialogCloseProps
>(function AlertDialogClose(
  { className = "", onClick, ...rest },
  ref,
) {
  const { onOpenChange } = useAlertDialog();
  const headerCtx = useOptionalAlertDialogHeaderContext();
  return (
    <CloseButton
      ref={ref}
      size="small"
      variant="secondary"
      className={cn(
        "shrink-0",
        headerCtx && messageBannerCloseCellClass(headerCtx.gridSlots),
        className,
      )}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) onOpenChange(false);
      }}
      {...rest}
    />
  );
});

AlertDialogClose.displayName = "AlertDialogClose";

export function AlertDialogIndicator({
  className = "",
  children,
  ...rest
}: AlertDialogIndicatorProps) {
  const { tone, sizePreset, gridSlots, headerIcon } =
    useAlertDialogHeaderContext("AlertDialog.Indicator");

  if (children === null) return null;

  const DefaultIcon = alertDialogDefaultHeaderIcon(tone);
  const inner =
    children !== undefined
      ? children
      : headerIcon !== undefined
        ? headerIcon
        : alertDialogShowsDefaultHeaderIcon(tone) && DefaultIcon !== null
          ? <DefaultIcon aria-hidden className={sizePreset.iconClass} />
          : null;

  if (inner === null) return null;

  return (
    <span
      className={cn(
        "shrink-0 [&_svg]:block",
        alertDialogHeaderIconWrapperClass(tone),
        messageBannerIndicatorCellClass(gridSlots),
        className,
      )}
      {...rest}
    >
      {inner}
    </span>
  );
}

AlertDialogIndicator.displayName = "AlertDialogIndicator";

export function AlertDialogHeader({
  icon,
  showClose = true,
  className = "",
  children,
  ...rest
}: AlertDialogHeaderProps) {
  const { tone, sizePreset } = useAlertDialog();
  const compoundHasIndicator = alertDialogHasIndicator(children);
  const compoundHasClose = alertDialogHasClose(children);

  const gridSlots = useMemo(
    () => resolveAlertDialogHeaderGridSlots(tone, icon, showClose, children),
    [children, icon, showClose, tone],
  );

  const headerCtx = useMemo<AlertDialogHeaderContextValue>(
    () => ({ tone, sizePreset, gridSlots, headerIcon: icon }),
    [gridSlots, icon, sizePreset, tone],
  );

  const showAutoIndicator = gridSlots.hasIndicator && !compoundHasIndicator;
  const showAutoClose = showClose && !compoundHasClose;

  return (
    <AlertDialogHeaderContext.Provider value={headerCtx}>
      <div
        className={cn(
          "shrink-0",
          messageBannerGridClass(gridSlots, sizePreset.headerGap),
          className,
        )}
        {...rest}
      >
        {showAutoIndicator ? <AlertDialogIndicator /> : null}
        {children}
        {showAutoClose ? <AlertDialogClose /> : null}
      </div>
    </AlertDialogHeaderContext.Provider>
  );
}

AlertDialogHeader.displayName = "AlertDialogHeader";

export const AlertDialogTitle = forwardRef<HTMLHeadingElement, AlertDialogTitleProps>(
  function AlertDialogTitle({ className = "", id, ...rest }, ref) {
    const { titleId, sizePreset } = useAlertDialog();
    const headerCtx = useOptionalAlertDialogHeaderContext();
    return (
      <Text
        ref={ref as Ref<HTMLElement>}
        as="h2"
        variant={sizePreset.titleVariant}
        id={id ?? titleId}
        className={cn(
          headerCtx && messageBannerTitleCellClass(headerCtx.gridSlots),
          className,
        )}
        {...rest}
      />
    );
  },
);

AlertDialogTitle.displayName = "AlertDialogTitle";

export function AlertDialogDescription({
  className = "",
  id,
  ...rest
}: AlertDialogDescriptionProps) {
  const { descriptionId, setHasDescription, sizePreset } = useAlertDialog();
  const headerCtx = useOptionalAlertDialogHeaderContext();
  useLayoutEffect(() => {
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription]);

  return (
    <Text
      as="p"
      variant={sizePreset.descVariant}
      id={id ?? descriptionId}
      className={cn(
        sizePreset.descClassName,
        headerCtx && messageBannerDescriptionCellClass(headerCtx.gridSlots),
        className,
      )}
      {...rest}
    />
  );
}

AlertDialogDescription.displayName = "AlertDialogDescription";

export function AlertDialogHeadingBlock({
  className = "",
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("contents", className)} {...rest} />;
}

AlertDialogHeadingBlock.displayName = "AlertDialogHeadingBlock";

export function AlertDialogBody({
  className = "",
  children,
  ...rest
}: AlertDialogBodyProps) {
  const { sizePreset } = useAlertDialog();
  return (
    <div
      className={cn(
        MODAL_BODY_SCROLL_CLASS,
        "text-left",
        className,
      )}
      {...rest}
    >
      <Text
        variant={sizePreset.bodyVariant}
        as="div"
      >
        {children}
      </Text>
    </div>
  );
}

export function AlertDialogFooter({
  className = "",
  children,
  ...rest
}: AlertDialogFooterProps) {
  const { footerButtonSize } = useAlertDialog();
  const footerChildren = useMemo(
    () => injectFooterButtonSize(children, footerButtonSize),
    [children, footerButtonSize],
  );
  return (
    <div
      className={cn(
        "flex shrink-0 flex-wrap items-center justify-end gap-base",
        className,
      )}
      {...rest}
    >
      {footerChildren}
    </div>
  );
}

export const AlertDialogRoot = function AlertDialog({
  open,
  onOpenChange,
  children,
  className = "",
  status,
  variant = "default",
  size = "base",
  themeAnchor,
}: AlertDialogProps) {
  const tone = resolveAlertStatus(status);
  const isGloss = variant === "gloss";
  const sizePreset = ALERT_DIALOG_SIZE[size];

  const titleId = useId();
  const descriptionId = useId();
  const [hasDescription, setHasDescription] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const glossPanelRef = useRef<HTMLDivElement>(null);
  const bindGlossPanelRef = useMemo(
    () => createGlossInteractiveRefCallback(glossPanelRef, isGloss),
    [isGloss],
  );

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

    if (!overlay || !panel || isReducedModalMotion()) {
      finishClose();
      return undefined;
    }

    killMotion(overlay, panel);
    const vars = { ...motionInteractive(), overwrite: "auto" as const };
    const tl = animateModalClose({ overlay, panel, vars, onComplete: finishClose });

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

    if (isReducedModalMotion()) {
      applyReducedModalMotion(overlay, panel, { focusPanel: true });
      return;
    }

    animateModalOpen({
      overlay,
      panel,
      vars: { ...motionInteractive(), overwrite: "auto" as const },
    });
    panel.focus();
  }, [open, mounted]);

  const ctxValue: AlertDialogContextValue = {
    titleId,
    descriptionId,
    hasDescription,
    setHasDescription: setHasDescriptionStable,
    onOpenChange,
    tone,
    size,
    sizePreset,
    footerButtonSize: footerButtonSizeForAlertDialog(size),
  };

  if (typeof document === "undefined") return null;
  if (!mounted) return null;

  const portalTheme = burneLightThemePortalProps(portalThemeAnchor);

  return createPortal(
    <AlertDialogContext.Provider value={ctxValue}>
      <dialog
        {...portalTheme}
        ref={dialogRef}
        role="alertdialog"
        onCancel={(e) => e.preventDefault()}
        aria-labelledby={titleId}
        aria-describedby={hasDescription ? descriptionId : undefined}
        className="fixed inset-0 z-[100] m-0 flex h-full w-full max-h-none max-w-none items-center justify-center border-0 bg-transparent p-mid open:flex [&::backdrop]:bg-transparent"
      >
        <div
          ref={overlayRef}
          className={cn(
            "absolute inset-0",
            lightUi
              ? "bg-[color-mix(in_oklab,var(--color-foreground)_14%,transparent)] backdrop-blur-[14px] backdrop-saturate-150 motion-reduce:backdrop-blur-none"
              : "bg-[color-mix(in_oklab,black_58%,transparent)]",
          )}
          style={modalOverlayEnterStyle()}
          aria-hidden
        />
        <div
          ref={panelRef}
          tabIndex={-1}
          className={cn(
            "relative z-10 w-full outline-none",
            sizePreset.panelMax,
            !isGloss &&
              cn(
                "flex min-h-0 flex-col overflow-hidden rounded-mid text-left",
                sizePreset.maxHeight,
                alertDialogPanelClass(tone),
              ),
            className,
          )}
        >
          {isGloss ? (
            <div
              ref={bindGlossPanelRef}
              className={cn(
                "gloss-panel gloss-deep flex min-h-0 w-full flex-col rounded-mid text-left text-foreground",
                sizePreset.maxHeight,
              )}
            >
              <AlertDialogContent className="gloss-content">{children}</AlertDialogContent>
            </div>
          ) : (
            <AlertDialogContent>{children}</AlertDialogContent>
          )}
        </div>
      </dialog>
    </AlertDialogContext.Provider>,
    document.body,
  );
};

