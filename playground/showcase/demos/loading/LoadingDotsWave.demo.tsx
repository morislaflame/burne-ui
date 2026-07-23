import { Loading } from "@/components/core/Loading";
import { Text } from "@/components/core/Text";

const DOTS_COLORS = ["primary", "success", "info", "warning", "danger"] as const;

export function LoadingDotsWaveDemo() {
  return (
    <div className="flex flex-col gap-xlarge">
      <div className="flex flex-wrap items-end justify-center gap-2xlarge">
        {(["small", "base", "mid", "large"] as const).map((size) => (
          <div key={size} className="flex flex-col items-center gap-small">
            <Loading type="dots" size={size} color="primary" />
            <Text as="span" variant="small" className="capitalize text-muted">
              {size}
            </Text>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-end justify-center gap-2xlarge">
        {DOTS_COLORS.map((color) => (
          <div key={color} className="flex flex-col items-center gap-small">
            <Loading type="dots" size="mid" color={color} />
            <Text as="span" variant="small" className="capitalize text-muted">
              {color}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}
