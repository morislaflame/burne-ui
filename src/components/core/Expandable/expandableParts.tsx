import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useLayoutEffect,
  useRef,
  type HTMLAttributes,
  type ReactElement,
  type Ref,
} from "react";

import { Text } from "@/components/core/Text";
import { getMotionConfig } from "@/components/core/utils/motionConfig";
import { useChevronRotation } from "@/components/core/utils/useChevronRotation";

import { useExpandablePanelMotion, useExpandableTriggerMotion } from "./expandableAnimations";
import {
  hasExpandableMessage,
  mergeExpandableRefs,
  mergeExpandableSlotClass,
  partitionExpandableTriggerRipple,
} from "./expandableAPI";
import { useExpandable, useExpandableClassNames } from "./expandableContext";
import {
  EXPANDABLE_CHEVRON_WRAP_CLASS,
  EXPANDABLE_CONTENT_CLASS,
  EXPANDABLE_DESCRIPTION_CLASS,
  EXPANDABLE_DESCRIPTION_VARIANT,
  EXPANDABLE_GLOSS_CONTENT_CLASS,
  EXPANDABLE_MESSAGE_CLASS,
  EXPANDABLE_PANEL_SHELL_CLASS,
  EXPANDABLE_TRIGGER_CHEVRON_WRAP_CLASS,
  EXPANDABLE_TRIGGER_RIPPLE_OVERLAY_CLASS,
  expandableChevronIconClass,
  expandableIconClass,
  expandablePanelClass,
  expandableTitleVariant,
  expandableTriggerChevronIconClass,
  expandableTriggerClass,
  expandableTriggerLiftClass,
} from "./expandableStyles";
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

function ExpandableChevronSvg({ className }: { className?: string }) {
  return (
    <svg
      className={mergeExpandableSlotClass("shrink-0", className)}
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
        className={mergeExpandableSlotClass(
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

    const { ripples, rest: triggerChildren } =
      partitionExpandableTriggerRipple(children);
    const mainChildren = hasExpandableMessage(triggerChildren) ? (
      <>{triggerChildren}</>
    ) : (
      <ExpandableMessage>{triggerChildren}</ExpandableMessage>
    );

    const rippleOverlay =
      ripples.length > 0 ? (
        <span
          className={mergeExpandableSlotClass(
            EXPANDABLE_TRIGGER_RIPPLE_OVERLAY_CLASS,
            slotClassNames.triggerRippleOverlay,
          )}
          aria-hidden
        >
          {ripples}
        </span>
      ) : null;

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<
        HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement>; disabled?: boolean }
      >;

      return cloneElement(child, {
        ...props,
        id: headerId,
        ref: mergeExpandableRefs(ref, child.props.ref),
        className: mergeExpandableSlotClass(child.props.className, className),
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
        <span
          ref={motion.liftSpanRef}
          className={expandableTriggerLiftClass({
            hideChevron,
            slotClass: slotClassNames.triggerLift,
          })}
        >
          {mainChildren}
        </span>
        {!hideChevron && hasPanel ? (
          <span
            ref={motion.bindChevronRef}
            className={mergeExpandableSlotClass(
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
      </button>
    );
  },
);

ExpandableTrigger.displayName = "ExpandableTrigger";

export function ExpandableIcon({ className, ...props }: ExpandableIconProps) {
  const { size } = useExpandable();
  const slotClassNames = useExpandableClassNames();

  return (
    <span
      aria-hidden
      className={expandableIconClass({
        size,
        className,
        slotClass: slotClassNames.icon,
      })}
      {...props}
    />
  );
}

ExpandableIcon.displayName = "ExpandableIcon";

export function ExpandableContent({ className, ...props }: ExpandableContentProps) {
  const slotClassNames = useExpandableClassNames();

  return (
    <div
      className={mergeExpandableSlotClass(
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

  return (
    <Text
      as="div"
      variant={expandableTitleVariant(size)}
      className={mergeExpandableSlotClass(slotClassNames.title, className)}
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

  return (
    <Text
      as="div"
      variant={EXPANDABLE_DESCRIPTION_VARIANT[size]}
      className={mergeExpandableSlotClass(
        EXPANDABLE_DESCRIPTION_CLASS,
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
  const chevronRef = useRef<HTMLSpanElement | null>(null);
  const bindChevronRef = useChevronRotation(
    open,
    chevronRef,
    () => getMotionConfig().enableExpandable,
  );

  if (!hasPanel) return null;

  return (
    <span
      ref={bindChevronRef}
      className={mergeExpandableSlotClass(
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
        className={mergeExpandableSlotClass(
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
        <ExpandableMessage>
          {icon != null ? <ExpandableIcon>{icon}</ExpandableIcon> : null}
          <ExpandableContent>
            {title != null ? <ExpandableTitle>{title}</ExpandableTitle> : null}
            {description != null ? (
              <ExpandableDescription>{description}</ExpandableDescription>
            ) : null}
          </ExpandableContent>
        </ExpandableMessage>
      </ExpandableTrigger>
      {panelChildren != null ? (
        <ExpandablePanel>{panelChildren}</ExpandablePanel>
      ) : null}
    </>
  );
}

export { EXPANDABLE_GLOSS_CONTENT_CLASS };
