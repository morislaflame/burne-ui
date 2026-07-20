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

import { useDisclosureTriggerMotion } from "./disclosureAnimations";

import { useDisclosureClassNames, useDisclosureContext } from "./disclosureContext";
import {
  DISCLOSURE_TRIGGER_CHEVRON_BASE_CLASS,
  DISCLOSURE_TRIGGER_CHEVRON_OPEN_CLASS,
  DISCLOSURE_TRIGGER_TITLE_CLASS,
  DISCLOSURE_TRIGGER_TITLE_LIFT_CLASS,
  TEXT_COLOR_TRANSITION,
  disclosureTriggerClass,
  disclosureTriggerShell,
} from "./disclosureStyles";
import type { DisclosureTriggerProps } from "./disclosureTypes";

import { cn } from "@/utils/cn";

export const DisclosureTrigger = forwardRef<HTMLButtonElement, DisclosureTriggerProps>(
  function DisclosureTrigger(
    {
      children,
      icon,
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
      iconPos,
      chevronRef,
      skipContentAnimRef,
    } = useDisclosureContext();

    const triggerShell = disclosureTriggerShell(size);

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

    const chevronNode =
      icon !== null ? (
        <span
          ref={motion.bindChevronRef}
          aria-hidden
          className={cn(
            DISCLOSURE_TRIGGER_CHEVRON_BASE_CLASS,
            triggerShell.chevron,
            TEXT_COLOR_TRANSITION,
            open && DISCLOSURE_TRIGGER_CHEVRON_OPEN_CLASS,
            slotClassNames.triggerChevron,
          )}
        >
          {icon ?? <IoChevronDown className="size-full" />}
        </span>
      ) : null;

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
        {iconPos === "left" && chevronNode}
        <span
          ref={motion.titleLiftRef}
          className={cn(
            DISCLOSURE_TRIGGER_TITLE_LIFT_CLASS,
            slotClassNames.triggerTitleLift,
          )}
        >
          <Text
            as="span"
            variant={triggerShell.text}
            className={cn(
              DISCLOSURE_TRIGGER_TITLE_CLASS,
              open ? "text-primary" : "text-foreground",
              slotClassNames.triggerTitle,
            )}
          >
            {children}
          </Text>
        </span>
        {iconPos === "right" && chevronNode}
      </button>
    );
  },
);

DisclosureTrigger.displayName = "DisclosureTrigger";

export { DisclosureHandleInner } from "./disclosureHandleInnerPart";
export { DisclosureContent } from "./disclosureContentPart";
