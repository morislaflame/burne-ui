import { AvatarMotionGroupRotateDemo } from "./AvatarMotionGroupRotate.demo";
import { AvatarMotionImageScaleDemo } from "./AvatarMotionImageScale.demo";
import { AvatarMotionInstantFadeDemo } from "./AvatarMotionInstantFade.demo";
import { AvatarMotionInstantGroupDemo } from "./AvatarMotionInstantGroup.demo";

export function AvatarMotionDemo() {
  return (
    <div className="flex w-full flex-wrap items-center gap-large">
      <AvatarMotionInstantFadeDemo />
      <AvatarMotionImageScaleDemo />
      <AvatarMotionInstantGroupDemo />
      <AvatarMotionGroupRotateDemo />
    </div>
  );
}
