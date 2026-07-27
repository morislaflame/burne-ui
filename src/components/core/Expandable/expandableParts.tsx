import { cloneElement, forwardRef, isValidElement, useCallback, useMemo, useLayoutEffect, useRef, type HTMLAttributes, type ReactElement, type Ref } from "react";

import { Text } from "@/components/core/Text";
import { messageBannerActionCellClass, messageBannerDescriptionCellClass, messageBannerIndicatorCellClass, messageBannerTitleCellClass } from "@/components/core/utils/messageBannerGridLayout";
import { isMotionFeatureEnabled } from "@/components/core/utils/motionConfig";
import { useChevronRotation } from "@/components/core/utils/useChevronRotation";

import { useExpandablePanelMotion, useExpandableTriggerMotion } from "./expandableAnimations";
import { expandableTriggerHasActionSlot, hasExpandableMessage, mergeExpandableRefs, partitionExpandableTriggerRipple, resolveExpandableTriggerGridSlots } from "./expandableAPI";
import { ExpandableTriggerGridProvider, useExpandable, useExpandableClassNames, useExpandableTriggerGrid, useOptionalExpandableTriggerGrid } from "./expandableContext";
import { EXPANDABLE_CHEVRON_WRAP_CLASS, EXPANDABLE_CONTENT_CLASS, EXPANDABLE_DESCRIPTION_CLASS, EXPANDABLE_GLOSS_CONTENT_CLASS, EXPANDABLE_MESSAGE_CLASS, EXPANDABLE_PANEL_SHELL_CLASS, EXPANDABLE_TITLE_CLASS, EXPANDABLE_TRIGGER_CHEVRON_WRAP_CLASS, EXPANDABLE_TRIGGER_RIPPLE_OVERLAY_CLASS, expandableChevronIconClass, expandableDescriptionVariant, expandableIconClass, expandablePanelClass, expandableTitleClassName, expandableTitleVariant, expandableTriggerChevronIconClass, expandableTriggerClass, expandableTriggerLiftClass } from "./expandableStyles";
import type {
  ExpandableChevronProps,
  ExpandableContentProps,
  ExpandableDescriptionProps,
  ExpandableIconProps,
  ExpandableMessageProps,
  ExpandablePanelProps,
  ExpandableSimpleBodyProps,
  ExpandableTitleProps,
  ExpandableTriggerProps,
} from "./expandableTypes";

import { cn } from "@/utils/cn";

