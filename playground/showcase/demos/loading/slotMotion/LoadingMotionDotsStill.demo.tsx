import { Loading } from "@/components/core/Loading";

export function LoadingMotionDotsStillDemo() {
  return <Loading type="dots" label="Still dots" motion={{ dot: { enter: false } }} />;
}
