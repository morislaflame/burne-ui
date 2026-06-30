import type {
  HTMLAttributes,
  ReactNode,
  Ref,
  RefObject,
} from "react";

import type { ComponentSize } from "@/components/core/utils/componentSize";

export type DisclosureVariant =
  | "default"
  | "outline"
  | "secondary"
  | "card"
  | "ghost"
  | "gloss";

export type DisclosureSize = ComponentSize;
export type DisclosureIconPos = "left" | "right";

export type DisclosureClassNames = {
  root?: string;
  trigger?: string;
  triggerTitleLift?: string;
  triggerTitle?: string;
  triggerChevron?: string;
  contentShell?: string;
  contentWrap?: string;
  contentPanel?: string;
  glossPanel?: string;
  glossContent?: string;
  handle?: string;
  group?: string;
};

export type DisclosureGroupContextValue = {
  openValue: string | null;
  setOpenValue: (val: string | null) => void;
  variant: DisclosureVariant;
  size: DisclosureSize;
  separated: boolean;
  accordion: boolean;
};

export type DisclosureContextValue = {
  open: boolean;
  setOpen: (value: boolean) => void;
  triggerId: string;
  panelId: string;
  variant: DisclosureVariant;
  size: DisclosureSize;
  disabled: boolean;
  iconPos: DisclosureIconPos;
  dragHandle: boolean;
  shellRef: RefObject<HTMLDivElement | null>;
  innerRef: RefObject<HTMLDivElement | null>;
  chevronRef: RefObject<HTMLSpanElement | null>;
  skipContentAnimRef: RefObject<boolean>;
};

export type DisclosureClassNamesProviderProps = {
  classNames?: DisclosureClassNames;
  children: ReactNode;
};

export type DisclosureProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  value?: string;
  variant?: DisclosureVariant;
  size?: DisclosureSize;
  disabled?: boolean;
  iconPos?: DisclosureIconPos;
  dragHandle?: boolean;
  classNames?: DisclosureClassNames;
};

export type DisclosureGroupProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  accordion?: boolean;
  separated?: boolean;
  variant?: DisclosureVariant;
  size?: DisclosureSize;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  classNames?: DisclosureClassNames;
};

export type DisclosureTriggerProps = HTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  icon?: ReactNode | null;
  asChild?: boolean;
};

export type DisclosureHandleProps = HTMLAttributes<HTMLDivElement>;
export type DisclosureContentProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export type UseDisclosureRootStateProps = Omit<
  DisclosureProps,
  "className" | "classNames"
>;

export type UseDisclosureGroupRootStateProps = Omit<
  DisclosureGroupProps,
  "className" | "classNames"
>;

export type UseDisclosureTriggerMotionProps = {
  open: boolean;
  disabled: boolean;
  setOpen: (value: boolean) => void;
  chevronRef: RefObject<HTMLSpanElement | null>;
  skipContentAnimRef: RefObject<boolean>;
  forwardedRef: Ref<HTMLButtonElement>;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  onPointerEnter?: React.PointerEventHandler<HTMLButtonElement>;
  onPointerLeave?: React.PointerEventHandler<HTMLButtonElement>;
  onPointerDown?: React.PointerEventHandler<HTMLButtonElement>;
};
