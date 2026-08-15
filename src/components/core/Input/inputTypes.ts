import type {
  HTMLAttributes,
  InputHTMLAttributes,
  MutableRefObject,
  PointerEvent,
  PointerEventHandler,
  ReactNode,
  RefObject,
} from "react";
import type { Prettify } from "@/utils/prettify";

import type { ButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupTypes";
import type { ComponentSize } from "@/components/core/utils/sizeLayout";
import type { SemanticStatus } from "@/components/core/utils/semanticStatusIcons";
import type { MotionValue } from "@/components/core/utils/slotMotion";

export type InputVariant = "default" | "outline" | "secondary" | "gloss";
export type InputStatus = SemanticStatus;
export type InputSize = ComponentSize;

export type InputClassNames = {
  root?: string;
  label?: string;
  shell?: string;
  control?: string;
  prefix?: string;
  suffix?: string;
  passwordToggle?: string;
  fileArea?: string;
  fileEmpty?: string;
  fileRow?: string;
  fileGlyph?: string;
  filePreview?: string;
  fileRemove?: string;
  hint?: string;
  error?: string;
};

export type InputPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};

export type InputMotion = {
  shell?: InputPartMotion;
  control?: InputPartMotion;
  prefix?: InputPartMotion;
  suffix?: InputPartMotion;
  passwordToggle?: InputPartMotion;
  fileRow?: Pick<InputPartMotion, "leave" | "hoverIn" | "hoverOut">;
  fileRemove?: InputPartMotion;
};

export type InputControlProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type" | "prefix" | "onPointerDown"
> & {
  variant?: InputVariant;
  size?: InputSize;
  groupSegment?: ButtonGroupSegment;
  status?: InputStatus;
  inputType?: "text" | "number" | "password" | "file";
  prefix?: ReactNode;
  suffix?: ReactNode;
  onPointerDown?: PointerEventHandler<HTMLDivElement>;
  classNames?: Prettify<InputClassNames>;
  /** Shell part motion. Root `motion.shell` still applies; this wins on the Control host. */
  motion?: Prettify<InputPartMotion>;
};

export type InputFieldContextValue = {
  inputId: string;
  hintId: string;
  errorId: string;
  labelId: string;
  hintConnected: boolean;
  errorConnected: boolean;
  required: boolean;
  status: InputStatus;
  size: InputSize;
};

export type InputClassNamesProviderProps = {
  classNames?: Prettify<InputClassNames>;
  children: ReactNode;
};

export type InputProps = Omit<HTMLAttributes<HTMLDivElement>, "prefix"> & {
  children?: ReactNode;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  id?: string;
  required?: boolean;
  status?: InputStatus;
  size?: InputSize;
  classNames?: Prettify<InputClassNames>;
  /**
   * Per-slot motion (`shell`, `control`, `prefix`, `suffix`, `passwordToggle`, `fileRow`, `fileRemove`).
   * File remove leave: `fileRow.leave` (`fileRowExit`).
   */
  motion?: Prettify<InputMotion>;
};

export type InputSimpleProps = InputProps & Omit<InputControlProps, "motion">;

export type UseInputShellAnimationsProps = {
  shellRef: RefObject<HTMLDivElement | null>;
  blocked: boolean;
  variant: InputVariant;
  groupSegment: unknown;
  motion?: InputPartMotion;
  pointerInsideRef: MutableRefObject<boolean>;
  onPointerDown?: (e: PointerEvent<HTMLDivElement>) => void;
};

export type InputHintProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  status?: Exclude<InputStatus, "danger"> | "default";
};

export type InputErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
};

export type UseInputRootStateProps = InputSimpleProps;

export type PickedFileEntry = { file: File; previewUrl: string | null };

export type InputSimpleBodyProps = {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  inputId: string;
  labelId: string;
  size: InputSize;
  status: InputStatus;
  controlProps: InputControlProps;
};
