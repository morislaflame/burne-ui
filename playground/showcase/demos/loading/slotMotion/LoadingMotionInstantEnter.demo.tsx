import { Loading } from "@/components/core/Loading";

export function LoadingMotionInstantEnterDemo() {
  return <Loading indicator="dots" motion={{ root: { enter: false } }} />;
}
