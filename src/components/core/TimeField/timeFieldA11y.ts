import type { TimeFieldSegId, TimeFieldStatus } from "./timeFieldTypes";

export const TIME_FIELD_FALLBACK_ARIA_LABEL = "Time";

export const TIME_FIELD_SEG_LABEL: Record<TimeFieldSegId, string> = {
  h: "hours",
  m: "minutes",
  s: "seconds",
};

export function timeFieldShellAria({
  labelConnected,
  labelId,
}: {
  labelConnected: boolean;
  labelId: string;
}) {
  return {
    "aria-label": labelConnected ? undefined : TIME_FIELD_FALLBACK_ARIA_LABEL,
    "aria-labelledby": labelConnected ? labelId : undefined,
  } as const;
}

export function timeFieldSegSpinbuttonA11y({
  seg,
  value,
  required,
  isDanger,
  isFirstSegment,
  disabled,
}: {
  seg: TimeFieldSegId;
  value: number;
  required: boolean;
  isDanger: boolean;
  isFirstSegment: boolean;
  disabled: boolean;
}) {
  return {
    role: "spinbutton" as const,
    "aria-label": TIME_FIELD_SEG_LABEL[seg],
    "aria-valuemin": 0,
    "aria-valuemax": seg === "h" ? 23 : 59,
    "aria-valuenow": value,
    "aria-valuetext": String(value).padStart(2, "0"),
    "aria-required": isFirstSegment && required ? true : undefined,
    "aria-invalid": isFirstSegment && isDanger ? true : undefined,
    tabIndex: disabled ? -1 : 0,
  };
}

export function timeFieldHintStatus(status: TimeFieldStatus) {
  return status === "danger" || status === "default" ? "default" : status;
}
