import { forwardRef } from "react";
 
import { AccordionClassNamesProvider, AccordionContext } from "./accordionContext";
import { AccordionBody, AccordionContent, AccordionDescription, AccordionHeading, AccordionIcon, AccordionChevron, AccordionItem, AccordionMessage, AccordionPanel, AccordionTitle, AccordionTrigger } from "./accordionParts";
import { dataVariantProps } from "@/components/core/utils/dataContract";
import { itemsPartTaken } from "@/components/core/utils/itemsBesideChildren";
import { accordionRootClass } from "./accordionStyles";
import type { AccordionProps } from "./accordionTypes";
import { useAccordionRootState } from "./useAccordionRootState";
 
export type {
  AccordionProps,
  AccordionSize,
  AccordionItemProps,
  AccordionHeadingProps,
  AccordionTriggerProps,
  AccordionMessageProps,
  AccordionIconProps,
  AccordionContentProps,
  AccordionTitleProps,
  AccordionDescriptionProps,
  AccordionChevronProps,
  AccordionPanelProps,
  AccordionBodyProps,
  AccordionClassNames,
  AccordionMotion,
  AccordionLifecycleMotion,
  AccordionTriggerLiftMotion,
  AccordionItemData,
} from "./accordionTypes";
 
export const AccordionRoot = forwardRef<HTMLDivElement, AccordionProps>(function AccordionRoot(
  {
    selectionMode = "single",
    defaultValue = null,
    value,
    onValueChange,
    values,
    defaultValues,
    onValuesChange,
    variant = "default",
    size = "base",
    className,
    classNames,
    motion,
    items,
    children,
    ...rest
  },
  ref,
) {
  const { contextValue } = useAccordionRootState({
    selectionMode,
    defaultValue,
    value,
    onValueChange,
    values,
    defaultValues,
    onValuesChange,
    variant,
    size,
    motion,
  });
 
  return (
    <AccordionContext.Provider value={contextValue}>
      <AccordionClassNamesProvider classNames={classNames}>
        <div
          ref={ref}
          className={accordionRootClass({ className, slotClass: classNames?.root })}
          {...rest}
          {...dataVariantProps({ size, variant })}
        >
          {items && !itemsPartTaken("Accordion", children, "Accordion.Item")
            ? items.map((item) => (
            <AccordionItem key={item.value} value={item.value} disabled={item.disabled}>
              <AccordionHeading>
                <AccordionTrigger>
                  <AccordionMessage>
                    {item.icon ? <AccordionIcon>{item.icon}</AccordionIcon> : null}
                    <AccordionContent>
                      <AccordionTitle>{item.title}</AccordionTitle>
                    </AccordionContent>
                    <AccordionChevron />
                  </AccordionMessage>
                </AccordionTrigger>
              </AccordionHeading>
              <AccordionPanel>
                <AccordionBody>{item.content}</AccordionBody>
              </AccordionPanel>
            </AccordionItem>
          ))
            : null}
          {children}
        </div>
      </AccordionClassNamesProvider>
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
  AccordionChevron,
  AccordionPanel,
  AccordionBody,
};
 