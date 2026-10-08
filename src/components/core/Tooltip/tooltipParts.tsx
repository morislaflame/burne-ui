import { Children, cloneElement, forwardRef, isValidElement, useCallback, useLayoutEffect, useMemo, useRef, useState, type ForwardedRef, type ReactElement, type ReactNode } from "react";
import { createPortal } from "react-dom";
 
import { Text } from "@/components/core/Text";
import { SEMANTIC_STATUS_ICONS, type SemanticStatus } from "@/components/core/utils/semanticStatusIcons";
import { burneLightThemePortalProps } from "@/components/core/utils/burneLightTheme";
import { dataOpenState, dataVariantProps } from "@/components/core/utils/dataContract";
import { bindOverlayReflow } from "@/components/core/utils/bindOverlayReflow";
import { resolvePortalContainer, applyFloatingPortalPosition } from "@/components/core/utils/portalContainer";
import { mergeSkinSurfaceStyle, useApplySkinPortal, useSkinRegistryRevision, useSkinSurfaceStyle, useSkinVariant } from "@/skins/skinContext";
import { messageBannerDescriptionCellClass, messageBannerIndicatorCellClass, messageBannerTitleCellClass, type MessageBannerGridSlots } from "@/components/core/utils/messageBannerGridLayout";
import { mergeAsChildProps } from "@/components/core/utils/mergeAsChildProps";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { hasPointerPhases, mergeMotionSlotMaps, mergeMotionRootSiblings, useMotionPart } from "@/components/core/utils/slotMotion";
 
import { bindTriggerEvents, mergeDescribedBy } from "./tooltipA11y";
import { hasTooltipCompoundChildren, isTooltipArrowElement, resolveTooltipGridSlots } from "./tooltipAPI";
import { resolveTooltipMotionDefaults, useTooltipPortalMotion } from "./tooltipAnimations";
import { TooltipBodyContext, TooltipMotionProvider, TooltipResolvedSideContext, useOptionalTooltipMotionScope, useTooltipBodyContext, useTooltipClassNames, useTooltipContext, useTooltipMotionScope, useTooltipResolvedSide } from "./tooltipContext";
import { computeTooltipPlacement } from "./tooltipPosition";
import { TOOLTIP_COMPOUND_CONTENTS_CLASS, TOOLTIP_CONTENT_INNER_CLASS, TOOLTIP_CONTENT_VARIANT, TOOLTIP_DEFAULT_OFFSET, TOOLTIP_DESC_VARIANT, TOOLTIP_DESCRIPTION_MUTED_CLASS, TOOLTIP_ICON_SLOT_SIZE, TOOLTIP_STATUS_ACCENT_CLASS, TOOLTIP_STATUS_ICON_CLASS, TOOLTIP_TRIGGER_BASE_CLASS, tooltipArrowClass, tooltipContentClass, tooltipIndicatorClass, tooltipPanelClass, tooltipTitleClass } from "./tooltipStyles";
import type {
  TooltipArrowProps,
  TooltipContentProps,
  TooltipDescriptionProps,
  TooltipIconProps,
  TooltipIndicatorProps,
  TooltipMessageProps,
  TooltipPanelProps,
  TooltipTitleProps,
  TooltipTriggerProps,
} from "./tooltipTypes";
 
import { cn } from "@/utils/cn";
 
