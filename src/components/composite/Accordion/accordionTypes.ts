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

export type AccordionProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  defaultOpenId?: string | null;
  /** Initial open item by index (0-based), if `value` is not provided. */
  defaultOpenIndex?: number | null;
  openId?: string | null;
  onOpenIdChange?: (id: string | null) => void;
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

export type AccordionIndicatorProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

export type AccordionPanelProps = HTMLAttributes<HTMLDivElement>;

export type AccordionBodyProps = HTMLAttributes<HTMLDivElement>;

export type AccordionContextValue = {
  openId: string | null;
  setOpenId: (id: string | null) => void;
  getItemId: (explicit?: string) => string;
  size: ExpandableSize;
};

export type UseAccordionRootStateProps = AccordionProps;
