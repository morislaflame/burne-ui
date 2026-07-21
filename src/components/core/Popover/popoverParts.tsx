import { Children, cloneElement, forwardRef, isValidElement, useCallback, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type ReactElement, type Ref } from "react";
import { createPortal } from "react-dom";

import { FieldHint } from "@/components/core/Field";
import { Text } from "@/components/core/Text";
import { burneLightThemePortalProps } from "@/components/core/utils/burneLightTheme";
import { runOpenAfterSqueeze, useOpeningRef } from "@/components/core/utils/runOpenAfterSqueeze";
import { TOOLTIP_ARROW_CLASS } from "@/components/core/Tooltip/tooltipPosition";

import { resolvePopoverDescribedBy, resolvePopoverLabelledBy } from "./popoverA11y";
import { mergePopoverRefs, partitionPopoverContentChildren, POPOVER_ARROW_DISPLAY_NAME } from "./popoverAPI";
import { resolvePopoverContentAlign, usePopoverContentLifecycle } from "./popoverAnimations";
import { PopoverResolvedSideProvider, usePopoverClassNames, usePopoverContext, usePopoverResolvedSide } from "./popoverContext";
import { POPOVER_DEFAULT_GAP, POPOVER_DEFAULT_OFFSET, popoverArrowClass, popoverBodyClass, popoverContentClass, popoverDefaultPanelClass, popoverGlossContentClass, popoverGlossPanelClass, popoverHeaderClass, popoverDescriptionVariant, popoverTitleClass, popoverTitleVariant, popoverTriggerClass, POPOVER_PANEL_RELATIVE_CLASS } from "./popoverStyles";
import type {
  PopoverArrowProps,
  PopoverBodyProps,
  PopoverContentProps,
  PopoverHeaderProps,
  PopoverDescriptionProps,
  PopoverTitleProps,
  PopoverTriggerProps,
} from "./popoverTypes";

import { cn } from "@/utils/cn";

