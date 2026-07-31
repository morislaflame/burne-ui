import {
  cloneElement,
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type Ref,
} from "react";
import { IoChevronDown } from "react-icons/io5";

import { Text } from "@/components/core/Text";
import { isMotionFeatureEnabled } from "@/components/core/utils/motionConfig";
import { useChevronRotation } from "@/components/core/utils/useChevronRotation";

import { useDisclosureTriggerMotion } from "./disclosureAnimations";
import { resolveDisclosureTriggerBody } from "./disclosureAPI";
import { useDisclosureClassNames, useDisclosureContext } from "./disclosureContext";
import {
  DISCLOSURE_TRIGGER_CHEVRON_BASE_CLASS,
  DISCLOSURE_TRIGGER_CHEVRON_ICON_CLASS,
  DISCLOSURE_TRIGGER_CHEVRON_OPEN_CLASS,
  DISCLOSURE_TRIGGER_TITLE_CLASS,
  DISCLOSURE_TRIGGER_TITLE_LIFT_CLASS,
  TEXT_COLOR_TRANSITION,
  disclosureTriggerClass,
  disclosureTriggerIconClass,
  disclosureTriggerShell,
} from "./disclosureStyles";
import type {
  DisclosureChevronProps,
  DisclosureIconProps,
  DisclosureTriggerProps,
} from "./disclosureTypes";

import { cn } from "@/utils/cn";

export function DisclosureIcon({ className, children, ...props }: DisclosureIconProps) {
  const { size } = useDisclosureContext();
  const slotClassNames = useDisclosureClassNames();

  if (children == null) return null;

  return (
    <span
      aria-hidden
      className={disclosureTriggerIconClass({
        size,
        className,
        slotClass: slotClassNames.icon,
      })}
      {...props}
    >
      {children}
    </span>
  );
}

DisclosureIcon.displayName = "DisclosureIcon";

export function DisclosureChevron({ className, children, ...props }: DisclosureChevronProps) {
  const { open, size, chevronRef, skipContentAnimRef } = useDisclosureContext();
  const slotClassNames = useDisclosureClassNames();
  const triggerShell = disclosureTriggerShell(size);
  const bindChevronRef = useChevronRotation(
    open,
    chevronRef,
    () => isMotionFeatureEnabled("enableExpandable"),
    skipContentAnimRef,
  );

  return (
    <span
      ref={bindChevronRef}
      aria-hidden
      className={cn(
        DISCLOSURE_TRIGGER_CHEVRON_BASE_CLASS,
        triggerShell.chevron,
        TEXT_COLOR_TRANSITION,
        open && DISCLOSURE_TRIGGER_CHEVRON_OPEN_CLASS,
        slotClassNames.chevron,
        className,
      )}
      {...props}
    >
      {children ?? <IoChevronDown className={DISCLOSURE_TRIGGER_CHEVRON_ICON_CLASS} />}
    </span>
  );
}

DisclosureChevron.displayName = "DisclosureChevron";

export const DisclosureTrigger = forwardRef<HTMLButtonElement, DisclosureTriggerProps>(
  function DisclosureTrigger(
    {
      children,
      icon,
      chevron,
      asChild,
      className,
      onKeyDown,
      onClick,
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
      ...rest
    },
    ref,
  ) {
    const slotClassNames = useDisclosureClassNames();
    const {
      open,
      setOpen,
      triggerId,
      panelId,
      variant,
      size,
      disabled,
      chevronPosition,
      chevronRef,
      skipContentAnimRef,
    } = useDisclosureContext();

    const triggerShell = disclosureTriggerShell(size);
    const body = resolveDisclosureTriggerBody(children);

    const motion = useDisclosureTriggerMotion({
      open,
      disabled,
      setOpen,
      chevronRef,
      skipContentAnimRef,
      forwardedRef: ref,
      onClick,
      onKeyDown,
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
    });

    const resolvedIcon =
      icon != null ? (
        <DisclosureIcon>{icon}</DisclosureIcon>
      ) : (
        body.icon
      );

    const hideChevron = chevron === null && !body.hasChevronPart;
    const chevronNode = hideChevron ? null : body.hasChevronPart ? (
      body.chevron
    ) : (
      <span
        ref={motion.bindChevronRef}
        aria-hidden
        className={cn(
          DISCLOSURE_TRIGGER_CHEVRON_BASE_CLASS,
          triggerShell.chevron,
          TEXT_COLOR_TRANSITION,
          open && DISCLOSURE_TRIGGER_CHEVRON_OPEN_CLASS,
          slotClassNames.chevron,
        )}
      >
        {chevron ?? <IoChevronDown className={DISCLOSURE_TRIGGER_CHEVRON_ICON_CLASS} />}
      </span>
    );

    const titleNode = body.title ?? children;

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<
        HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement>; disabled?: boolean }
      >;

      return cloneElement(child, {
        ...rest,
        id: triggerId,
        ref: motion.mergeRefs(ref, motion.setRefs, child.props.ref),
        className: cn(child.props.className, className),
        disabled: disabled || child.props.disabled,
        "aria-expanded": open,
        "aria-controls": panelId,
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          child.props.onClick?.(e);
          motion.handleClick(e as React.MouseEvent<HTMLButtonElement>);
        },
        onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
          child.props.onKeyDown?.(e);
          motion.handleKeyDown(e as KeyboardEvent<HTMLButtonElement>);
        },
      });
    }

    return (
      <button
        ref={motion.setRefs}
        id={triggerId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        disabled={disabled}
        className={disclosureTriggerClass({
          variant,
          size,
          disabled,
          className,
          slotClass: slotClassNames.trigger,
        })}
        onClick={motion.handleClick}
        onKeyDown={motion.handleKeyDown}
        onPointerEnter={motion.handlePointerEnter}
        onPointerLeave={motion.handlePointerLeave}
        onPointerDown={motion.handlePointerDown}
        {...rest}
      >
        {resolvedIcon}
        {chevronPosition === "start" && chevronNode}
        <span
          ref={motion.titleLiftRef}
          className={cn(
            DISCLOSURE_TRIGGER_TITLE_LIFT_CLASS,
            slotClassNames.titleLift,
          )}
        >
          <Text
            as="span"
            variant={triggerShell.text}
            className={cn(
              DISCLOSURE_TRIGGER_TITLE_CLASS,
              triggerShell.titleClassName,
              open ? "text-primary" : "text-foreground",
              slotClassNames.title,
            )}
          >
            {titleNode}
          </Text>
        </span>
        {chevronPosition === "end" && chevronNode}
      </button>
    );
  },
);

DisclosureTrigger.displayName = "DisclosureTrigger";

export { DisclosureHandleInner } from "./disclosureHandleInnerPart";
export { DisclosureContent } from "./disclosureContentPart";
