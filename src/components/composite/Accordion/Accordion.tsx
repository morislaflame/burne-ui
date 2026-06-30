import { forwardRef } from "react";

import { AccordionContext } from "./accordionContext";
import {
  AccordionBody,
  AccordionContent,
  AccordionDescription,
  AccordionHeading,
  AccordionIcon,
  AccordionIndicator,
  AccordionItem,
  AccordionMessage,
  AccordionPanel,
  AccordionTitle,
  AccordionTrigger,
} from "./accordionParts";
import { accordionRootClass } from "./accordionStyles";
import type { AccordionProps } from "./accordionTypes";
import { useAccordionRootState } from "./useAccordionRootState";

export type {
  AccordionProps,
  AccordionItemProps,
  AccordionHeadingProps,
  AccordionTriggerProps,
  AccordionMessageProps,
  AccordionIconProps,
  AccordionContentProps,
  AccordionTitleProps,
  AccordionDescriptionProps,
  AccordionIndicatorProps,
  AccordionPanelProps,
  AccordionBodyProps,
} from "./accordionTypes";

export const AccordionRoot = forwardRef<HTMLDivElement, AccordionProps>(function AccordionRoot(
  {
    defaultOpenId = null,
    defaultOpenIndex = null,
    openId,
    onOpenIdChange,
    size = "base",
    className,
    children,
    ...rest
  },
  ref,
) {
  const { contextValue } = useAccordionRootState({
    defaultOpenId,
    defaultOpenIndex,
    openId,
    onOpenIdChange,
    size,
  });

  return (
    <AccordionContext.Provider value={contextValue}>
      <div ref={ref} className={accordionRootClass(className)} {...rest}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
});

AccordionRoot.displayName = "Accordion";

export {
  AccordionItem,
  AccordionHeading,
  AccordionTrigger,
  AccordionMessage,
  AccordionIcon,
  AccordionContent,
  AccordionTitle,
  AccordionDescription,
  AccordionIndicator,
  AccordionPanel,
  AccordionBody,
};
