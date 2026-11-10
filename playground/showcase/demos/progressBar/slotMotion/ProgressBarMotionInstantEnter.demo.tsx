import { ProgressBar } from "@/components/core/ProgressBar";

export function ProgressBarMotionInstantEnterDemo() {
  return <ProgressBar label="Upload" value={40} showValue motion={{ track: { enter: false } }} />;
}
