import { MeterTrack, type MeterTrackProps, type MeterSize, type MeterOrientation } from "./Meter";
import { Label } from "@/components/core/Label";
import { MeterError, MeterHeader, MeterHint, MeterRoot, MeterValue } from "./MeterField";

export const Meter = Object.assign(MeterRoot, {
  Header: MeterHeader,
  Label,
  Value: MeterValue,
  Hint: MeterHint,
  Error: MeterError,
  Track: MeterTrack,
});

export type { MeterTrackProps, MeterSize, MeterOrientation };
export type { MeterRootProps, MeterHeaderProps, MeterValueProps, MeterHintProps, MeterErrorProps } from "./MeterField";
