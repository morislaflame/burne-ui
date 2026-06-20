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
  /** Начально открытый пункт по id (`Accordion.Item value`) или индексу. */
  defaultOpenId?: string | null;
  /** Начально открытый пункт по порядковому номеру (0-based), если `value` не задан. */
  defaultOpenIndex?: number | null;
  openId?: string | null;
  onOpenIdChange?: (id: string | null) => void;
  size?: ExpandableSize;
  children?: ReactNode;
};

export type AccordionItemProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Явный id пункта; без него используется порядковый номер среди siblings. */
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
