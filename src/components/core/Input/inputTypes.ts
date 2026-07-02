import type {
  HTMLAttributes,
  InputHTMLAttributes,
  PointerEventHandler,
  ReactNode,
} from "react";

import type { ButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupTypes";
import type { ComponentSize } from "@/components/core/utils/componentSize";

export type InputVariant = "default" | "outline" | "gloss";
export type InputStatus = "default" | "danger" | "success" | "warning";
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

export type InputProps = Omit<
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
  isRequired: boolean;
  status: InputStatus;
  size: InputSize;
};

export type InputClassNamesProviderProps = {
  classNames?: InputClassNames;
  children: ReactNode;
};

export type InputRootProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  id?: string;
  isRequired?: boolean;
  status?: InputStatus;
  size?: InputSize;
  classNames?: InputClassNames;
};

export type InputSimpleProps = InputRootProps & InputProps;

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
  controlProps: InputProps;
};
