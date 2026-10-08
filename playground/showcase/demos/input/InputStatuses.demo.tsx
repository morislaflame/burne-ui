import {
  Input,
  type InputStatus,
  type InputVariant,
} from "@/components/core/Input";

const INPUT_VARIANTS: InputVariant[] = ["default", "outline", "secondary"];

const INPUT_STATUSES: InputStatus[] = [
  "default",
  "danger",
  "success",
  "info",
  "warning",
];

export function InputStatusesDemo() {
  return (
    <div className="flex flex-col gap-2xlarge">
      {INPUT_STATUSES.map((status) => (
        <div key={status} className="flex flex-col gap-base">
          <span className="text-xsmall font-w-mid uppercase tracking-wide text-muted">
            status: {status}
          </span>
          <div className="flex flex-wrap items-start gap-base">
            {INPUT_VARIANTS.map((variant) => (
              <Input
                key={`${status}-${variant}`}
                label={variant}
                variant={variant}
                status={status}
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
