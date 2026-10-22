import type { HTMLAttributes, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";
import type { MotionController, MotionMapWithEvents, MotionStateHostProps } from "@/components/core/utils/slotMotion";
 
import type { ExpandableVariant } from "@/components/core/Expandable";
import type {
  ExpandableContentProps,
  ExpandableDescriptionProps,
  ExpandableIconProps,
  ExpandableLifecycleMotion,
  ExpandableMessageProps,
  ExpandableSize,
  ExpandableTitleProps,
  ExpandableTriggerLiftMotion,
  ExpandableTriggerProps,
} from "@/components/core/Expandable";
 
/** Domain alias of `ExpandableSize` (`ComponentSize`). */
export type AccordionSize = ExpandableSize;

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
  contentWrap?: string;
  triggerRippleOverlay?: string;
  panel?: string;
  body?: string;
};

export type AccordionMotion = {
  triggerLift?: ExpandableTriggerLiftMotion;
  chevron?: ExpandableLifecycleMotion;
  panelShell?: ExpandableLifecycleMotion;
  title?: ExpandableLifecycleMotion;
  icon?: ExpandableLifecycleMotion;
  description?: ExpandableLifecycleMotion;
  /** Panel `<section>` (`Accordion.Panel` / `Expandable.Panel`). */
  panel?: ExpandableLifecycleMotion;
  /** `Accordion.Body` muted wrap — not the Panel `<section>`. */
  body?: ExpandableLifecycleMotion;
};
export type AccordionLifecycleMotion = ExpandableLifecycleMotion;
export type AccordionTriggerLiftMotion = ExpandableTriggerLiftMotion;

export type AccordionItemData = {
  value: string;
  title: ReactNode;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
};
 
export type AccordionProps = Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue"> & {
  /** `single` — one open item (`value`). `multiple` — `values`. Default `single`. */
  selectionMode?: "single" | "multiple";
  /** Controlled open item when `selectionMode` is `single` (`null` = all closed). */
  value?: string | null;
  /** Uncontrolled initial id. Items without `value` use their sibling index (`"0"`, `"1"`, …). */
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** Controlled open items when `selectionMode` is `multiple`. */
  values?: string[];
  defaultValues?: string[];
  onValuesChange?: (values: string[]) => void;
  variant?: ExpandableVariant;
  size?: ExpandableSize;
  classNames?: Prettify<AccordionClassNames>;
  /**
   * Per-slot motion forwarded to each Item's Expandable. `panel` is the Panel
   * `<section>`; `body` is `Accordion.Body`. Item `motion` overrides the same slots.
   * `Accordion.Heading` is not a slot. Group root has no motion (`root` lives on Expandable).
   * `events` — namespaced app commands; each Item is its own Expandable scope.
   */
  motion?: Prettify<MotionMapWithEvents<AccordionMotion>>;
  /** Data-driven items. Fills items that children do not already render. */
  items?: readonly AccordionItemData[];
  children?: ReactNode;
};
 
export type AccordionItemProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Explicit item id; if not provided, the index among siblings is used. */
  value?: string;
  disabled?: boolean;
  /** Locally overrides slots inherited from the root (merged like `Breadcrumbs.List`). */
  classNames?: Prettify<AccordionClassNames>;
  /** Overrides root `motion` for this item (merged like `classNames`). */
  motion?: Prettify<MotionMapWithEvents<AccordionMotion>>;
  /**
   * Handle for this Item's Expandable scope. Accordion has no group scope —
   * one handle → one Item. Not placed on the DOM.
   */
  motionController?: MotionController;
  children?: ReactNode;
} & MotionStateHostProps;
 
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
 
export type AccordionBodyProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<AccordionLifecycleMotion>;
};
 
export type AccordionContextValue = {
  selectionMode: "single" | "multiple";
  value: string | null;
  values: string[];
  setItemOpen: (id: string, open: boolean) => void;
  /** Stable auto-id for an Item without explicit `value` (call once per Item mount). */
  allocateAutoItemId: () => string;
  variant: ExpandableVariant;
  size: ExpandableSize;
  motion?: MotionMapWithEvents<AccordionMotion>;
};
 
export type AccordionClassNamesProviderProps = {
  classNames?: Prettify<AccordionClassNames>;
  children: ReactNode;
};
 
export type UseAccordionRootStateProps = AccordionProps;
 