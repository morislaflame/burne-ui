import {
  TextArea,
  type TextAreaStatus,
  type TextAreaVariant,
} from "@/components/core/TextArea";

const TEXTAREA_VARIANTS: TextAreaVariant[] = [
  "default",
  "outline",
  "secondary",
  "gloss",
];

const TEXTAREA_STATUSES: TextAreaStatus[] = [
  "default",
  "danger",
  "success",
  "info",
  "warning",
];

export function TextAreaStatusesDemo() {
  return (
    <div className="flex w-full flex-col gap-2xlarge">
      {TEXTAREA_STATUSES.map((status) => (
        <div key={status} className="flex flex-col gap-base">
          <span className="text-xsmall font-w-mid uppercase tracking-wide text-muted">
            status: {status}
          </span>
          <div className="flex flex-wrap items-start gap-base">
            {TEXTAREA_VARIANTS.map((variant) => (
              <TextArea
                key={`${status}-${variant}`}
                label={variant}
                variant={variant}
                status={status}
                rows={2}
                defaultValue={variant}
                className="min-w-[11rem] flex-1 capitalize"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
