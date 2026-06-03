import {
  RadioContent,
  RadioControl,
  RadioError,
  RadioHint,
  RadioIndicator,
  RadioLabel,
  RadioRoot,
  type RadioContentProps,
  type RadioControlProps,
  type RadioErrorProps,
  type RadioHintProps,
  type RadioIndicatorProps,
  type RadioLabelProps,
  type RadioProps,
  type RadioRootProps,
  type RadioSize,
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
};
