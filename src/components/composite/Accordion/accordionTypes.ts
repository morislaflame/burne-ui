import type { HTMLAttributes, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";

import type {
  ExpandableContentProps,
  ExpandableDescriptionProps,
  ExpandableIconProps,
  ExpandableLifecycleMotion,
  ExpandableMessageProps,
  ExpandableMotion,
  ExpandableSize,
  ExpandableTitleProps,
  ExpandableTriggerLiftMotion,
  ExpandableTriggerProps,
} from "@/components/core/Expandable";

export type AccordionClassNames = {
  root?: string;
  item?: string;
  heading?: string;
  trigger?: string;
  triggerLift?: string;
  message?: string;
  icon?: string;
  content?: string;
  title?: string;
  description?: string;
  chevron?: string;
  panelShell?: string;
  panel?: string;
  glossContent?: string;
};

export type AccordionMotion = ExpandableMotion;
export type AccordionLifecycleMotion = ExpandableLifecycleMotion;
export type AccordionTriggerLiftMotion = ExpandableTriggerLiftMotion;

export type AccordionProps = Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue"> & {
  /** Controlled: id of the open item (`null` = all closed). */
  value?: string | null;
  /** Uncontrolled initial id (takes priority over `defaultOpenIndex`). */
  defaultValue?: string | null;
  /** Initial open item by index (0-based), if `defaultValue` is not provided. */
  defaultOpenIndex?: number | null;
  onValueChange?: (value: string | null) => void;
  size?: ExpandableSize;
  classNames?: Prettify<AccordionClassNames>;
  /**
   * Per-slot motion forwarded to each Item's Expandable.
   * Item `motion` overrides the same slots.
   */
  motion?: Prettify<AccordionMotion>;
  children?: ReactNode;
};

export type AccordionItemProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Explicit item id; if not provided, the index among siblings is used. */
  value?: string;
  disabled?: boolean;
  /** Locally overrides slots inherited from the root (merged like `Breadcrumbs.List`). */
  classNames?: Prettify<AccordionClassNames>;
  /** Overrides root `motion` for this item (merged like `classNames`). */
  motion?: Prettify<AccordionMotion>;
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
  motion?: Prettify<AccordionLifecycleMotion>;
};

export type AccordionPanelProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<AccordionLifecycleMotion>;
};

export type AccordionBodyProps = HTMLAttributes<HTMLDivElement>;

export type AccordionContextValue = {
  value: string | null;
  setValue: (value: string | null) => void;
  /** Stable auto-id for an Item without explicit `value` (call once per Item mount). */
  allocateAutoItemId: () => string;
  size: ExpandableSize;
  motion?: AccordionMotion;
};

export type AccordionClassNamesProviderProps = {
  classNames?: Prettify<AccordionClassNames>;
  children: ReactNode;
};

export type UseAccordionRootStateProps = AccordionProps;
