import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";
import type { Prettify } from "@/utils/prettify";
 
import type { MessageBannerGridSlots } from "@/components/core/utils/messageBannerGridLayout";
import type { SemanticStatus } from "@/components/core/utils/semanticStatusIcons";
import type { MessageBannerSize, MessageBannerSizePreset } from "@/components/core/utils/sizeLayout";
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";
 
export type ToastSize = MessageBannerSize;
 
export type ToastStatus = SemanticStatus;
 
export const KIT_TOAST_VARIANTS = ["default"] as const;
export type KitToastVariant = (typeof KIT_TOAST_VARIANTS)[number];
export type ToastVariant = KitToastVariant | (string & {});
 
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

export type ToastStackItemMotion = {
  /** New kit toast: opacity only. */
  enter?: MotionValue;
  /** Peek y / scale when the stack index changes. */
  change?: MotionValue;
};

export type ToastScrimMotion = {
  enter?: MotionValue;
  leave?: MotionValue;
};

export type ToastMotion = {
  root?: ToastPartMotion;
  indicator?: ToastLifecycleMotion;
  title?: ToastPartMotion;
  description?: ToastPartMotion;
  action?: ToastLifecycleMotion;
  close?: ToastLifecycleMotion;
  stackItem?: ToastStackItemMotion;
  scrim?: ToastScrimMotion;
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
  stackItem?: string;
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
  motion?: Prettify<MotionMapWithEvents<ToastMotion>>;
  /**
   * Handle for this toast item scope (`root`, chrome). Stack host is `ToastItemWrapper`.
   * `play()` targets `root`. Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
export type PromiseToastOpts<T> = {
  loading?: ReactNode;
  success: ReactNode | ((value: T) => ReactNode);
  error?: ReactNode | ((err: unknown) => ReactNode);
  placement?: ToastPlacement;
  timeout?: number;
  classNames?: Prettify<ToastClassNames>;
  motion?: Prettify<MotionMapWithEvents<ToastMotion>>;
  motionController?: MotionController;
} & MotionStateHostProps;
 
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
  motion?: Prettify<MotionMapWithEvents<ToastMotion>>;
  motionController?: MotionController;
} & MotionStateHostProps;
 
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
  motion?: Prettify<MotionMapWithEvents<ToastMotion>>;
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
  /**
   * Per-slot motion (`root`, `indicator`, `title`, `description`, `action`, `close`).
   * Standalone `<Toast>` mounts its own scope. Stack items inherit from `Toast.Provider` / `add()`.
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   */
  motion?: Prettify<MotionMapWithEvents<ToastMotion>>;
  /**
   * Handle for the standalone card scope. Stack: pass `motionController` on `toast.show()` instead.
   * `play()` targets `root`. Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
export type UseToastRootStateProps = Pick<
  ToastProps,
  "status" | "size" | "title" | "description" | "action" | "loading" | "onClose" | "children"
>;
 
export type ToastIndicatorProps = HTMLAttributes<HTMLSpanElement> & {
  motion?: Prettify<ToastLifecycleMotion>;
};
/** `display: contents` — padding, border, background and width do not paint. Not a motion target. */
export type ToastMessageProps = HTMLAttributes<HTMLDivElement>;
/** `display: contents` — padding, border, background and width do not paint. Not a motion target. */
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
  providerMotion?: Prettify<MotionMapWithEvents<ToastMotion>>;
};
 
export type ToastViewportProps = {
  placement: ToastPlacement;
  sorted: ToastEntry[];
  dismissingIds: Set<string>;
  onDismiss: (id: string) => void;
  onRemoveFinal: (id: string) => void;
  classNames?: Prettify<ToastClassNames>;
  motion?: Prettify<MotionMapWithEvents<ToastMotion>>;
  defaultSize?: ToastSize;
};
 