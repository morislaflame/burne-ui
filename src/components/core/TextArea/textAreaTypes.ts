import type {
  HTMLAttributes,
  PointerEventHandler,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import type { Prettify } from "@/utils/prettify";

import type { ComponentSize } from "@/components/core/utils/sizeLayout";
import type { SemanticStatus } from "@/components/core/utils/semanticStatusIcons";

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
};

export type TextAreaSimpleProps = TextAreaProps & TextAreaControlProps;

export type TextAreaHintProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  status?: Exclude<TextAreaStatus, "danger"> | "default";
};

export type TextAreaErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
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
