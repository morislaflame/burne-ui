import { forwardRef } from "react";

import { Expandable, useExpandableContext } from "@/components/core/Expandable";
import { Text } from "@/components/core/Text";

import { useAccordionIndicatorAnimation } from "./accordionAnimations";
import { mergeAccordionSlotClass } from "./accordionAPI";
import { useAccordionContext } from "./accordionContext";
import {
  ACCORDION_CHEVRON_CLASS,
  accordionBodyClass,
  accordionHeadingClass,
  accordionIndicatorClass,
  accordionItemClass,
} from "./accordionStyles";
import type {
  AccordionBodyProps,
  AccordionContentProps,
  AccordionDescriptionProps,
  AccordionHeadingProps,
  AccordionIconProps,
  AccordionIndicatorProps,
  AccordionItemProps,
  AccordionMessageProps,
  AccordionPanelProps,
  AccordionTitleProps,
  AccordionTriggerProps,
} from "./accordionTypes";

function AccordionChevronSvg({ className = "" }: { className?: string }) {
  return (
    <svg
      className={mergeAccordionSlotClass(ACCORDION_CHEVRON_CLASS, className)}
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

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { value, disabled, className, children, ...rest },
  ref,
) {
  const { openId, setOpenId, getItemId, size } = useAccordionContext();
  const itemId = getItemId(value);
  const isOpen = openId === itemId;

  return (
    <Expandable
      ref={ref}
      compound
      size={size}
      data-accordion-item
      disabled={disabled}
      open={isOpen}
      onOpenChange={(next) => setOpenId(next ? itemId : null)}
      className={accordionItemClass(className)}
      {...rest}
    >
      {children}
    </Expandable>
  );
});

AccordionItem.displayName = "Accordion.Item";

export function AccordionHeading({ className, children, ...rest }: AccordionHeadingProps) {
  return (
    <h3 className={accordionHeadingClass(className)} {...rest}>
      {children}
    </h3>
  );
}

AccordionHeading.displayName = "Accordion.Heading";

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger({ hideChevron = true, className, ...rest }, ref) {
    return (
      <Expandable.Trigger ref={ref} hideChevron={hideChevron} className={className} {...rest} />
    );
  },
);

AccordionTrigger.displayName = "Accordion.Trigger";

export function AccordionMessage(props: AccordionMessageProps) {
  return <Expandable.Message {...props} />;
}

AccordionMessage.displayName = "Accordion.Message";

export function AccordionIcon(props: AccordionIconProps) {
  return <Expandable.Icon {...props} />;
}

AccordionIcon.displayName = "Accordion.Icon";

export function AccordionContent(props: AccordionContentProps) {
  return <Expandable.Content {...props} />;
}

AccordionContent.displayName = "Accordion.Content";

export function AccordionTitle(props: AccordionTitleProps) {
  return <Expandable.Title {...props} />;
}

AccordionTitle.displayName = "Accordion.Title";

export function AccordionDescription(props: AccordionDescriptionProps) {
  return <Expandable.Description {...props} />;
}

AccordionDescription.displayName = "Accordion.Description";

export function AccordionIndicator({ className, children, ...rest }: AccordionIndicatorProps) {
  const { open, hasPanel } = useExpandableContext();
  const bindChevronRef = useAccordionIndicatorAnimation(open);

  if (!hasPanel) return null;

  return (
    <span
      ref={bindChevronRef}
      className={accordionIndicatorClass(className)}
      aria-hidden
      {...rest}
    >
      {children ?? <AccordionChevronSvg />}
    </span>
  );
}

AccordionIndicator.displayName = "Accordion.Indicator";

export const AccordionPanel = forwardRef<HTMLDivElement, AccordionPanelProps>(
  function AccordionPanel(props, ref) {
    return <Expandable.Panel ref={ref} {...props} />;
  },
);

AccordionPanel.displayName = "Accordion.Panel";

export function AccordionBody({ className, ...rest }: AccordionBodyProps) {
  return <Text as="div" variant="base" className={accordionBodyClass(className)} {...rest} />;
}

AccordionBody.displayName = "Accordion.Body";
