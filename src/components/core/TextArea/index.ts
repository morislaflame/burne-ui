import { TextAreaControl, type TextAreaProps, type TextAreaSize, type TextAreaStatus, type TextAreaVariant } from "./TextArea";
import { Label } from "@/components/core/Label";
import { TextAreaError, TextAreaHint, TextAreaRoot } from "./TextAreaField";

export const TextArea = Object.assign(TextAreaRoot, {
  Label,
  Control: TextAreaControl,
  Hint: TextAreaHint,
  Error: TextAreaError,
});

export type { TextAreaProps, TextAreaSize, TextAreaStatus, TextAreaVariant };

export type {
  TextAreaRootProps,
  TextAreaHintProps,
  TextAreaErrorProps,
  TextAreaSimpleProps,
} from "./TextAreaField";