function ExpandableChevronSvg({ className }: { className?: string }) {
  return (
    <svg
      className={cn("shrink-0", className)}
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export const ExpandableMessage = forwardRef<HTMLDivElement, ExpandableMessageProps>(
  function ExpandableMessage({ className, ...rest }, ref) {
    const slotClassNames = useExpandableClassNames();

    return (
      <div
        ref={ref}
        className={cn(
          EXPANDABLE_MESSAGE_CLASS,
          slotClassNames.message,
          className,
        )}
        {...rest}
      />
    );
  },
);

ExpandableMessage.displayName = "ExpandableMessage";

export const ExpandableTrigger = forwardRef<HTMLButtonElement, ExpandableTriggerProps>(
  function ExpandableTrigger(
    {
      hideChevron = false,
      asChild,
      className,
      onClick,
      onKeyDown,
      onPointerDown: onPointerDownProp,
      children,
      type = "button",
      ...props
    },
    ref,
  ) {
    const {
      open,
      disabled,
      hasPanel,
      size,
      toggle,
      headerId,
      panelId,
    } = useExpandable();
    const slotClassNames = useExpandableClassNames();

    const motion = useExpandableTriggerMotion({
      open,
      disabled,
      toggle,
      forwardedRef: ref,
      onClick,
      onKeyDown,
      onPointerDown: onPointerDownProp,
    });

    const { ripples, rest: triggerChildren } = useMemo(
      () => partitionExpandableTriggerRipple(children),
      [children],
    );

    const gridSlots = useMemo(
      () =>
        resolveExpandableTriggerGridSlots({
          children: triggerChildren,
          hideChevron,
          hasPanel,
        }),
      [triggerChildren, hideChevron, hasPanel],
    );

    const mainChildren = hasExpandableMessage(triggerChildren) ? (
      <>{triggerChildren}</>
    ) : (
      <ExpandableMessage>{triggerChildren}</ExpandableMessage>
    );

    const showsDefaultChevron =
      hasPanel && !hideChevron && !expandableTriggerHasActionSlot(triggerChildren);

    const rippleOverlay =
      ripples.length > 0 ? (
        <span
          className={cn(
            EXPANDABLE_TRIGGER_RIPPLE_OVERLAY_CLASS,
            slotClassNames.triggerRippleOverlay,
          )}
          aria-hidden
        >
          {ripples}
        </span>
      ) : null;

    const liftBody = (
      <>
        {mainChildren}
        {showsDefaultChevron ? (
          <span
            ref={motion.bindChevronRef}
            className={cn(
              messageBannerActionCellClass(gridSlots),
              EXPANDABLE_TRIGGER_CHEVRON_WRAP_CLASS,
              slotClassNames.chevron,
            )}
            aria-hidden
          >
            <ExpandableChevronSvg
              className={expandableTriggerChevronIconClass(size)}
            />
          </span>
        ) : null}
      </>
    );

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<
        HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement>; disabled?: boolean }
      >;

      return cloneElement(child, {
        ...props,
        id: headerId,
        ref: mergeExpandableRefs(ref, child.props.ref),
        className: cn(child.props.className, className),
        disabled: disabled || child.props.disabled,
        "aria-expanded": hasPanel ? open : undefined,
        "aria-controls": hasPanel ? panelId : undefined,
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          child.props.onClick?.(e);
          motion.handleClick(e as React.MouseEvent<HTMLButtonElement>);
        },
        onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
          child.props.onKeyDown?.(e);
          motion.handleKeyDown(e as React.KeyboardEvent<HTMLButtonElement>);
        },
      });
    }

    return (
      <button
        ref={motion.setTriggerRef}
        type={type}
        id={headerId}
        className={expandableTriggerClass({
          size,
          disabled,
          className,
          slotClass: slotClassNames.trigger,
        })}
        aria-expanded={hasPanel ? open : undefined}
        aria-controls={hasPanel ? panelId : undefined}
        disabled={disabled}
        onPointerDown={motion.handlePointerDown}
        onClick={motion.handleClick}
        onKeyDown={motion.handleKeyDown}
        {...props}
      >
        {rippleOverlay}
        <ExpandableTriggerGridProvider gridSlots={gridSlots}>
          <span
            ref={motion.liftSpanRef}
            className={expandableTriggerLiftClass({
              gridSlots,
              slotClass: slotClassNames.triggerLift,
            })}
          >
            {liftBody}
          </span>
        </ExpandableTriggerGridProvider>
      </button>
    );
  },
);

ExpandableTrigger.displayName = "ExpandableTrigger";

export function ExpandableIcon({ className, children, ...props }: ExpandableIconProps) {
  const { size } = useExpandable();
  const slotClassNames = useExpandableClassNames();
  const gridSlots = useOptionalExpandableTriggerGrid();

  if (children == null) return null;

  return (
    <span
      aria-hidden
      className={cn(
        expandableIconClass({
          size,
          className,
          slotClass: slotClassNames.icon,
        }),
        gridSlots && messageBannerIndicatorCellClass(gridSlots),
      )}
      {...props}
    >
      {children}
    </span>
  );
}

ExpandableIcon.displayName = "ExpandableIcon";

export function ExpandableContent({ className, ...props }: ExpandableContentProps) {
  const slotClassNames = useExpandableClassNames();

  return (
    <div
      className={cn(
        EXPANDABLE_CONTENT_CLASS,
        slotClassNames.content,
        className,
      )}
      {...props}
    />
  );
}

ExpandableContent.displayName = "ExpandableContent";

