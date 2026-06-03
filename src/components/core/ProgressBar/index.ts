import {
  ProgressBarTrack,
  type ProgressBarTrackProps,
  type ProgressBarSize,
  type ProgressBarOrientation,
} from "./ProgressBar";
import { Label } from "@/components/core/Label";
import {
  ProgressBarError,
  ProgressBarHeader,
  ProgressBarHint,
  ProgressBarRoot,
  ProgressBarValue,
} from "./ProgressBarField";

export const ProgressBar = Object.assign(ProgressBarRoot, {
  Header: ProgressBarHeader,
  Label,
  Value: ProgressBarValue,
  Hint: ProgressBarHint,
  Error: ProgressBarError,
  Track: ProgressBarTrack,
});

export type { ProgressBarTrackProps, ProgressBarSize, ProgressBarOrientation };
export type {
  ProgressBarRootProps,
  ProgressBarHeaderProps,
  ProgressBarValueProps,
  ProgressBarHintProps,
  ProgressBarErrorProps,
} from "./ProgressBarField";
