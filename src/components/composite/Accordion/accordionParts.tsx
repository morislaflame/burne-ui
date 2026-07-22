import { forwardRef, useMemo } from "react";

import { Expandable, useExpandableContext } from "@/components/core/Expandable";
import { useOptionalExpandableTriggerGrid } from "@/components/core/Expandable/expandableContext";
import { messageBannerActionCellClass } from "@/components/core/utils/messageBannerGridLayout";
import { Text } from "@/components/core/Text";

import { accordionDecorativeProps, accordionHeadingTag } from "./accordionA11y";
import { useAccordionChevronAnimation } from "./accordionAnimations";
import { resolveAccordionItemExpandableClassNames } from "./accordionAPI";

import { AccordionClassNamesProvider, useAccordionClassNames, useAccordionContext } from "./accordionContext";
import { ACCORDION_CHEVRON_CLASS, accordionBodyClass, accordionHeadingClass, accordionChevronClass, accordionItemClass } from "./accordionStyles";
import type {
  AccordionBodyProps,
  AccordionContentProps,
  AccordionDescriptionProps,
  AccordionHeadingProps,
  AccordionIconProps,
  AccordionChevronProps,
  AccordionItemProps,
  AccordionMessageProps,
  AccordionPanelProps,
  AccordionTitleProps,
  AccordionTriggerProps,
} from "./accordionTypes";

import { cn } from "@/utils/cn";

function AccordionChevronSvg({ className = "" }: { className?: string }) {
  return (
    <svg
      className={cn(ACCORDION_CHEVRON_CLASS, className)}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...accordionDecorativeProps()}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { value, disabled, classNames, className, children, ...rest },
  ref,
) {
  const { value: openValue, setValue, getItemId, size } = useAccordionContext();
  const parentClassNames = useAccordionClassNames();
  const mergedClassNames = useMemo(
    () => ({ ...parentClassNames, ...classNames }),
    [parentClassNames, classNames],
  );
  const itemId = getItemId(value);
  const isOpen = openValue === itemId;

  return (
    <AccordionClassNamesProvider classNames={classNames}>
      <Expandable
        ref={ref}
        compound
        size={size}
        data-accordion-item
        disabled={disabled}
        open={isOpen}
        onOpenChange={(next) => setValue(next ? itemId : null)}
        className={accordionItemClass(className)}
        classNames={resolveAccordionItemExpandableClassNames(mergedClassNames)}
        {...rest}
      >
        {children}
      </Expandable>
    </AccordionClassNamesProvider>
  );
});

AccordionItem.displayName = "Accordion.Item";

export function AccordionHeading({ className, children, ...rest }: AccordionHeadingProps) {
  const slotClassNames = useAccordionClassNames();
  const Heading = accordionHeadingTag();

  return (
    <Heading className={accordionHeadingClass({ className, slotClass: slotClassNames.heading })} {...rest}>
      {children}
    </Heading>
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

export function AccordionChevron({ className, children, ...rest }: AccordionChevronProps) {
  const { open, hasPanel } = useExpandableContext();
  const slotClassNames = useAccordionClassNames();
  const bindChevronRef = useAccordionChevronAnimation(open);
  const gridSlots = useOptionalExpandableTriggerGrid();

  if (!hasPanel) return null;

  return (
    <span
      ref={bindChevronRef}
      className={cn(
        gridSlots && messageBannerActionCellClass(gridSlots),
        accordionChevronClass({ className, slotClass: slotClassNames.chevron }),
      )}
      {...accordionDecorativeProps()}
      {...rest}
    >
      {children ?? <AccordionChevronSvg />}
    </span>
  );
}

AccordionChevron.displayName = "Accordion.Chevron";

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