export function ExpandableTitle({ className, ...props }: ExpandableTitleProps) {
  const { size } = useExpandable();
  const slotClassNames = useExpandableClassNames();
  const gridSlots = useOptionalExpandableTriggerGrid();

  return (
    <Text
      as="div"
      variant={expandableTitleVariant(size)}
      className={cn(
        EXPANDABLE_TITLE_CLASS,
        expandableTitleClassName(size),
        gridSlots && messageBannerTitleCellClass(gridSlots),
        slotClassNames.title,
        className,
      )}
      {...props}
    />
  );
}

ExpandableTitle.displayName = "ExpandableTitle";

export function ExpandableDescription({
  className,
  ...props
}: ExpandableDescriptionProps) {
  const { size } = useExpandable();
  const slotClassNames = useExpandableClassNames();
  const gridSlots = useOptionalExpandableTriggerGrid();

  return (
    <Text
      as="div"
      variant={expandableDescriptionVariant(size)}
      className={cn(
        EXPANDABLE_DESCRIPTION_CLASS,
        gridSlots && messageBannerDescriptionCellClass(gridSlots),
        slotClassNames.description,
        className,
      )}
      {...props}
    />
  );
}

ExpandableDescription.displayName = "ExpandableDescription";

export function ExpandableChevron({ className, ...props }: ExpandableChevronProps) {
  const { open, hasPanel, size } = useExpandable();
  const slotClassNames = useExpandableClassNames();
  const gridSlots = useExpandableTriggerGrid();
  const chevronRef = useRef<HTMLSpanElement | null>(null);
  const bindChevronRef = useChevronRotation(
    open,
    chevronRef,
    () => isMotionFeatureEnabled("enableExpandable"),
  );

  if (!hasPanel) return null;

  return (
    <span
      ref={bindChevronRef}
      className={cn(
        messageBannerActionCellClass(gridSlots),
        EXPANDABLE_CHEVRON_WRAP_CLASS,
        slotClassNames.chevron,
        className,
      )}
      aria-hidden
      {...props}
    >
      <ExpandableChevronSvg className={expandableChevronIconClass(size)} />
    </span>
  );
}

ExpandableChevron.displayName = "ExpandableChevron";

export const ExpandablePanel = forwardRef<HTMLDivElement, ExpandablePanelProps>(
  function ExpandablePanel({ className, children, ...props }, ref) {
    const { open, headerId, panelId, size, setHasPanel } = useExpandable();
    const slotClassNames = useExpandableClassNames();
    const panelMotion = useExpandablePanelMotion(open);

    useLayoutEffect(() => {
      setHasPanel(true);
      return () => setHasPanel(false);
    }, [setHasPanel]);

    const setSectionRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    return (
      <div
        ref={panelMotion.bindShellRef}
        className={cn(
          EXPANDABLE_PANEL_SHELL_CLASS,
          slotClassNames.panelShell,
        )}
      >
        <div ref={panelMotion.innerRef}>
          <section
            ref={setSectionRef}
            id={panelId}
            aria-labelledby={headerId}
            aria-hidden={!open}
            inert={!open}
            className={expandablePanelClass({
              size,
              className,
              slotClass: slotClassNames.panel,
            })}
            {...props}
          >
            {children}
          </section>
        </div>
      </div>
    );
  },
);

ExpandablePanel.displayName = "ExpandablePanel";

export function ExpandableSimpleBody({
  title,
  description,
  icon,
  panelChildren,
}: ExpandableSimpleBodyProps) {
  return (
    <>
      <ExpandableTrigger>
        {icon != null ? <ExpandableIcon>{icon}</ExpandableIcon> : null}
        {title != null ? <ExpandableTitle>{title}</ExpandableTitle> : null}
        {description != null ? (
          <ExpandableDescription>{description}</ExpandableDescription>
        ) : null}
      </ExpandableTrigger>
      {panelChildren != null ? (
        <ExpandablePanel>{panelChildren}</ExpandablePanel>
      ) : null}
    </>
  );
}

export { EXPANDABLE_GLOSS_CONTENT_CLASS };
