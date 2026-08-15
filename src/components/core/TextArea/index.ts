import { TextAreaControl, TextAreaError, TextAreaHint, TextAreaLabel, TextAreaRoot } from "./TextArea";

export const TextArea = Object.assign(TextAreaRoot, {
  Label: TextAreaLabel,
  Control: TextAreaControl,
  Hint: TextAreaHint,
  Error: TextAreaError,
});

export type {
  TextAreaClassNames,
  TextAreaControlProps,
  TextAreaSize,
  TextAreaStatus,
  TextAreaVariant,
  TextAreaProps,
  TextAreaHintProps,
  TextAreaErrorProps,
  TextAreaSimpleProps,
  TextAreaMotion,
  TextAreaPartMotion,
} from "./textAreaTypes";

export {
  useTextAreaFieldContext,
  useOptionalTextAreaFieldContext,
  useTextAreaClassNames,
} from "./textAreaContext";
