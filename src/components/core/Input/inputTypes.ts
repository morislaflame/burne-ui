import type {
  HTMLAttributes,
  InputHTMLAttributes,
  PointerEventHandler,
  ReactNode,
} from "react";

import type { ButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupTypes";
import type { ComponentSize } from "@/components/core/utils/componentSize";
import type { SemanticStatus } from "@/components/core/utils/semanticStatusIcons";

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
  classNames?: InputClassNames;
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
  classNames?: InputClassNames;
  children: ReactNode;
};

export type InputProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  id?: string;
  required?: boolean;
  status?: InputStatus;
  size?: InputSize;
  classNames?: InputClassNames;
};

export type InputSimpleProps = InputProps & InputControlProps;

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
