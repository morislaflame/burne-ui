import type { HTMLAttributes, ReactNode } from "react";

import type {
  ExpandableContentProps,
  ExpandableDescriptionProps,
  ExpandableIconProps,
  ExpandableMessageProps,
  ExpandableSize,
  ExpandableTitleProps,
  ExpandableTriggerProps,
} from "@/components/core/Expandable";

export type AccordionProps = Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue"> & {
  /** Controlled: id of the open item (`null` = all closed). */
  value?: string | null;
  /** Uncontrolled initial id (takes priority over `defaultOpenIndex`). */
  defaultValue?: string | null;
  /** Initial open item by index (0-based), if `defaultValue` is not provided. */
  defaultOpenIndex?: number | null;
  onValueChange?: (value: string | null) => void;
  size?: ExpandableSize;
  children?: ReactNode;
};

export type AccordionItemProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Explicit item id; if not provided, the index among siblings is used. */
  value?: string;
  disabled?: boolean;
  children?: ReactNode;
};

export type AccordionHeadingProps = HTMLAttributes<HTMLHeadingElement>;

export type AccordionTriggerProps = ExpandableTriggerProps;

export type AccordionMessageProps = ExpandableMessageProps;

export type AccordionIconProps = ExpandableIconProps;

export type AccordionContentProps = ExpandableContentProps;

export type AccordionTitleProps = ExpandableTitleProps;

export type AccordionDescriptionProps = ExpandableDescriptionProps;

export type AccordionChevronProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

export type AccordionPanelProps = HTMLAttributes<HTMLDivElement>;

export type AccordionBodyProps = HTMLAttributes<HTMLDivElement>;

export type AccordionContextValue = {
  value: string | null;
  setValue: (value: string | null) => void;
  getItemId: (explicit?: string) => string;
  size: ExpandableSize;
};

export type UseAccordionRootStateProps = AccordionProps;
