import { ProgressBar } from "@/components/core/ProgressBar";

export function ProgressBarSizesDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-mid">
      <ProgressBar size="small" label="Small" value={62} className="w-full" />
      <ProgressBar size="base" label="Base" value={62} className="w-full" />
      <ProgressBar size="mid" label="Mid" value={62} className="w-full" />
      <ProgressBar size="large" label="Large" value={62} className="w-full" />
    </div>
  );
}
