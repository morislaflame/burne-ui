import { ComboBox } from "@/components/core/ComboBox";
import { type InputStatus, type InputVariant } from "@/components/core/Input";

const options = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

const COMBOBOX_VARIANTS: InputVariant[] = [
  "default",
  "outline",
  "secondary",
  "gloss",
];

const COMBOBOX_STATUSES: InputStatus[] = [
  "default",
  "danger",
  "success",
  "info",
  "warning",
];

export function ComboBoxStatusesDemo() {
  return (
    <div className="flex w-full flex-col gap-2xlarge">
      {COMBOBOX_STATUSES.map((status) => (
        <div key={status} className="flex flex-col gap-base">
          <span className="text-xsmall font-w-mid uppercase tracking-wide text-muted">
            status: {status}
          </span>
          <div className="flex flex-wrap items-start gap-base">
            {COMBOBOX_VARIANTS.map((variant) => (
              <ComboBox
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
