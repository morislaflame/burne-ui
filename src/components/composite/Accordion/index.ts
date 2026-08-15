import { AccordionBody, AccordionContent, AccordionDescription, AccordionHeading, AccordionIcon, AccordionChevron, AccordionItem, AccordionMessage, AccordionPanel, AccordionRoot, AccordionTitle, AccordionTrigger } from "./Accordion";

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Heading: AccordionHeading,
  Trigger: AccordionTrigger,
  Message: AccordionMessage,
  Icon: AccordionIcon,
  Content: AccordionContent,
  Title: AccordionTitle,
  Description: AccordionDescription,
  Chevron: AccordionChevron,
  Panel: AccordionPanel,
  Body: AccordionBody,
});

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
  AccordionChevronProps,
  AccordionPanelProps,
  AccordionBodyProps,
  AccordionClassNames,
  AccordionMotion,
  AccordionLifecycleMotion,
  AccordionTriggerLiftMotion,
} from "./Accordion";
