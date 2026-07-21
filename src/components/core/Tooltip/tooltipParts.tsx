import { Children, cloneElement, forwardRef, isValidElement, useCallback, useLayoutEffect, useMemo, useRef, useState, type ReactElement, type ReactNode, type Ref } from "react";
import { createPortal } from "react-dom";

import { Text } from "@/components/core/Text";
import { SEMANTIC_STATUS_ICONS, type SemanticStatus } from "@/components/core/utils/semanticStatusIcons";
import { burneLightThemePortalProps } from "@/components/core/utils/burneLightTheme";
import { createGlossInteractiveRefCallback } from "@/components/core/utils/glossInteractiveMotion";
import { messageBannerDescriptionCellClass, messageBannerIndicatorCellClass, messageBannerTitleCellClass, type MessageBannerGridSlots } from "@/components/core/utils/messageBannerGridLayout";
import { shadowBase } from "@/components/core/utils/hoverInteractiveLift";
import { mergeForwardedRef, mergeRefs } from "@/components/core/utils/mergeRefs";
import { usePersistentElShadow } from "@/components/core/utils/useShadowMotion";
import "../utils/glossInteractive.css";

import { bindTriggerEvents, mergeDescribedBy } from "./tooltipA11y";
import { hasTooltipCompoundChildren, isTooltipArrowElement, resolveTooltipGridSlots } from "./tooltipAPI";
import { useTooltipPortalMotion } from "./tooltipAnimations";
import { TooltipBodyContext, TooltipResolvedSideContext, useTooltipBodyContext, useTooltipClassNames, useTooltipContext, useTooltipResolvedSide } from "./tooltipContext";
import { computeTooltipPlacement } from "./tooltipPosition";
import { TOOLTIP_COMPOUND_CONTENTS_CLASS, TOOLTIP_CONTENT_INNER_CLASS, TOOLTIP_CONTENT_VARIANT, TOOLTIP_DEFAULT_OFFSET, TOOLTIP_DESC_VARIANT, TOOLTIP_DESCRIPTION_MUTED_CLASS, TOOLTIP_ICON_SIZE, TOOLTIP_ICON_SLOT_SVG, TOOLTIP_STATUS_ICON_CLASS, TOOLTIP_INDICATOR_BASE_CLASS, TOOLTIP_TRIGGER_BASE_CLASS, tooltipArrowClass, tooltipContentClass, tooltipGlossContentClass, tooltipPanelClass } from "./tooltipStyles";
import type {
  TooltipArrowProps,
  TooltipContentProps,
  TooltipDescriptionProps,
  TooltipIconProps,
  TooltipIndicatorProps,
  TooltipMessageProps,
  TooltipPanelProps,
  TooltipSize,
  TooltipTitleProps,
  TooltipTriggerProps,
} from "./tooltipTypes";

import { cn } from "@/utils/cn";

function resolveTooltipIndicatorInner({
  status,
  size,
  showIcon,
  icon,
  children,
}: {
  status: SemanticStatus;
  size: TooltipSize;
  showIcon?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}): ReactNode | null {
  if (children === null) return null;
  if (children !== undefined) return children;
  if (showIcon === false) return null;
  if (icon != null) return icon;
  if (status === "default") return null;

  const Icon = SEMANTIC_STATUS_ICONS[status];
  return (
    <Icon
      aria-hidden
      className={cn(
        "shrink-0",
        TOOLTIP_ICON_SIZE[size],
        TOOLTIP_STATUS_ICON_CLASS[status],
      )}
    />
  );
}

