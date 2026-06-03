import {
  SelectorControl,
  type SelectorControlProps,
  type SelectorOption,
} from "./Selector";
import { Label } from "@/components/core/Label";
import { SelectorError, SelectorHint, SelectorRoot } from "./SelectorField";

export const Selector = Object.assign(SelectorRoot, {
  Label,
  Control: SelectorControl,
  Hint: SelectorHint,
  Error: SelectorError,
});

export type { SelectorControlProps, SelectorOption };
export type { SelectorRootProps, SelectorHintProps, SelectorErrorProps, SelectorSimpleProps } from "./SelectorField";
