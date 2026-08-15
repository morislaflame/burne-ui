import { ToastMotionBounceDemo } from "./ToastMotionBounce.demo";
import { ToastMotionInstantLeaveDemo } from "./ToastMotionInstantLeave.demo";
import { ToastMotionTitleStaggerDemo } from "./ToastMotionTitleStagger.demo";

export function ToastMotionDemo() {
  return (
    <div className="flex w-full flex-wrap items-center gap-mid">
      <ToastMotionInstantLeaveDemo />
      <ToastMotionBounceDemo />
      <ToastMotionTitleStaggerDemo />
    </div>
  );
}
