import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  Ref,
} from "react";

import type { ComponentSize } from "@/components/core/utils/componentSize";

export type ExpandableSize = ComponentSize;
export type ExpandableVariant = "default" | "gloss";

export type ExpandableClassNames = {
  root?: string;
  glossContent?: string;
  trigger?: string;
  triggerLift?: string;
  triggerRippleOverlay?: string;
  message?: string;
  icon?: string;
  content?: string;
  title?: string;
  description?: string;
  chevron?: string;
  panelShell?: string;
  panel?: string;
};

export type ExpandableRootProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  children?: ReactNode;
  variant?: ExpandableVariant;
  compound?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  size?: ExpandableSize;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  classNames?: ExpandableClassNames;
};

export type ExpandableProps = ExpandableRootProps;

export type ExpandableContextValue = {
  open: boolean;
  disabled: boolean;
  hasPanel: boolean;
  size: ExpandableSize;
  variant: ExpandableVariant;
  toggle: () => void;
  headerId: string;
  panelId: string;
  setHasPanel: (value: boolean) => void;
};

export type ExpandableClassNamesProviderProps = {
  classNames?: ExpandableClassNames;
  children: ReactNode;
};

export type ExpandableTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  hideChevron?: boolean;
  asChild?: boolean;
};

export type ExpandableIconProps = HTMLAttributes<HTMLSpanElement>;
export type ExpandableMessageProps = HTMLAttributes<HTMLDivElement>;
export type ExpandableContentProps = HTMLAttributes<HTMLDivElement>;
export type ExpandableTitleProps = HTMLAttributes<HTMLDivElement>;
export type ExpandableDescriptionProps = HTMLAttributes<HTMLDivElement>;
export type ExpandableChevronProps = HTMLAttributes<HTMLSpanElement>;
export type ExpandablePanelProps = HTMLAttributes<HTMLDivElement>;

export type ExpandableSimpleBodyProps = {
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  panelChildren?: ReactNode;
};

export type UseExpandableRootStateProps = Pick<
  ExpandableRootProps,
  | "children"
  | "compound"
  | "defaultOpen"
  | "open"
  | "onOpenChange"
  | "disabled"
  | "size"
  | "variant"
>;

export type UseExpandableTriggerMotionProps = {
  open: boolean;
  disabled: boolean;
  toggle: () => void;
  forwardedRef: Ref<HTMLButtonElement>;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  onKeyDown?: ButtonHTMLAttributes<HTMLButtonElement>["onKeyDown"];
  onPointerDown?: ButtonHTMLAttributes<HTMLButtonElement>["onPointerDown"];
};
