import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";
import type { Prettify } from "@/utils/prettify";

import type { MessageBannerGridSlots } from "@/components/core/utils/messageBannerGridLayout";
import type { MessageBannerSize, MessageBannerSizePreset } from "@/components/core/utils/sizeLayout";
import type { MotionValue } from "@/components/core/utils/slotMotion";

export type ToastSize = MessageBannerSize;

export type ToastStatus = "default" | "success" | "danger" | "info" | "warning";

export type ToastVariant = "default" | "gloss";

export type ToastPlacement =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type ToastLifecycleMotion = {
  enter?: MotionValue;
  leave?: MotionValue;
};

export type ToastPartMotion = ToastLifecycleMotion & {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
};

export type ToastMotion = {
  root?: ToastLifecycleMotion;
  indicator?: ToastLifecycleMotion;
  title?: ToastPartMotion;
  description?: ToastPartMotion;
  action?: ToastLifecycleMotion;
  close?: ToastLifecycleMotion;
};

export type ToastClassNames = {
  root?: string;
  indicator?: string;
  message?: string;
  content?: string;
  title?: string;
  description?: string;
  action?: string;
  close?: string;
  viewport?: string;
  scrim?: string;
  stack?: string;
};

export type ToastLiveRole = "status" | "alert";

export type AddToastOpts = {
  status?: ToastStatus;
  variant?: ToastVariant;
  size?: ToastSize;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  timeout?: number;
  placement?: ToastPlacement;
  id?: string;
  loading?: boolean;
  classNames?: Prettify<ToastClassNames>;
  motion?: Prettify<ToastMotion>;
};

export type PromiseToastOpts<T> = {
  loading?: ReactNode;
  success: ReactNode | ((value: T) => ReactNode);
  error?: ReactNode | ((err: unknown) => ReactNode);
  placement?: ToastPlacement;
  timeout?: number;
  classNames?: Prettify<ToastClassNames>;
  motion?: Prettify<ToastMotion>;
};

export type ToastEntry = {
  id: string;
  status: ToastStatus;
  variant: ToastVariant;
  size: ToastSize;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  timeout: number;
  placement: ToastPlacement;
  createdAt: number;
  loading: boolean;
  classNames?: Prettify<ToastClassNames>;
  motion?: Prettify<ToastMotion>;
};

export type ToastLiveAnnouncement = {
  text: string;
  assertive: boolean;
  /** Bumps on each announce so identical messages still fire. */
  nonce: number;
};

export type ToastContextValue = {
  add: (opts: AddToastOpts) => string;
  update: (
    id: string,
    patch: Partial<Omit<ToastEntry, "id" | "createdAt">>,
  ) => void;
  dismiss: (id: string) => void;
};

export type ToastItemContextValue = {
  status: ToastStatus;
  size: ToastSize;
  sizePreset: MessageBannerSizePreset;
  titleId: string;
  descriptionId: string;
  loading: boolean;
  dismiss: () => void;
  gridSlots: MessageBannerGridSlots;
};

export type ToastClassNamesProviderProps = {
  classNames?: Prettify<ToastClassNames>;
  children: ReactNode;
};

export type ToastProviderProps = {
  children: ReactNode;
  defaultPlacement?: ToastPlacement;
  defaultVariant?: ToastVariant;
  defaultSize?: ToastSize;
  /** DOM node for viewport portals. Default: `document.body`. */
  portalContainer?: HTMLElement | null;
  classNames?: Prettify<ToastClassNames>;
  motion?: Prettify<ToastMotion>;
};

export type ToastProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  status?: ToastStatus;
  variant?: ToastVariant;
  size?: ToastSize;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  loading?: boolean;
  onClose?: () => void;
  classNames?: Prettify<ToastClassNames>;
  motion?: Prettify<ToastMotion>;
};

export type UseToastRootStateProps = Pick<
  ToastProps,
  "status" | "size" | "title" | "description" | "action" | "loading" | "onClose" | "children"
>;

export type ToastIndicatorProps = HTMLAttributes<HTMLSpanElement> & {
  motion?: Prettify<ToastLifecycleMotion>;
};
export type ToastMessageProps = HTMLAttributes<HTMLDivElement>;
export type ToastContentProps = HTMLAttributes<HTMLDivElement>;
export type ToastTitleProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<ToastPartMotion>;
};
export type ToastDescriptionProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<ToastPartMotion>;
};
export type ToastActionProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<ToastLifecycleMotion>;
};
export type ToastCloseProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  "aria-label"?: string;
  motion?: Prettify<ToastLifecycleMotion>;
};

export type ToastSimpleBodyProps = {
  gridSlots: MessageBannerGridSlots;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  onClose?: () => void;
};

export type ToastItemWrapperProps = {
  entry: ToastEntry;
  reverseIdx: number;
  total: number;
  isTop: boolean;
  isDismissing: boolean;
  onDismiss: (id: string) => void;
  onRemoveFinal: (id: string) => void;
  onHeightChange: (id: string, h: number) => void;
  providerClassNames?: ToastClassNames;
  providerMotion?: ToastMotion;
};

export type ToastViewportProps = {
  placement: ToastPlacement;
  sorted: ToastEntry[];
  dismissingIds: Set<string>;
  onDismiss: (id: string) => void;
  onRemoveFinal: (id: string) => void;
  classNames?: Prettify<ToastClassNames>;
  motion?: Prettify<ToastMotion>;
  defaultSize?: ToastSize;
};
