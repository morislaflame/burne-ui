import { Loading } from "@/components/core/Loading";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

export function LoadingCardOverlayDemo() {
  return (
    <Surface
      variant="secondary"
      padding="large"
      className="relative w-full max-w-xs overflow-hidden"
    >
      <div className="flex flex-col gap-xsmall opacity-40">
        <Text as="p" variant="base" className="font-medium">
          Loading the dashboard
        </Text>
        <Text as="p" variant="small" className="text-muted">
          Metrics for the last 7 days
        </Text>
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-surface/60 backdrop-blur-[2px]">
        <Loading size="mid" color="primary" label="Loading metrics" />
      </div>
    </Surface>
  );
}
