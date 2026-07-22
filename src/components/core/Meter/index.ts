import { MeterRoot, MeterTrack } from "./Meter";
import { MeterError, MeterHeader, MeterHint, MeterLabel, MeterValue } from "./meterParts";

export const Meter = Object.assign(MeterRoot, {
  Header: MeterHeader,
  Label: MeterLabel,
  Value: MeterValue,
  Hint: MeterHint,
  Error: MeterError,
  Track: MeterTrack,
});

export type {
  MeterTrackProps,
  MeterSize,
  MeterOrientation,
  MeterClassNames,
} from "./Meter";

export type {
  MeterProps,
  MeterHeaderProps,
  MeterValueProps,
  MeterHintProps,
  MeterErrorProps,
} from "./Meter";

export {
  useMeterFieldContext,
  useOptionalMeterFieldContext,
} from "./Meter";

export type { MeterDisplayState, MeterFieldContextValue } from "./meterTypes";
