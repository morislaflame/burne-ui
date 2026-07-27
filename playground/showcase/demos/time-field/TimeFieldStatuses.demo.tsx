import { IoTimeOutline } from "react-icons/io5";

import {
  TimeField,
  type TimeFieldStatus,
  type TimeFieldVariant,
} from "@/components/core/TimeField";

const prefix = <IoTimeOutline className="icon-base shrink-0" aria-hidden />;

const TIMEFIELD_VARIANTS: TimeFieldVariant[] = [
  "default",
  "outline",
  "secondary",
  "segmented",
  "gloss",
];

const TIMEFIELD_STATUSES: TimeFieldStatus[] = [
  "default",
  "danger",
  "success",
  "info",
  "warning",
];

export function TimeFieldStatusesDemo() {
  return (
    <div className="flex w-full flex-col gap-2xlarge">
      {TIMEFIELD_STATUSES.map((status) => (
        <div key={status} className="flex flex-col gap-base">
          <span className="text-xsmall font-w-mid uppercase tracking-wide text-muted">
            status: {status}
          </span>
          <div className="flex flex-wrap items-start gap-base">
            {TIMEFIELD_VARIANTS.map((variant) => (
              <TimeField
                key={`${status}-${variant}`}
                label={variant}
                variant={variant}
                status={status}
                defaultValue="09:30"
                prefix={prefix}
                className="min-w-[11rem] flex-1 capitalize"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
