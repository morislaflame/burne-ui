import { Loading } from "@/components/core/Loading";
import { Text } from "@/components/core/Text";
import type { SemanticStatus } from "@/components/core/utils/semanticStatusIcons";

const SWATCHES: Array<{ label: string; status?: SemanticStatus; color?: string }> = [
  { label: "Primary", color: "primary" },
  { label: "Success", status: "success" },
  { label: "Danger", status: "danger" },
  { label: "Warning", status: "warning" },
];

export function LoadingColorGridDemo() {
  return (
    <div className="grid w-full max-w-md grid-cols-2 gap-small sm:grid-cols-4">
      {SWATCHES.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center gap-small rounded-large border-token bg-tertiary p-large"
        >
          <Loading size="base" color={item.color} status={item.status} aria-label={item.label} />
          <Text as="span" textStyle="xsmall" className="text-muted">
            {item.label}
          </Text>
        </div>
      ))}
    </div>
  );
}
