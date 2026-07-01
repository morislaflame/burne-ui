import {
  RadioContent,
  RadioControl,
  RadioError,
  RadioHint,
  RadioIndicator,
  RadioLabel,
  RadioRoot,
} from "./Radio";
import { SelectionIndicator } from "@/components/core/SelectionIndicator";

const RadioIndicatorCompound = Object.assign(RadioIndicator, {
  Fill: SelectionIndicator.Fill,
  Mark: SelectionIndicator.Mark,
});

export const Radio = Object.assign(RadioRoot, {
  Control: RadioControl,
  Indicator: RadioIndicatorCompound,
  Content: RadioContent,
  Label: RadioLabel,
  Hint: RadioHint,
  Error: RadioError,
});

export type {
  RadioProps,
  RadioRootProps,
  RadioControlProps,
  RadioIndicatorProps,
  RadioContentProps,
  RadioLabelProps,
  RadioHintProps,
  RadioErrorProps,
  RadioSize,
  RadioVariant,
  RadioClassNames,
} from "./radioTypes";
