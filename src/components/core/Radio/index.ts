import {
  RadioContent,
  RadioControl,
  RadioError,
  RadioHint,
  RadioIndicator,
  RadioLabel,
  RadioRoot,
} from "./Radio";

export const Radio = Object.assign(RadioRoot, {
  Control: RadioControl,
  Indicator: RadioIndicator,
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
