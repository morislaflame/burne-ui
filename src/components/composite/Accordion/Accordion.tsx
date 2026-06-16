import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import { Expandable, useExpandableContext } from "@/components/core/Expandable";
import { Text } from "@/components/core/Text";
import { getMotionConfig } from "@/components/core/utils/motionConfig";
import { useChevronRotation } from "@/components/core/utils/useChevronRotation";
import { cn } from "@/utils/cn";

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
  AccordionProps,
  AccordionTitleProps,
  AccordionTriggerProps,
} from "./Accordion.types";

type AccordionContextValue = {
  openId: string | null;
  setOpenId: (id: string | null) => void;
  getItemId: (explicit?: string) => string;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error("Компоненты Accordion.* должны быть внутри <Accordion>.");
  }
  return ctx;
}

function ChevronSvg({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`shrink-0 ${className}`}
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

export function AccordionRoot({
  defaultOpenId: defaultOpenIdProp = null,
  defaultOpenIndex = null,
  openId: openIdProp,
  onOpenIdChange,
  className,
  children,
  ...rest
}: AccordionProps) {
  const controlled = openIdProp !== undefined;
  const defaultOpenId =
    defaultOpenIdProp ?? (defaultOpenIndex != null ? String(defaultOpenIndex) : null);
  const [internalOpenId, setInternalOpenId] = useState<string | null>(defaultOpenId);
  const openId = controlled ? openIdProp : internalOpenId;
  const itemIndexRef = useRef(0);

  itemIndexRef.current = 0;

  const getItemId = useCallback((explicit?: string) => {
    if (explicit != null) return explicit;
    const id = String(itemIndexRef.current);
    itemIndexRef.current += 1;
    return id;
  }, []);

  const setOpenId = useCallback(
    (next: string | null) => {
      if (!controlled) setInternalOpenId(next);
      onOpenIdChange?.(next);
    },
    [controlled, onOpenIdChange],
  );

  const contextValue = useMemo(
    () => ({
      openId,
      setOpenId,
      getItemId,
    }),
    [getItemId, openId, setOpenId],
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div
        className={cn(
          "flex w-full flex-col text-left",
          "[&>[data-accordion-item]:first-child]:!rounded-t-mid",
          "[&>[data-accordion-item]:last-child]:!rounded-b-mid",
          "[&>[data-accordion-item]:not(:first-child)]:-mt-px",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { value, disabled, className, children, ...rest },
  ref,
) {
  const { openId, setOpenId, getItemId } = useAccordionContext();
  const itemId = getItemId(value);
  const isOpen = openId === itemId;

  return (
    <Expandable
      ref={ref}
      compound
      data-accordion-item
      disabled={disabled}
      open={isOpen}
      onOpenChange={(next) => setOpenId(next ? itemId : null)}
      className={cn("relative !rounded-none", className)}
      {...rest}
    >
      {children}
    </Expandable>
  );
});

export function AccordionHeading({ className, children, ...rest }: AccordionHeadingProps) {
  return (
    <h3 className={cn("m-0 font-[inherit] text-[inherit]", className)} {...rest}>
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
  const chevronRef = useRef<HTMLSpanElement | null>(null);
  useChevronRotation(open, chevronRef, () => getMotionConfig().enableExpandable);

  if (!hasPanel) return null;

  return (
    <span
      ref={chevronRef}
      className={cn("relative z-[1] ml-auto flex shrink-0 origin-center", className)}
      aria-hidden
      {...rest}
    >
      {children ?? <ChevronSvg />}
    </span>
  );
}

AccordionIndicator.displayName = "Accordion.Indicator";

export const AccordionPanel = forwardRef<HTMLDivElement, AccordionPanelProps>(
  function AccordionPanel(props, ref) {
    return <Expandable.Panel ref={ref} {...props} />;
  },
);

export function AccordionBody({ className, ...rest }: AccordionBodyProps) {
  return (
    <Text
      as="div"
      variant="base"
      className={cn("text-muted", className)}
      {...rest}
    />
  );
}

AccordionBody.displayName = "Accordion.Body";

AccordionItem.displayName = "Accordion.Item";
AccordionTrigger.displayName = "Accordion.Trigger";
AccordionPanel.displayName = "Accordion.Panel";
