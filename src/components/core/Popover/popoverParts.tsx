import { Children, cloneElement, forwardRef, isValidElement, useCallback, useMemo, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type ReactElement, type Ref } from "react";
import { createPortal } from "react-dom";

import { Field } from "@/components/core/Field";
import { Text } from "@/components/core/Text";
import { burneLightThemePortalProps } from "@/components/core/utils/burneLightTheme";
import { mergeAsChildProps } from "@/components/core/utils/mergeAsChildProps";
import { resolvePortalContainer } from "@/components/core/utils/portalContainer";
import { runOpenAfterSqueeze, useOpeningRef } from "@/components/core/utils/runOpenAfterSqueeze";
import { TOOLTIP_ARROW_CLASS } from "@/components/core/Tooltip/tooltipPosition";

import { resolvePopoverDescribedBy, resolvePopoverLabelledBy, popoverTriggerA11y } from "./popoverA11y";
import { partitionPopoverContentChildren, POPOVER_ARROW_DISPLAY_NAME } from "./popoverAPI";
import { resolvePopoverContentAlign, usePopoverContentLifecycle } from "./popoverAnimations";
import { PopoverResolvedSideProvider, PopoverContentChromeProvider, usePopoverClassNames, usePopoverContext, usePopoverContentChrome, usePopoverResolvedSide } from "./popoverContext";
import { POPOVER_DEFAULT_OFFSET, popoverArrowClass, popoverBodyClass, popoverContentClass, popoverDefaultPanelClass, popoverGlossContentClass, popoverGlossPanelClass, popoverHeaderClass, popoverDescriptionVariant, popoverTitleClass, popoverTitleVariant, popoverTriggerClass, POPOVER_PANEL_RELATIVE_CLASS } from "./popoverStyles";
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
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
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
          else {
            runOpenAfterSqueeze({ triggerRef, openingRef, setOpen: () => setOpen(true) });
          }
        }
      },
      [onKeyDown, open, openingRef, setOpen, triggerRef],
    );

    const onlyChild =
      Children.count(children) === 1 && isValidElement(children) ? children : null;

    if (asChild && onlyChild) {
      const child = onlyChild as ReactElement;
      const triggerA11y = popoverTriggerA11y(open, popoverId);

      return cloneElement(
        child,
        mergeAsChildProps(
          child,
          {
            ...rest,
            className: cn(
              slotClassNames.root,
              slotClassNames.trigger,
              className,
            ),
            onPointerDown: (e: ReactPointerEvent<HTMLElement>) => {
              handlePointerDown(e);
              onPointerDown?.(e as ReactPointerEvent<HTMLButtonElement>);
            },
            onClick: handleClick,
            onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => {
              handleKeyDown(event as ReactKeyboardEvent<HTMLButtonElement>);
            },
            ...triggerA11y,
          },
          mergedRef,
          { runBeforeChild: ["onPointerDown", "onKeyDown"] },
        ),
      );
    }

    const triggerA11y = popoverTriggerA11y(open, popoverId);

    return (
      <button
        type="button"
        ref={mergedRef}
        className={popoverTriggerClass({
          rootSlot: slotClassNames.root,
          slotClass: slotClassNames.trigger,
          className,
        })}
        {...triggerA11y}
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

export const PopoverArrow = forwardRef<HTMLSpanElement, PopoverArrowProps>(
  function PopoverArrow({ className, ...rest }, ref) {
    const resolvedSide = usePopoverResolvedSide();
    const { variant } = usePopoverContext("Popover.Arrow");
    const slotClassNames = usePopoverClassNames();
    const isGloss = variant === "gloss";

    return (
      <span
        ref={ref}
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
  },
);

PopoverArrow.displayName = POPOVER_ARROW_DISPLAY_NAME;

export const PopoverHeader = forwardRef<HTMLDivElement, PopoverHeaderProps>(
  function PopoverHeader({ className, children, ...rest }, ref) {
    const { size } = usePopoverContext("Popover.Header");
    const { unstyled } = usePopoverContentChrome();
    const slotClassNames = usePopoverClassNames();

    return (
      <div
        ref={ref}
        className={popoverHeaderClass({
          size,
          unstyled,
          slotClass: slotClassNames.header,
          className,
        })}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

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
          size,
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

export const PopoverDescription = forwardRef<HTMLElement, PopoverDescriptionProps>(
  function PopoverDescription(
    { className, children, variant, ...rest },
    ref,
  ) {
    const { hintId, size } = usePopoverContext("Popover.Description");
    const slotClassNames = usePopoverClassNames();

    return (
      <Field.Hint
        ref={ref}
        as="p"
        id={hintId}
        variant={variant ?? popoverDescriptionVariant(size)}
        className={cn(slotClassNames.hint, className)}
        {...rest}
      >
        {children}
      </Field.Hint>
    );
  },
);

PopoverDescription.displayName = "PopoverDescription";

export const PopoverBody = forwardRef<HTMLDivElement, PopoverBodyProps>(
  function PopoverBody({ className, children, ...rest }, ref) {
    const { size } = usePopoverContext("Popover.Body");
    const { unstyled } = usePopoverContentChrome();
    const slotClassNames = usePopoverClassNames();

    return (
      <div
        ref={ref}
        className={popoverBodyClass({
          size,
          unstyled,
          slotClass: slotClassNames.body,
          className,
        })}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

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
      portalContainer: portalContainerProp,
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
      portalContainer: portalContainerFromRoot,
    } = usePopoverContext("Popover.Content");
    const slotClassNames = usePopoverClassNames();
    const isGloss = variant === "gloss";
    const align = resolvePopoverContentAlign({ alignProp, matchAnchorWidth });
    const gapPropSet = gapProp !== undefined;
    const contentGap = gapProp ?? "base";

    const { customArrow, panelChildren } = useMemo(
      () => partitionPopoverContentChildren(children),
      [children],
    );

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
      portalContainer: portalContainerProp ?? portalContainerFromRoot,
    });

    if (!portalMounted) return null;
    if (typeof document === "undefined") return null;

    const portalHost = resolvePortalContainer(
      portalContainerProp ?? portalContainerFromRoot,
    );
    if (!portalHost) return null;

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
        <PopoverContentChromeProvider unstyled={unstyled}>
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
            <div
              className={cn(
                POPOVER_PANEL_RELATIVE_CLASS,
                slotClassNames.panelRelative,
              )}
            >
              {showArrow ? (customArrow ?? <PopoverArrow />) : null}
              {isGloss ? (
                <div
                  ref={bindGlossPanelRef}
                  className={popoverGlossPanelClass({
                    size,
                    unstyled,
                    slotClass: slotClassNames.glossPanel,
                  })}
                >
                  <div
                    className={popoverGlossContentClass({
                      unstyled,
                      contentGap,
                      gapPropSet,
                      slotClass: slotClassNames.glossContent,
                    })}
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
                    gapPropSet,
                    slotClass: slotClassNames.panel,
                  })}
                >
                  {panelChildren}
                </div>
              )}
            </div>
          </div>
        </PopoverContentChromeProvider>
      </PopoverResolvedSideProvider>
    );

    return createPortal(node, portalHost);
  },
);

PopoverContent.displayName = "PopoverContent";
