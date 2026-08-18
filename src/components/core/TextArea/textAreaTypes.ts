import type {
  HTMLAttributes,
  MutableRefObject,
  PointerEvent,
  PointerEventHandler,
  ReactNode,
  RefObject,
  TextareaHTMLAttributes,
} from "react";
import type { Prettify } from "@/utils/prettify";

import type { ComponentSize } from "@/components/core/utils/sizeLayout";
import type { LabelProps } from "@/components/core/Label";
import type { SemanticStatus } from "@/components/core/utils/semanticStatusIcons";
import type { MotionValue } from "@/components/core/utils/slotMotion";

export type TextAreaVariant = "default" | "outline" | "secondary" | "gloss";

export type TextAreaStatus = SemanticStatus;

export type TextAreaSize = ComponentSize;

export type TextAreaClassNames = {
  root?: string;
  label?: string;
  shell?: string;
  control?: string;
  resizeHandle?: string;
  hint?: string;
  error?: string;
};

export type TextAreaPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};

export type TextAreaMotion = {
  shell?: TextAreaPartMotion;
  control?: TextAreaPartMotion;
  resizeHandle?: TextAreaPartMotion;
  label?: TextAreaPartMotion;
  hint?: TextAreaPartMotion;
  error?: TextAreaPartMotion;
};

export type TextAreaControlProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size"
> & {
  variant?: TextAreaVariant;
  size?: TextAreaSize;
  status?: TextAreaStatus;
  rows?: number;
  resizable?: boolean;
  onPointerDown?: PointerEventHandler<HTMLDivElement>;
  /** Shell part motion. Root `motion.shell` still applies; this wins on the Control host. */
  motion?: Prettify<TextAreaPartMotion>;
};

export type TextAreaFieldContextValue = {
  textareaId: string;
  hintId: string;
  errorId: string;
  labelId: string;
  hintConnected: boolean;
  errorConnected: boolean;
  required: boolean;
  status: TextAreaStatus;
  size: TextAreaSize;
};

export type TextAreaClassNamesProviderProps = {
  classNames?: Prettify<TextAreaClassNames>;
  children: ReactNode;
};

export type TextAreaProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  id?: string;
  required?: boolean;
  status?: TextAreaStatus;
  size?: TextAreaSize;
  classNames?: Prettify<TextAreaClassNames>;
  /**
   * Per-slot motion (`shell`, `control`, `resizeHandle`, `label`, `hint`, `error`).
   * Resize drag height is kit-internal, not a public MotionVars layout tween.
   */
  motion?: Prettify<TextAreaMotion>;
};

export type TextAreaSimpleProps = TextAreaProps & Omit<TextAreaControlProps, "motion">;

export type UseTextAreaShellAnimationsProps = {
  shellRef: RefObject<HTMLDivElement | null>;
  blocked: boolean;
  variant: TextAreaVariant;
  resizable: boolean;
  motion?: TextAreaPartMotion;
  pointerInsideRef: MutableRefObject<boolean>;
  onPointerDown?: (e: PointerEvent<HTMLDivElement>) => void;
};

export type TextAreaLabelProps = Omit<LabelProps, "motion"> & {
  motion?: Prettify<TextAreaPartMotion>;
};

export type TextAreaHintProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  status?: Exclude<TextAreaStatus, "danger"> | "default";
  motion?: Prettify<TextAreaPartMotion>;
};

export type TextAreaErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  motion?: Prettify<TextAreaPartMotion>;
};

export type UseTextAreaRootStateProps = TextAreaSimpleProps;

export type TextAreaSimpleBodyProps = {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  textareaId: string;
  labelId: string;
  size: TextAreaSize;
  status: TextAreaStatus;
  controlProps: TextAreaControlProps;
};
