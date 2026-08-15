import { DrawerMotionBounceSlideDemo } from "./DrawerMotionBounceSlide.demo";
import { DrawerMotionDefaultDemo } from "./DrawerMotionDefault.demo";
import { DrawerMotionInstantPanelDemo } from "./DrawerMotionInstantPanel.demo";
import { DrawerMotionTitleStaggerDemo } from "./DrawerMotionTitleStagger.demo";

export function DrawerMotionDemo() {
  return (
    <div className="flex w-full flex-wrap items-center gap-mid">
      <DrawerMotionDefaultDemo />
      <DrawerMotionInstantPanelDemo />
      <DrawerMotionTitleStaggerDemo />
      <DrawerMotionBounceSlideDemo />
    </div>
  );
}
