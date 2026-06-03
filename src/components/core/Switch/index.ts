import {
  SwitchControl,
  SwitchFill,
  SwitchIcon,
  SwitchThumb,
  SwitchTrack,
  type SwitchControlProps,
  type SwitchFillProps,
  type SwitchIconProps,
  type SwitchIconWhen,
  type SwitchLabelPosition,
  type SwitchSize,
  type SwitchThumbProps,
  type SwitchTrackProps,
} from "./Switch";
import {
  SwitchContent,
  SwitchError,
  SwitchHint,
  SwitchLabel,
  SwitchRoot,
  type SwitchContentProps,
  type SwitchErrorProps,
  type SwitchHintProps,
  type SwitchLabelProps,
} from "./SwitchField";

export const Switch = Object.assign(SwitchRoot, {
  Control: SwitchControl,
  Track: SwitchTrack,
  Fill: SwitchFill,
  Thumb: SwitchThumb,
  Icon: SwitchIcon,
  Content: SwitchContent,
  Label: SwitchLabel,
  Hint: SwitchHint,
  Error: SwitchError,
});

export type {
  SwitchControlProps,
  SwitchTrackProps,
  SwitchFillProps,
  SwitchThumbProps,
  SwitchIconProps,
  SwitchIconWhen,
  SwitchSize,
  SwitchLabelPosition,
  SwitchContentProps,
  SwitchLabelProps,
  SwitchHintProps,
  SwitchErrorProps,
};
export type { SwitchRootProps, SwitchSimpleProps } from "./SwitchField";