function renderTooltipSimpleBody(
  children: ReactNode | undefined,
  title: ReactNode | undefined,
  description: ReactNode | undefined,
  gridSlots: MessageBannerGridSlots,
) {
  if (title != null || description != null) {
    return (
      <>
        {gridSlots.hasIndicator ? <TooltipIndicator /> : null}
        {title != null ? <TooltipTitle>{title}</TooltipTitle> : null}
        {description != null ? (
          <TooltipDescription>{description}</TooltipDescription>
        ) : null}
      </>
    );
  }

  if (children == null) return null;

  if (typeof children === "string" || typeof children === "number") {
    return (
      <>
        {gridSlots.hasIndicator ? <TooltipIndicator /> : null}
        <TooltipTitle>{children}</TooltipTitle>
      </>
    );
  }

  if (isValidElement(children)) {
    return (
      <>
        {gridSlots.hasIndicator ? <TooltipIndicator /> : null}
        <div className={messageBannerTitleCellClass(gridSlots)}>{children}</div>
      </>
    );
  }

  return children;
}

export function TooltipIndicator({
  className,
  children,
  showIcon: showIconProp,
  ...rest
}: TooltipIndicatorProps) {
  const slotClassNames = useTooltipClassNames();
  const { status, size, icon, showIcon, gridSlots } = useTooltipBodyContext("Tooltip.Indicator");
  const inner = resolveTooltipIndicatorInner({
    status,
    size,
    showIcon: showIconProp ?? showIcon,
    icon,
    children,
  });

  if (inner == null) return null;

  return (
    <span
      className={cn(
        TOOLTIP_INDICATOR_BASE_CLASS,
        TOOLTIP_ICON_SLOT_SVG[size],
        TOOLTIP_STATUS_ICON_CLASS[status],
        messageBannerIndicatorCellClass(gridSlots),
        slotClassNames.indicator,
        slotClassNames.icon,
        className,
      )}
      {...rest}
    >
      {inner}
    </span>
  );
}

TooltipIndicator.displayName = "TooltipIndicator";

export function TooltipIcon(props: TooltipIconProps) {
  return <TooltipIndicator {...props} />;
}

TooltipIcon.displayName = "TooltipIcon";

export function TooltipMessage({ className, ...rest }: TooltipMessageProps) {
  const slotClassNames = useTooltipClassNames();
  return (
    <div
      className={cn(
        TOOLTIP_COMPOUND_CONTENTS_CLASS,
        slotClassNames.message,
        className,
      )}
      {...rest}
    />
  );
}

TooltipMessage.displayName = "TooltipMessage";

export function TooltipTitle({ className, ...rest }: TooltipTitleProps) {
  const slotClassNames = useTooltipClassNames();
  const { size, gridSlots } = useTooltipBodyContext("Tooltip.Title");

  return (
    <Text
      as="div"
      variant={TOOLTIP_CONTENT_VARIANT[size]}
      className={cn(
        messageBannerTitleCellClass(gridSlots),
        slotClassNames.title,
        className,
      )}
      {...rest}
    />
  );
}

TooltipTitle.displayName = "TooltipTitle";

export function TooltipDescription({ className, ...rest }: TooltipDescriptionProps) {
  const slotClassNames = useTooltipClassNames();
  const { size, gridSlots } = useTooltipBodyContext("Tooltip.Description");

  return (
    <Text
      as="div"
      variant={TOOLTIP_DESC_VARIANT[size]}
      className={cn(
        TOOLTIP_DESCRIPTION_MUTED_CLASS,
        messageBannerDescriptionCellClass(gridSlots),
        slotClassNames.description,
        className,
      )}
      {...rest}
    />
  );
}

TooltipDescription.displayName = "TooltipDescription";

