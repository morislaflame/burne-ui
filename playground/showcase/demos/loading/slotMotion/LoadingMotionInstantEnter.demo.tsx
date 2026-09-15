import { Loading } from "@/components/core/Loading";

export function LoadingMotionInstantEnterDemo() {
  return <Loading type="dots" motion={{ root: { enter: false } }} />;
}
