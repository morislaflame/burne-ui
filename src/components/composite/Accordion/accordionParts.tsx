import { forwardRef, useCallback, useMemo, useRef, type ForwardedRef } from "react";
 
import { Expandable, useExpandableContext } from "@/components/core/Expandable";
import { dataExpandedState } from "@/components/core/utils/dataContract";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { useExpandableMotionScope, useExpandableSimpleModeGuard, useOptionalExpandableMotionScope, useOptionalExpandableTriggerGrid } from "@/components/core/Expandable/expandableContext";
import { messageBannerActionCellClass } from "@/components/core/utils/messageBannerGridLayout";
import { createChevronRotationRefCallback } from "@/components/core/utils/useChevronRotation";
import { useMotionPart } from "@/components/core/utils/slotMotion";
import { Text } from "@/components/core/Text";
 
import { accordionDecorativeProps, accordionHeadingTag } from "./accordionA11y";
import { resolveAccordionItemMotion } from "./accordionAnimations";
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
 
/** Resolve item id once per mount when `value` is omitted (SSR / Strict Mode safe). */
function useAccordionItemId(explicitValue: string | undefined): string {
  const { allocateAutoItemId } = useAccordionContext();
  const autoIdRef = useRef<string | null>(null);
 
  if (explicitValue != null) return explicitValue;
  if (autoIdRef.current == null) {
    // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- allocates an id once when value is omitted; useState would allocate even when value is set
    autoIdRef.current = allocateAutoItemId();
  }
  return autoIdRef.current;
}
 
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
  { value, disabled, classNames, className, children, motion, motionController, motionState, motionPayload, playInitialState, ...rest },
  ref,
) {
  const {
    selectionMode,
    value: openValue,
    values,
    setItemOpen,
    variant,
    size,
    motion: rootMotion,
  } = useAccordionContext();
  const parentClassNames = useAccordionClassNames();
  const mergedClassNames = useMemo(
    () => ({ ...parentClassNames, ...classNames }),
    [parentClassNames, classNames],
  );
  const mergedMotion = useMemo(
    () => resolveAccordionItemMotion({ rootMotion, itemMotion: motion }),
    [motion, rootMotion],
  );
  const itemId = useAccordionItemId(value);
  const isOpen = selectionMode === "multiple" ? values.includes(itemId) : openValue === itemId;
 
  return (
    <AccordionClassNamesProvider classNames={classNames}>
      <Expandable
        ref={ref}
        variant={variant}
        size={size}
        disabled={disabled}
        open={isOpen}
        onOpenChange={(next) => setItemOpen(itemId, next)}
        classNames={resolveAccordionItemExpandableClassNames(mergedClassNames)}
        motion={mergedMotion}
        motionController={motionController}
                motionState={motionState}
                motionPayload={motionPayload}
                playInitialState={playInitialState}
        className={accordionItemClass(cn("accordion-item", className))}
        {...rest}
        data-state={dataExpandedState(isOpen)}
      >
        {children}
      </Expandable>
    </AccordionClassNamesProvider>
  );
});
 
AccordionItem.displayName = "Accordion.Item";
 
export const AccordionHeading = forwardRef(function AccordionHeading({ className, children, ...rest }: AccordionHeadingProps, ref: ForwardedRef<HTMLHeadingElement>) {
  useExpandableSimpleModeGuard("Accordion.Heading");
  const slotClassNames = useAccordionClassNames();
  const Heading = accordionHeadingTag();
 
  return (
    <Heading className={accordionHeadingClass({ className, slotClass: slotClassNames.heading })} {...rest}
      ref={ref}>
      {children}
    </Heading>
  );
});
 
AccordionHeading.displayName = "Accordion.Heading";
 
export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger({ hideChevron = true, className, ...rest }, ref) {
    return (
      <Expandable.Trigger ref={ref} hideChevron={hideChevron} className={className} {...rest} />
    );
  },
);
 
AccordionTrigger.displayName = "Accordion.Trigger";
 
export const AccordionMessage = forwardRef(function AccordionMessage(props: AccordionMessageProps, ref: ForwardedRef<HTMLDivElement>) {
  return <Expandable.Message {...props}
      ref={ref} />;
});
 
AccordionMessage.displayName = "Accordion.Message";
 
export const AccordionIcon = forwardRef<HTMLSpanElement, AccordionIconProps>(
  function AccordionIcon(props, ref) {
    return <Expandable.Icon ref={ref} {...props} />;
  },
);
 
AccordionIcon.displayName = "Accordion.Icon";
 
export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  function AccordionContent(props, ref) {
    return <Expandable.Content ref={ref} {...props} />;
  },
);
 
AccordionContent.displayName = "Accordion.Content";
 
export const AccordionTitle = forwardRef<HTMLDivElement, AccordionTitleProps>(
  function AccordionTitle(props, ref) {
    return <Expandable.Title ref={ref} {...props} />;
  },
);
 
AccordionTitle.displayName = "Accordion.Title";
 
export const AccordionDescription = forwardRef<HTMLDivElement, AccordionDescriptionProps>(
  function AccordionDescription(props, ref) {
    return <Expandable.Description ref={ref} {...props} />;
  },
);
 
AccordionDescription.displayName = "Accordion.Description";
 
export const AccordionChevron = forwardRef<HTMLSpanElement, AccordionChevronProps>(
  function AccordionChevron({ className, children, motion, ...rest }, ref) {
  const { open, hasPanel } = useExpandableContext();
  const slotClassNames = useAccordionClassNames();
  const gridSlots = useOptionalExpandableTriggerGrid();
  const scope = useExpandableMotionScope();
  const chevronRef = useRef<HTMLSpanElement | null>(null);
  const initialOpenRef = useRef(open);
  const bindChevronInit = useMemo(
    () => createChevronRotationRefCallback(chevronRef, initialOpenRef.current),
    [],
  );
  const { setRef: setChevronPartRef } = useMotionPart<HTMLSpanElement>({
    scope,
    slot: "chevron",
    motion,
    forwardedRef: ref,
  });
  const setChevronRef = useCallback(
    (node: HTMLSpanElement | null) => {
      bindChevronInit(node);
      setChevronPartRef(node);
    },
    [bindChevronInit, setChevronPartRef],
  );
 
  if (!hasPanel) return null;
 
  return (
    <span
      ref={setChevronRef}
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
},
);
 
AccordionChevron.displayName = "Accordion.Chevron";
 
export const AccordionPanel = forwardRef<HTMLDivElement, AccordionPanelProps>(
  function AccordionPanel(props, ref) {
    return <Expandable.Panel ref={ref} {...props} />;
  },
);
 
AccordionPanel.displayName = "Accordion.Panel";
 
export const AccordionBody = forwardRef<HTMLDivElement, AccordionBodyProps>(
  function AccordionBody({ className, motion, ...rest }, ref) {
    const slotClassNames = useAccordionClassNames();
    const { setRef } = useMotionPart<HTMLElement>({
      scope: useOptionalExpandableMotionScope(),
      slot: "body",
      motion,
    });
    const setBodyRef = useCallback(
      (node: HTMLElement | null) => {
        setRef(node);
        mergeForwardedRef(ref, node as HTMLDivElement | null);
      },
      [ref, setRef],
    );

    return (
      <Text
        as="div"
        ref={setBodyRef}
        textStyle="base"
        className={accordionBodyClass({
          className,
          slotClass: slotClassNames.body,
        })}
        {...rest}
      />
    );
  },
);
 
AccordionBody.displayName = "Accordion.Body";
 