export function TooltipPanel({
  variant = "default",
  status = "default",
  size = "base",
  icon,
  showIcon,
  title,
  description,
  className,
  children,
  glossPanelRef,
  ...rest
}: TooltipPanelProps) {
  const slotClassNames = useTooltipClassNames();
  const isGloss = variant === "gloss";
  const isCompound = children != null && hasTooltipCompoundChildren(children);
  const gridSlots = useMemo(
    () =>
      resolveTooltipGridSlots({
        status,
        icon,
        showIcon,
        title,
        description,
        isCompound,
        children,
      }),
    [children, description, icon, isCompound, showIcon, status, title],
  );

  const bodyCtx = useMemo(
    () => ({ variant, status, size, icon, showIcon, gridSlots }),
    [gridSlots, icon, showIcon, size, status, variant],
  );

  const body = isCompound
    ? children
    : renderTooltipSimpleBody(children, title, description, gridSlots);

  const panelClass = tooltipPanelClass({
    variant,
    status,
    size,
    gridSlots,
    slotClass: isGloss
      ? cn(slotClassNames.panel, slotClassNames.glossPanel)
      : slotClassNames.panel,
    className,
  });

  if (isGloss) {
    return (
      <TooltipBodyContext.Provider value={bodyCtx}>
        <div ref={glossPanelRef} className={panelClass} {...rest}>
          <div
            className={tooltipGlossContentClass({
              gridSlots,
              size,
              slotClass: slotClassNames.glossContent,
            })}
          >
            {body}
          </div>
        </div>
      </TooltipBodyContext.Provider>
    );
  }

  return (
    <TooltipBodyContext.Provider value={bodyCtx}>
      <div className={panelClass} {...rest}>
        {body}
      </div>
    </TooltipBodyContext.Provider>
  );
}

TooltipPanel.displayName = "TooltipPanel";

