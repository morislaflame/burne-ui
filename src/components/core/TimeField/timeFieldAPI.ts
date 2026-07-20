import { useCallback, useState } from "react";

import type { TimeFieldFormat, TimeFieldHMS, TimeFieldSegId } from "./timeFieldTypes";

export const TIME_FIELD_SEG_MAX: Record<TimeFieldSegId, number> = { h: 23, m: 59, s: 59 };

export function parseTime(str: string): TimeFieldHMS {
  const parts = str.split(":").map(Number);
  return {
    h: Number.isFinite(parts[0]) ? Math.max(0, Math.min(23, parts[0]!)) : 0,
    m: Number.isFinite(parts[1]) ? Math.max(0, Math.min(59, parts[1]!)) : 0,
    s: Number.isFinite(parts[2]) ? Math.max(0, Math.min(59, parts[2]!)) : 0,
  };
}

export function formatTime(hms: TimeFieldHMS, fmt: TimeFieldFormat): string {
  const h = String(hms.h).padStart(2, "0");
  const m = String(hms.m).padStart(2, "0");
  const s = String(hms.s).padStart(2, "0");
  return fmt === "HH:mm:ss" ? `${h}:${m}:${s}` : `${h}:${m}`;
}

export function segValue(hms: TimeFieldHMS, seg: TimeFieldSegId): number {
  return hms[seg];
}

export function withSeg(hms: TimeFieldHMS, seg: TimeFieldSegId, val: number): TimeFieldHMS {
  const clamped = Math.max(0, Math.min(TIME_FIELD_SEG_MAX[seg], val));
  return { ...hms, [seg]: clamped };
}

export function useMergedTimeValue(
  value: string | undefined,
  defaultValue: string,
  format: TimeFieldFormat,
  onValueChange?: (value: string) => void,
): [TimeFieldHMS, (next: TimeFieldHMS) => void, boolean] {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<TimeFieldHMS>(() =>
    parseTime(value ?? defaultValue),
  );
  const hms = isControlled ? parseTime(value!) : internal;
  const setHms = useCallback(
    (next: TimeFieldHMS) => {
      if (!isControlled) setInternal(next);
      onValueChange?.(formatTime(next, format));
    },
    [format, isControlled, onValueChange],
  );
  return [hms, setHms, isControlled];
}

export function segmentsForFormat(format: TimeFieldFormat): TimeFieldSegId[] {
  return format === "HH:mm:ss" ? ["h", "m", "s"] : ["h", "m"];
}
