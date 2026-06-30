import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type Ref,
} from "react";
import { IoChevronDown } from "react-icons/io5";

import { Text } from "@/components/core/Text";
import {
  useCollapsibleHeight,
  useCollapsibleShellRef,
} from "@/components/core/utils/useCollapsibleHeight";

import { useDisclosureTriggerMotion } from "./disclosureAnimations";
import { mergeDisclosureSlotClass } from "./disclosureAPI";
import { useDisclosureClassNames, useDisclosureContext } from "./disclosureContext";
import {
  DISCLOSURE_CONTENT_SHELL_CLASS,
  DISCLOSURE_GLOSS_PANEL_CLASS,
  DISCLOSURE_HANDLE_BASE_CLASS,
  DISCLOSURE_HANDLE_DISABLED_CLASS,
  DISCLOSURE_HANDLE_GRIP_CLASS,
  DISCLOSURE_TRIGGER_CHEVRON_BASE_CLASS,
  DISCLOSURE_TRIGGER_CHEVRON_OPEN_CLASS,
  DISCLOSURE_TRIGGER_TITLE_CLASS,
  DISCLOSURE_TRIGGER_TITLE_LIFT_CLASS,
  TEXT_COLOR_TRANSITION,
  disclosureContentPanelClass,
  disclosureContentWrapClass,
  disclosureGlossContentClass,
  disclosureTriggerClass,
  disclosureTriggerShell,
} from "./disclosureStyles";
import type {
  DisclosureContentProps,
  DisclosureHandleProps,
  DisclosureTriggerProps,
} from "./disclosureTypes";
import { useDisclosureContentDrag } from "./useDisclosureContentDrag";

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
          className={mergeDisclosureSlotClass(
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
        className: mergeDisclosureSlotClass(child.props.className, className),
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
          className={mergeDisclosureSlotClass(
            DISCLOSURE_TRIGGER_TITLE_LIFT_CLASS,
            slotClassNames.triggerTitleLift,
          )}
        >
          <Text
            as="span"
            variant={triggerShell.text}
            className={mergeDisclosureSlotClass(
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

export function DisclosureHandleInner({
  className,
  onPointerDown,
  ...rest
}: DisclosureHandleProps) {
  const slotClassNames = useDisclosureClassNames();
  const {
    variant,
    disabled,
    dragHandle,
    shellRef,
    innerRef,
    chevronRef,
    open,
    setOpen,
    skipContentAnimRef,
  } = useDisclosureContext();

  const { onPointerDown: dragPD } = useDisclosureContentDrag(
    shellRef,
    innerRef,
    chevronRef,
    open,
    setOpen,
    disabled,
    skipContentAnimRef,
  );

  if (!dragHandle || variant !== "card") return null;

  return (
    <div
      aria-hidden
      className={mergeDisclosureSlotClass(
        DISCLOSURE_HANDLE_BASE_CLASS,
        disabled && DISCLOSURE_HANDLE_DISABLED_CLASS,
        slotClassNames.handle,
        className,
      )}
      onPointerDown={(e) => {
        onPointerDown?.(e);
        dragPD(e);
      }}
      {...rest}
    >
      <span className={DISCLOSURE_HANDLE_GRIP_CLASS} />
    </div>
  );
}

DisclosureHandleInner.displayName = "DisclosureHandle";

export const DisclosureContent = forwardRef<HTMLDivElement, DisclosureContentProps>(
  function DisclosureContent({ children, className, ...rest }, ref) {
    const slotClassNames = useDisclosureClassNames();
    const {
      open,
      panelId,
      triggerId,
      size,
      variant,
      shellRef,
      innerRef,
      skipContentAnimRef,
    } = useDisclosureContext();

    useCollapsibleHeight(open, shellRef, innerRef, { skipAnimRef: skipContentAnimRef });

    const bindShellRef = useCollapsibleShellRef(shellRef, open);

    const setShellRef = useCallback(
      (node: HTMLDivElement | null) => {
        bindShellRef(node);
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [bindShellRef, ref],
    );

    const contentWrapCls = disclosureContentWrapClass(variant);
    const isGloss = variant === "gloss";

    return (
      <div
        ref={setShellRef}
        aria-hidden={!open}
        className={mergeDisclosureSlotClass(
          DISCLOSURE_CONTENT_SHELL_CLASS,
          slotClassNames.contentShell,
        )}
      >
        <div
          ref={innerRef}
          className={mergeDisclosureSlotClass(
            contentWrapCls,
            slotClassNames.contentWrap,
          )}
        >
          {isGloss ? (
            <section
              id={panelId}
              aria-labelledby={triggerId}
              className={mergeDisclosureSlotClass(
                slotClassNames.contentPanel,
                className,
              )}
              {...rest}
            >
              <div
                className={mergeDisclosureSlotClass(
                  DISCLOSURE_GLOSS_PANEL_CLASS,
                  slotClassNames.glossPanel,
                )}
              >
                <div className={disclosureGlossContentClass(size, slotClassNames.glossContent)}>
                  {children}
                </div>
              </div>
            </section>
          ) : (
            <section
              id={panelId}
              aria-labelledby={triggerId}
              className={disclosureContentPanelClass({
                variant,
                size,
                className,
                slotClass: slotClassNames.contentPanel,
              })}
              {...rest}
            >
              {children}
            </section>
          )}
        </div>
      </div>
    );
  },
);

DisclosureContent.displayName = "DisclosureContent";
