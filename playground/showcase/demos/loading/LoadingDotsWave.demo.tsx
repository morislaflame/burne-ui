import { Loading } from "@/components/core/Loading";
import { Text } from "@/components/core/Text";

const DOTS = [
  { label: "primary", color: "primary" },
  { label: "success", status: "success" as const },
  { label: "info", status: "info" as const },
  { label: "warning", status: "warning" as const },
  { label: "danger", status: "danger" as const },
];

export function LoadingDotsWaveDemo() {
  return (
    <div className="flex flex-col gap-xlarge">
      <div className="flex flex-wrap items-end justify-center gap-2xlarge">
        {(["small", "base", "mid", "large"] as const).map((size) => (
          <div key={size} className="flex flex-col items-center gap-small">
            <Loading indicator="dots" size={size} color="primary" />
            <Text as="span" textStyle="small" className="capitalize text-muted">
              {size}
            </Text>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-end justify-center gap-2xlarge">
        {DOTS.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-small">
            <Loading indicator="dots" size="mid" color={"color" in item ? item.color : undefined} status={"status" in item ? item.status : undefined} />
            <Text as="span" textStyle="small" className="capitalize text-muted">
              {item.label}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}
