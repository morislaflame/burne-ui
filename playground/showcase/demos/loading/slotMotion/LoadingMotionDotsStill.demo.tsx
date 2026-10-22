import { Loading } from "@/components/core/Loading";

export function LoadingMotionDotsStillDemo() {
  return <Loading indicator="dots" aria-label="Still dots" motion={{ dot: { enter: false } }} />;
}
