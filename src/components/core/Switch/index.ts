import {
  SwitchContent,
  SwitchControl,
  SwitchError,
  SwitchFill,
  SwitchHint,
  SwitchIcon,
  SwitchLabel,
  SwitchRoot,
  SwitchThumb,
  SwitchTrack,
} from "./Switch";

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
  SwitchRootProps,
  SwitchSimpleProps,
  SwitchClassNames,
} from "./switchTypes";
