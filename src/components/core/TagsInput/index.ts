import { TagsInputRoot } from "./TagsInput";
import { TagsInputControl, TagsInputError, TagsInputHint, TagsInputLabel } from "./tagsInputParts";

export const TagsInput = Object.assign(TagsInputRoot, {
  Label: TagsInputLabel,
  Control: TagsInputControl,
  Hint: TagsInputHint,
  Error: TagsInputError,
});

export type {
  TagsInputClassNames,
  TagsInputControlProps,
  TagsInputErrorProps,
  TagsInputHintProps,
  TagsInputLabelProps,
  TagsInputMotion,
  TagsInputPartMotion,
  TagsInputProps,
} from "./tagsInputTypes";
