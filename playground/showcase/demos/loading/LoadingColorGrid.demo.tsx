import { Loading } from "@/components/core/Loading";
import { Text } from "@/components/core/Text";

const SWATCHES: Array<{ label: string; color: "primary" | "success" | "danger" | "warning" }> = [
  { label: "Primary", color: "primary" },
  { label: "Success", color: "success" },
  { label: "Danger", color: "danger" },
  { label: "Warning", color: "warning" },
];

export function LoadingColorGridDemo() {
  return (
    <div className="grid w-full max-w-md grid-cols-2 gap-small sm:grid-cols-4">
      {SWATCHES.map((item) => (
        <div
          key={item.color}
          className="flex flex-col items-center gap-small rounded-mid border-token bg-tertiary p-large"
        >
          <Loading size="base" color={item.color} label={item.label} />
          <Text as="span" variant="xsmall" className="text-muted">
            {item.label}
          </Text>
        </div>
      ))}
    </div>
  );
}
