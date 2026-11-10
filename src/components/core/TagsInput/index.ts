import { TagsInputRoot } from "./TagsInput";
import {
  TagsInputShell,
  TagsInputError,
  TagsInputHint,
  TagsInputLabel,
  TagsInputRemove,
  TagsInputTag,
} from "./tagsInputParts";

export const TagsInput = Object.assign(TagsInputRoot, {
  Label: TagsInputLabel,
  Shell: TagsInputShell,
  Tag: TagsInputTag,
  Remove: TagsInputRemove,
  Hint: TagsInputHint,
  Error: TagsInputError,
});

export type {
  TagsInputClassNames,
  TagsInputShellProps,
  TagsInputErrorProps,
  TagsInputHintProps,
  TagsInputLabelProps,
  TagsInputMotion,
  TagsInputPartMotion,
  TagsInputProps,
  TagsInputSize,
  TagsInputVariant,
  TagsInputRemoveProps,
  TagsInputTagProps,
} from "./tagsInputTypes";
