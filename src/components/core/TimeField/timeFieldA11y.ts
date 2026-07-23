import type { TimeFieldSegId, TimeFieldStatus } from "./timeFieldTypes";

import { DEFAULT_BURNE_LABELS, type BurneLabels } from "@/theme/burneLabels";

export function timeFieldShellAria({
  labelConnected,
  labelId,
  timeLabel = DEFAULT_BURNE_LABELS.time,
}: {
  labelConnected: boolean;
  labelId: string;
  timeLabel?: string;
}) {
  return {
    "aria-label": labelConnected ? undefined : timeLabel,
    "aria-labelledby": labelConnected ? labelId : undefined,
  } as const;
}

export function timeFieldSegLabel(
  seg: TimeFieldSegId,
  labels: Pick<BurneLabels, "timeHours" | "timeMinutes" | "timeSeconds"> = DEFAULT_BURNE_LABELS,
): string {
  switch (seg) {
    case "h":
      return labels.timeHours;
    case "m":
      return labels.timeMinutes;
    case "s":
      return labels.timeSeconds;
  }
}

export function timeFieldSegSpinbuttonA11y({
  seg,
  value,
  required,
  isDanger,
  isFirstSegment,
  disabled,
  segLabel,
}: {
  seg: TimeFieldSegId;
  value: number;
  required: boolean;
  isDanger: boolean;
  isFirstSegment: boolean;
  disabled: boolean;
  segLabel: string;
}) {
  return {
    role: "spinbutton" as const,
    "aria-label": segLabel,
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
