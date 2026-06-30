import { Label } from "@/components/core/Label";

import { MeterRoot, MeterTrack } from "./Meter";
import {
  MeterError,
  MeterHeader,
  MeterHint,
  MeterValue,
} from "./meterParts";

export const Meter = Object.assign(MeterRoot, {
  Header: MeterHeader,
  Label,
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
  MeterRootProps,
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
