import { Label } from "@/components/core/Label";

import { TextAreaControl, TextAreaError, TextAreaHint, TextAreaRoot } from "./TextArea";

export const TextArea = Object.assign(TextAreaRoot, {
  Label,
  Control: TextAreaControl,
  Hint: TextAreaHint,
  Error: TextAreaError,
});

export type {
  TextAreaClassNames,
  TextAreaProps,
  TextAreaSize,
  TextAreaStatus,
  TextAreaVariant,
  TextAreaRootProps,
  TextAreaHintProps,
  TextAreaErrorProps,
  TextAreaSimpleProps,
} from "./textAreaTypes";

export { TextAreaControl, TextAreaError, TextAreaHint } from "./TextArea";

export {
  useTextAreaFieldContext,
  useOptionalTextAreaFieldContext,
  useTextAreaClassNames,
} from "./textAreaContext";
