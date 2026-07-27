import { type InputStatus, type InputVariant } from "@/components/core/Input";
import { Select } from "@/components/core/Select";

const options = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

const SELECT_VARIANTS: InputVariant[] = ["default", "outline", "secondary", "gloss"];

const SELECT_STATUSES: InputStatus[] = [
  "default",
  "danger",
  "success",
  "info",
  "warning",
];

export function SelectStatusesDemo() {
  return (
    <div className="flex w-full flex-col gap-2xlarge">
      {SELECT_STATUSES.map((status) => (
        <div key={status} className="flex flex-col gap-base">
          <span className="text-xsmall font-w-mid uppercase tracking-wide text-muted">
            status: {status}
          </span>
          <div className="flex flex-wrap items-start gap-base">
            {SELECT_VARIANTS.map((variant) => (
              <Select
                key={`${status}-${variant}`}
                label={variant}
                variant={variant}
                status={status}
                options={options}
                defaultValue="react"
                className="min-w-[11rem] flex-1 capitalize"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