export const TooltipTrigger = forwardRef<HTMLSpanElement, TooltipTriggerProps>(
  function TooltipTrigger(
    {
      asChild = true,
      className,
      children,
      onPointerEnter,
      onPointerLeave,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) {
    const slotClassNames = useTooltipClassNames();
    const { scheduleShow, hide, tooltipId, open, triggerRef } = useTooltipContext("Tooltip.Trigger");

    const triggerHandlers = useMemo(
      () => ({
        onPointerEnter: () => scheduleShow(),
        onPointerLeave: () => hide(),
        onFocus: () => scheduleShow(),
        onBlur: () => hide(),
      }),
      [hide, scheduleShow],
    );

    const mergedRef = useCallback(
      (node: HTMLSpanElement | null) => {
        triggerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref, triggerRef],
    );

    const onlyChild = Children.count(children) === 1 && isValidElement(children) ? children : null;

    if (asChild && onlyChild) {
      const child = onlyChild as ReactElement<{
        className?: string;
        "aria-describedby"?: string;
        onPointerEnter?: (e: React.PointerEvent<HTMLElement>) => void;
        onPointerLeave?: (e: React.PointerEvent<HTMLElement>) => void;
        onFocus?: (e: React.FocusEvent<HTMLElement>) => void;
        onBlur?: (e: React.FocusEvent<HTMLElement>) => void;
        ref?: Ref<HTMLElement>;
      }>;

      return cloneElement(child, {
        ...bindTriggerEvents(triggerHandlers, {
          onPointerEnter,
          onPointerLeave,
          onFocus,
          onBlur,
        }),
        className: cn(
          slotClassNames.root,
          slotClassNames.trigger,
          child.props.className,
          className,
        ),
        "aria-describedby": mergeDescribedBy(child.props["aria-describedby"], tooltipId, open),
        ref: mergeRefs(child.props.ref, mergedRef),
      });
    }

    return (
      <span
        ref={mergedRef}
        className={cn(
          TOOLTIP_TRIGGER_BASE_CLASS,
          slotClassNames.root,
          slotClassNames.trigger,
          className,
        )}
        aria-describedby={open ? tooltipId : undefined}
        tabIndex={rest.tabIndex ?? 0}
        {...bindTriggerEvents(triggerHandlers, {
          onPointerEnter,
          onPointerLeave,
          onFocus,
          onBlur,
        })}
        {...rest}
      >
        {children}
      </span>
    );
  },
);

TooltipTrigger.displayName = "TooltipTrigger";

export function TooltipArrow({ className, ...rest }: TooltipArrowProps) {
  const slotClassNames = useTooltipClassNames();
  const resolvedSide = useTooltipResolvedSide();
  const { variant, status } = useTooltipContext("Tooltip.Arrow");

  return (
    <span
      aria-hidden
      className={tooltipArrowClass({
        variant,
        status,
        resolvedSide,
        slotClass: slotClassNames.arrow,
        className,
      })}
      {...rest}
    />
  );
}

TooltipArrow.displayName = "TooltipArrow";

export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  function TooltipContent(
    {
      className,
      children,
      showArrow = false,
      offset = TOOLTIP_DEFAULT_OFFSET,
      ...rest
    },
    forwardedRef,
  ) {
    const slotClassNames = useTooltipClassNames();
    const {
      open,
      tooltipId,
      variant,
      status,
      size,
      side,
      icon,
      showIcon,
      triggerRef,
    } = useTooltipContext("Tooltip.Content");

    const tipRef = useRef<HTMLDivElement | null>(null);
    const glossPanelRef = useRef<HTMLDivElement | null>(null);
    const isGloss = variant === "gloss";
    const bindGlossPanelRef = useMemo(
      () => createGlossInteractiveRefCallback(glossPanelRef, isGloss),
      [isGloss],
    );
    const [portalMounted, setPortalMounted] = useState(false);
    const [resolvedSide, setResolvedSide] = useState(side);

    const setTipRef = useCallback(
      (node: HTMLDivElement | null) => {
        tipRef.current = node;
        mergeForwardedRef(forwardedRef, node);
      },
      [forwardedRef],
    );

    const parts = Children.toArray(children);
    const customArrow = parts.find(
      (child): child is ReactElement => isValidElement(child) && isTooltipArrowElement(child),
    );
    const bodyChildren = parts.filter(
      (child) => !(isValidElement(child) && isTooltipArrowElement(child)),
    );

    const reposition = useCallback(() => {
      const trigger = triggerRef.current;
      const tip = tipRef.current;
      if (!trigger || !tip) return;

      const placement = computeTooltipPlacement(
        trigger.getBoundingClientRect(),
        tip.getBoundingClientRect(),
        side,
        offset,
      );

      setResolvedSide(placement.resolvedSide);
      tip.style.position = "fixed";
      tip.style.left = `${placement.left}px`;
      tip.style.top = `${placement.top}px`;
      tip.style.transform = "";
    }, [offset, side, triggerRef]);

    useLayoutEffect(() => {
      if (open) setPortalMounted(true);
    }, [open]);

    usePersistentElShadow(tipRef, !isGloss, shadowBase);

    useLayoutEffect(() => {
      if (!open) return;
      reposition();
      const raf = window.requestAnimationFrame(() => reposition());
      const onReflow = () => reposition();
      window.addEventListener("scroll", onReflow, true);
      window.addEventListener("resize", onReflow);
      return () => {
        window.cancelAnimationFrame(raf);
        window.removeEventListener("scroll", onReflow, true);
        window.removeEventListener("resize", onReflow);
      };
    }, [open, reposition, children, showArrow, offset]);

    useTooltipPortalMotion({
      open,
      portalMounted,
      setPortalMounted,
      tipRef,
    });

    if (!portalMounted) return null;
    if (typeof document === "undefined") return null;

    const portalTheme = burneLightThemePortalProps(triggerRef.current);

    const bubble = (
      <TooltipPanel
        variant={variant}
        status={status}
        size={size}
        icon={icon}
        showIcon={showIcon}
        glossPanelRef={bindGlossPanelRef}
      >
        {bodyChildren.length === 1 ? bodyChildren[0] : bodyChildren}
      </TooltipPanel>
    );

    const node = (
      <TooltipResolvedSideContext.Provider value={resolvedSide}>
        <div
          ref={setTipRef}
          {...portalTheme}
          role="tooltip"
          id={tooltipId}
          data-side={resolvedSide}
          className={tooltipContentClass({
            resolvedSide,
            showArrow,
            slotClass: slotClassNames.content,
            className,
          })}
          {...rest}
        >
          <div className={TOOLTIP_CONTENT_INNER_CLASS}>
            {showArrow ? (customArrow ?? <TooltipArrow />) : null}
            {bubble}
          </div>
        </div>
      </TooltipResolvedSideContext.Provider>
    );

    return createPortal(node, document.body);
  },
);

TooltipContent.displayName = "TooltipContent";
