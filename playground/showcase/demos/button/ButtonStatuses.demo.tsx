import { Button, type ButtonStatus, type ButtonVariant } from "@/components/core/Button";

const BUTTON_VARIANTS: ButtonVariant[] = [
  "default",
  "primary",
  "outline",
  "secondary",
  "ghost",
  "gloss",
];

const BUTTON_STATUSES: ButtonStatus[] = [
  "default",
  "danger",
  "success",
  "info",
  "warning",
];

export function ButtonStatusesDemo() {
  return (
    <div className="flex w-full flex-col gap-2xlarge">
      {BUTTON_STATUSES.map((status) => (
        <div key={status} className="flex flex-col gap-base">
          <span className="text-xsmall font-w-mid uppercase tracking-wide text-muted">
            status: {status}
          </span>
          <div className="flex flex-wrap items-center gap-base">
            {BUTTON_VARIANTS.map((variant) => (
              <Button
                key={`${status}-${variant}`}
                variant={variant}
                status={status}
                className="min-w-[7.5rem] capitalize"
              >
                {variant}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
