import { ProgressBarError, ProgressBarHeader, ProgressBarHint, ProgressBarLabel, ProgressBarRoot, ProgressBarTrack, ProgressBarValue } from "./ProgressBar";

export const ProgressBar = Object.assign(ProgressBarRoot, {
  Header: ProgressBarHeader,
  Label: ProgressBarLabel,
  Value: ProgressBarValue,
  Hint: ProgressBarHint,
  Error: ProgressBarError,
  Track: ProgressBarTrack,
});

export type {
  ProgressBarTrackProps,
  ProgressBarSize,
  ProgressBarOrientation,
  ProgressBarClassNames,
} from "./ProgressBar";

export type {
  ProgressBarProps,
  ProgressBarHeaderProps,
  ProgressBarValueProps,
  ProgressBarHintProps,
  ProgressBarErrorProps,
} from "./ProgressBar";

export {
  useProgressBarFieldContext,
  useOptionalProgressBarFieldContext,
} from "./ProgressBar";

export type {
  ProgressBarDisplayState,
  ProgressBarFieldContextValue,
} from "./progressBarTypes";