export const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  function PopoverTrigger(
    { className = "", children, asChild = true, onClick, onPointerDown, onKeyDown, ...rest },
    ref,
  ) {
    const { open, setOpen, triggerRef, popoverId } =
      usePopoverContext("Popover.Trigger");
    const slotClassNames = usePopoverClassNames();
    const openingRef = useOpeningRef();

    const mergedRef = useCallback(
      (node: HTMLButtonElement | null) => {
        triggerRef.current = node;
        mergePopoverRefs(ref)(node);
      },
      [ref, triggerRef],
    );

    const handlePointerDown = useCallback(
      (e: ReactPointerEvent<HTMLElement>) => {
        if (open || openingRef.current || e.button !== 0) return;
        e.preventDefault();
        runOpenAfterSqueeze({ triggerRef, openingRef, setOpen: () => setOpen(true) });
      },
      [open, openingRef, triggerRef, setOpen],
    );

    const handleClick = useCallback(
      (event: ReactMouseEvent<HTMLElement>) => {
        onClick?.(event as ReactMouseEvent<HTMLButtonElement>);
        if (event.defaultPrevented) return;
        if (open) setOpen(false);
      },
      [onClick, open, setOpen],
    );

    const handleKeyDown = useCallback(
      (event: ReactKeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          if (open) setOpen(false);
          else if (!openingRef.current) setOpen(true);
        }
      },
      [onKeyDown, open, openingRef, setOpen],
    );

    const onlyChild =
      Children.count(children) === 1 && isValidElement(children) ? children : null;

    if (asChild && onlyChild) {
      const child = onlyChild as ReactElement<{
        className?: string;
        "aria-expanded"?: boolean;
        "aria-controls"?: string;
        onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
        onPointerDown?: (e: ReactPointerEvent<HTMLElement>) => void;
        onKeyDown?: (event: ReactKeyboardEvent<HTMLElement>) => void;
        ref?: Ref<HTMLElement>;
      }>;

      return cloneElement(child, {
        className: cn(
          slotClassNames.root,
          slotClassNames.trigger,
          child.props.className,
          className,
        ),
        // Trigger's pointerDown runs FIRST to call e.preventDefault() before child
        onPointerDown: (e: ReactPointerEvent<HTMLElement>) => {
          handlePointerDown(e);
          child.props.onPointerDown?.(e);
          onPointerDown?.(e as ReactPointerEvent<HTMLButtonElement>);
        },
        onClick: (event: ReactMouseEvent<HTMLElement>) => {
          child.props.onClick?.(event);
          handleClick(event);
        },
        onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => {
          child.props.onKeyDown?.(event);
          handleKeyDown(event as ReactKeyboardEvent<HTMLButtonElement>);
        },
        "aria-expanded": open,
        "aria-controls": open ? popoverId : undefined,
        ref: mergePopoverRefs(child.props.ref, mergedRef),
      });
    }

    return (
      <button
        type="button"
        ref={mergedRef}
        className={popoverTriggerClass({
          rootSlot: slotClassNames.root,
          slotClass: slotClassNames.trigger,
          className,
        })}
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        onPointerDown={(e) => {
          onPointerDown?.(e);
          handlePointerDown(e);
        }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

PopoverTrigger.displayName = "PopoverTrigger";

export function PopoverArrow({ className, ...rest }: PopoverArrowProps) {
  const resolvedSide = usePopoverResolvedSide();
  const { variant } = usePopoverContext("Popover.Arrow");
  const slotClassNames = usePopoverClassNames();
  const isGloss = variant === "gloss";

  return (
    <span
      aria-hidden
      className={popoverArrowClass({
        isGloss,
        resolvedSide,
        arrowSideClass: TOOLTIP_ARROW_CLASS[resolvedSide],
        slotClass: slotClassNames.arrow,
        className,
      })}
      {...rest}
    />
  );
}

PopoverArrow.displayName = POPOVER_ARROW_DISPLAY_NAME;

export function PopoverHeader({ className, children, ...rest }: PopoverHeaderProps) {
  const slotClassNames = usePopoverClassNames();

  return (
    <div
      className={popoverHeaderClass({
        slotClass: slotClassNames.header,
        className,
      })}
      {...rest}
    >
      {children}
    </div>
  );
}

PopoverHeader.displayName = "PopoverHeader";

export const PopoverTitle = forwardRef<HTMLHeadingElement, PopoverTitleProps>(
  function PopoverTitle({ className, children, id: idProp, ...rest }, ref) {
    const { labelId, size } = usePopoverContext("Popover.Title");
    const slotClassNames = usePopoverClassNames();

    return (
      <Text
        ref={ref as Ref<HTMLElement>}
        as="h2"
        variant={popoverTitleVariant(size)}
        id={idProp ?? labelId}
        className={popoverTitleClass({
          slotClass: slotClassNames.label,
          className,
        })}
        {...rest}
      >
        {children}
      </Text>
    );
  },
);

PopoverTitle.displayName = "PopoverTitle";

export function PopoverDescription({
  className,
  children,
  variant,
  ...rest
}: PopoverDescriptionProps) {
  const { hintId, size } = usePopoverContext("Popover.Description");
  const slotClassNames = usePopoverClassNames();

  return (
    <FieldHint
      as="p"
      id={hintId}
      variant={variant ?? popoverDescriptionVariant(size)}
      className={cn(slotClassNames.hint, className)}
      {...rest}
    >
      {children}
    </FieldHint>
  );
}

PopoverDescription.displayName = "PopoverDescription";

export function PopoverBody({ className, children, ...rest }: PopoverBodyProps) {
  const slotClassNames = usePopoverClassNames();

  return (
    <div
      className={popoverBodyClass({
        slotClass: slotClassNames.body,
        className,
      })}
      {...rest}
    >
      {children}
    </div>
  );
}

PopoverBody.displayName = "PopoverBody";

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent(
    {
      className = "",
      children,
      showArrow = false,
      offset = POPOVER_DEFAULT_OFFSET,
      gap: gapProp,
      matchAnchorWidth = false,
      align: alignProp,
      unstyled = false,
      contentRole = "dialog",
      ...rest
    },
    forwardedRef,
  ) {
    const {
      open,
      popoverId,
      size,
      variant,
      side,
      labelConnected,
      hintConnected,
      labelId,
      hintId,
      triggerRef,
      anchorRef,
      contentRef,
    } = usePopoverContext("Popover.Content");
    const slotClassNames = usePopoverClassNames();
    const isGloss = variant === "gloss";
    const align = resolvePopoverContentAlign({ alignProp, matchAnchorWidth });
    const contentGap = gapProp ?? POPOVER_DEFAULT_GAP[size];

    const { customArrow, panelChildren } =
      partitionPopoverContentChildren(children);

    const {
      setPanelRef,
      bindGlossPanelRef,
      portalMounted,
      resolvedSide,
    } = usePopoverContentLifecycle({
      open,
      side,
      offset,
      align,
      matchAnchorWidth,
      showArrow,
      isGloss,
      forwardedRef,
      contentRef,
      triggerRef,
      anchorRef,
    });

    if (!portalMounted) return null;
    if (typeof document === "undefined") return null;

    const portalTheme = burneLightThemePortalProps(
      anchorRef?.current ?? triggerRef.current,
    );

    const describedBy = resolvePopoverDescribedBy({
      contentRole,
      labelConnected,
      hintConnected,
      labelId,
      hintId,
    });

    const labelledBy = resolvePopoverLabelledBy({
      contentRole,
      labelConnected,
      labelId,
    });

    const node = (
      <PopoverResolvedSideProvider value={resolvedSide}>
        <div
          ref={setPanelRef}
          {...portalTheme}
          id={popoverId}
          role={contentRole}
          aria-modal={contentRole === "dialog" ? "false" : undefined}
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          data-side={resolvedSide}
          className={popoverContentClass({
            resolvedSide,
            showArrow,
            slotClass: slotClassNames.content,
            className,
          })}
          {...rest}
        >
          <div className={POPOVER_PANEL_RELATIVE_CLASS}>
            {showArrow ? (customArrow ?? <PopoverArrow />) : null}
            {isGloss ? (
              <div
                ref={bindGlossPanelRef}
                className={popoverGlossPanelClass({
                  size,
                  unstyled,
                  contentGap,
                  slotClass: slotClassNames.glossPanel,
                })}
              >
                <div
                  className={popoverGlossContentClass(slotClassNames.glossContent)}
                >
                  {panelChildren}
                </div>
              </div>
            ) : (
              <div
                className={popoverDefaultPanelClass({
                  size,
                  unstyled,
                  contentGap,
                  slotClass: slotClassNames.panel,
                })}
              >
                {panelChildren}
              </div>
            )}
          </div>
        </div>
      </PopoverResolvedSideProvider>
    );

    return createPortal(node, document.body);
  },
);

PopoverContent.displayName = "PopoverContent";