function resolveTooltipIndicatorInner({
  status,
  showIcon,
  icon,
  children,
}: {
  status: SemanticStatus;
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
        TOOLTIP_STATUS_ICON_CLASS,
        TOOLTIP_STATUS_ACCENT_CLASS[status],
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
  motion,
  onPointerOver,
  onPointerOut,
  ...rest
}: TooltipIndicatorProps) {
  const slotClassNames = useTooltipClassNames();
  const { status, size, icon, showIcon, gridSlots } = useTooltipBodyContext("Tooltip.Indicator");
  const { setRef, pointerHandlers } = useMotionPart<HTMLSpanElement>({
    scope: useOptionalTooltipMotionScope(),
    slot: "indicator",
    motion,
    pointerPhases: true,
    onPointerOver,
    onPointerOut,
  });
  const inner = resolveTooltipIndicatorInner({
    status,
    showIcon: showIconProp ?? showIcon,
    icon,
    children,
  });
 
  if (inner == null) return null;
 
  return (
    <span
      ref={setRef}
      className={cn(
        tooltipIndicatorClass(status, slotClassNames.indicator, className),
        TOOLTIP_ICON_SLOT_SIZE[size],
        slotClassNames.icon,
        messageBannerIndicatorCellClass(gridSlots),
      )}
      {...rest}
      {...pointerHandlers}
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
 
export function TooltipTitle({
  className,
  motion,
  onPointerOver,
  onPointerOut,
  ...rest
}: TooltipTitleProps) {
  const slotClassNames = useTooltipClassNames();
  const { size, status, gridSlots } = useTooltipBodyContext("Tooltip.Title");
  const { setRef, pointerHandlers } = useMotionPart<HTMLDivElement>({
    scope: useOptionalTooltipMotionScope(),
    slot: "title",
    motion,
    pointerPhases: true,
    onPointerOver,
    onPointerOut,
  });
 
  return (
    <Text
      as="div"
      ref={setRef}
      variant={TOOLTIP_CONTENT_VARIANT[size]}
      className={cn(
        tooltipTitleClass(status),
        messageBannerTitleCellClass(gridSlots),
        slotClassNames.title,
        className,
      )}
      {...rest}
      {...pointerHandlers}
    />
  );
}
 
TooltipTitle.displayName = "TooltipTitle";
 
export function TooltipDescription({
  className,
  motion,
  onPointerOver,
  onPointerOut,
  ...rest
}: TooltipDescriptionProps) {
  const slotClassNames = useTooltipClassNames();
  const { size, gridSlots } = useTooltipBodyContext("Tooltip.Description");
  const { setRef, pointerHandlers } = useMotionPart<HTMLDivElement>({
    scope: useOptionalTooltipMotionScope(),
    slot: "description",
    motion,
    pointerPhases: true,
    onPointerOver,
    onPointerOut,
  });
 
  return (
    <Text
      as="div"
      ref={setRef}
      variant={TOOLTIP_DESC_VARIANT[size]}
      className={cn(
        TOOLTIP_DESCRIPTION_MUTED_CLASS,
        messageBannerDescriptionCellClass(gridSlots),
        slotClassNames.description,
        className,
      )}
      {...rest}
      {...pointerHandlers}
    />
  );
}
 
TooltipDescription.displayName = "TooltipDescription";
 
export function TooltipPanel({
  variant: variantProp,
  status = "default",
  size = "base",
  icon,
  showIcon,
  title,
  description,
  className,
  children,
  motion,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  ...rest
}: TooltipPanelProps) {
  const variant = useSkinVariant(variantProp);
  const surfaceStyle = useSkinSurfaceStyle(variant);
  const slotClassNames = useTooltipClassNames();
  const isCompound = children != null && hasTooltipCompoundChildren(children);
  const scope = useOptionalTooltipMotionScope();
  const panelPointer = hasPointerPhases(motion ?? scope?.getRootMotion()?.panel);
  const panelPart = useMotionPart<HTMLDivElement>({
    scope,
    slot: "panel",
    motion,
    pointerPhases: panelPointer,
    pressPhases: panelPointer,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  const setPanelRef = panelPart.setRef;
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
    size,
    gridSlots,
    slotClass: slotClassNames.panel,
    className,
  });

  return (
    <TooltipBodyContext.Provider value={bodyCtx}>
      <div
        ref={setPanelRef}
        className={panelClass}
        {...rest}
        {...panelPart.pointerHandlers}
        style={mergeSkinSurfaceStyle(surfaceStyle, rest.style)}
      >
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
      const child = onlyChild as ReactElement;
      const childDescribedBy = (child.props as { "aria-describedby"?: string })[
        "aria-describedby"
      ];
 
      return cloneElement(
        child,
        mergeAsChildProps(
          child,
          {
            ...rest,
            ...bindTriggerEvents(triggerHandlers, {
              onPointerEnter,
              onPointerLeave,
              onFocus,
              onBlur,
            }),
            className: cn(
              slotClassNames.root,
              slotClassNames.trigger,
              className,
            ),
            "aria-describedby": mergeDescribedBy(childDescribedBy, tooltipId, open),
          },
          mergedRef,
        ),
      );
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
 
export function TooltipArrow({
  className,
  motion,
  onPointerOver,
  onPointerOut,
  ...rest
}: TooltipArrowProps) {
  const slotClassNames = useTooltipClassNames();
  const resolvedSide = useTooltipResolvedSide();
  const { variant } = useTooltipContext("Tooltip.Arrow");
  const { setRef, pointerHandlers } = useMotionPart<HTMLSpanElement>({
    scope: useOptionalTooltipMotionScope(),
    slot: "arrow",
    motion,
    pointerPhases: true,
    onPointerOver,
    onPointerOut,
  });
 
  return (
    <span
      ref={setRef}
      aria-hidden
      className={tooltipArrowClass({
        variant,
        resolvedSide,
        slotClass: slotClassNames.arrow,
        className,
      })}
      {...rest}
      {...pointerHandlers}
    />
  );
}
 
TooltipArrow.displayName = "TooltipArrow";
 
export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  function TooltipContent({ motion, motionController, motionState, motionPayload, playInitialState, ...props }, forwardedRef) {
    const parentScope = useOptionalTooltipMotionScope();
    const { variant } = useTooltipContext("Tooltip.Content");
    const skinRevision = useSkinRegistryRevision();
    const motionDefaults = useMemo(() => {
      void skinRevision;
      return resolveTooltipMotionDefaults(variant);
    }, [skinRevision, variant]);
    const mergedSlots = mergeMotionSlotMaps(parentScope?.getRootMotion(), motion);
    const siblings = mergeMotionRootSiblings(
      { events: parentScope?.getEvents(), states: parentScope?.getStates() },
      motion,
    );
    const merged = { ...mergedSlots, ...siblings };
    return (
      <TooltipMotionProvider
        motion={merged}
        defaults={motionDefaults}
        controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}
      >
        <TooltipContentHost {...props} forwardedRef={forwardedRef} />
      </TooltipMotionProvider>
    );
  },
);
 
TooltipContent.displayName = "TooltipContent";
 
function TooltipContentHost({
      className,
      children,
      showArrow = false,
      offset = TOOLTIP_DEFAULT_OFFSET,
      portalContainer: portalContainerProp,
      forwardedRef,
      ...rest
    }: Omit<TooltipContentProps, "motion" | "motionController" | "motionState" | "motionPayload" | "playInitialState"> & {
      forwardedRef?: ForwardedRef<HTMLDivElement>;
    }) {
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
      portalContainer: portalContainerFromRoot,
    } = useTooltipContext("Tooltip.Content");
 
    const tipRef = useRef<HTMLDivElement | null>(null);
    const [portalMounted, setPortalMounted] = useState(false);
    const [resolvedSide, setResolvedSide] = useState(side);
    useApplySkinPortal(tipRef, portalMounted);
 
    if (open && !portalMounted) {
      setPortalMounted(true);
    }
 
    const motionScope = useTooltipMotionScope();
    const { setRef: setContentPartRef } = useMotionPart<HTMLDivElement>({
      scope: motionScope,
      slot: "content",
    });
 
    const setTipRef = useCallback(
      (node: HTMLDivElement | null) => {
        tipRef.current = node;
        setContentPartRef(node);
        if (forwardedRef != null) mergeForwardedRef(forwardedRef, node);
      },
      [forwardedRef, setContentPartRef],
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
      applyFloatingPortalPosition(
        tip,
        placement,
        portalContainerProp ?? portalContainerFromRoot,
      );
      tip.style.transform = "";
    }, [offset, portalContainerFromRoot, portalContainerProp, side, triggerRef]);
 
    useLayoutEffect(() => {
      if (!open || !portalMounted) return;
      reposition();
      const raf = window.requestAnimationFrame(() => reposition());
      const unbindReflow = bindOverlayReflow(reposition);
 
      const tip = tipRef.current;
      const host = resolvePortalContainer(
        portalContainerProp ?? portalContainerFromRoot,
      );
      const ro =
        typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => reposition()) : null;
      if (tip && ro) ro.observe(tip);
      if (host && host !== document.body && ro) ro.observe(host);
 
      return () => {
        window.cancelAnimationFrame(raf);
        unbindReflow();
        ro?.disconnect();
      };
    }, [
      open,
      portalMounted,
      portalContainerFromRoot,
      portalContainerProp,
      reposition,
      children,
      showArrow,
      offset,
    ]);
 
    useTooltipPortalMotion({
      open,
      portalMounted,
      setPortalMounted,
      tipRef,
      scope: motionScope,
    });
 
    if (!portalMounted) return null;
    if (typeof document === "undefined") return null;
 
    const portalHost = resolvePortalContainer(
      portalContainerProp ?? portalContainerFromRoot,
    );
    if (!portalHost) return null;
 
    const portalTheme = burneLightThemePortalProps(triggerRef.current);
 
    const bubble = (
      <TooltipPanel
        variant={variant}
        status={status}
        size={size}
        icon={icon}
        showIcon={showIcon}
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
          className={tooltipContentClass({
            resolvedSide,
            showArrow,
            slotClass: slotClassNames.content,
            className,
          })}
          {...rest}
          {...dataVariantProps({ size, variant, status })}
          data-side={resolvedSide}
          data-align="center"
          data-state={dataOpenState(open)}
        >
          <div className={cn(TOOLTIP_CONTENT_INNER_CLASS, slotClassNames.panelRelative)}>
            {showArrow ? (customArrow ?? <TooltipArrow />) : null}
            {bubble}
          </div>
        </div>
      </TooltipResolvedSideContext.Provider>
    );
 
    return createPortal(node, portalHost);
}
 
