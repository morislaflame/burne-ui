import { ProgressBar } from "@/components/core/ProgressBar";
import { Text } from "@/components/core/Text";

const STEPS = [
  { label: "Design", value: 100, color: "var(--color-success)" },
  { label: "Development", value: 72, color: "var(--color-primary)" },
  { label: "Testing", value: 34, color: "var(--color-warning)" },
] as const;

export function ProgressPipelineDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-large">
      {STEPS.map((step) => (
        <div key={step.label} className="flex flex-col gap-xsmall">
          <div className="flex items-center justify-between">
            <Text as="span" variant="small" className="font-medium">
              {step.label}
            </Text>
            <Text as="span" variant="xsmall" className="tabular-nums text-muted">
              {step.value}%
            </Text>
          </div>
          <ProgressBar
            value={step.value}
            color={step.color}
            className="w-full"
          />
        </div>
      ))}
    </div>
  );
}
