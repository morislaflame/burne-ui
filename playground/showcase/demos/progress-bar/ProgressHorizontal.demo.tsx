import { ProgressBar } from "@/components/core/ProgressBar";

export function ProgressHorizontalDemo() {
  return (
    <div className="flex flex-col gap-mid">
      <ProgressBar label="Loading" value={62} className="w-120" />
      <ProgressBar label="Indeterminate" indeterminate className="w-120" />
      <ProgressBar label="Success" value={100} color="var(--color-success)" className="w-120" />
    </div>
  );
}
