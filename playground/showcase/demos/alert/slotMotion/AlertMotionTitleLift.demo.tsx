import { Alert } from "@/components/core/Alert";

export function AlertMotionTitleLiftDemo() {
  return (
    <Alert
      status="info"
      title="Simple map"
      description="Hover the banner — the title lifts."
      motion={{
        title: {
          hoverIn: { y: -2, duration: 0.2 },
          hoverOut: { y: 0 },
        },
      }}
    />
  );
}
