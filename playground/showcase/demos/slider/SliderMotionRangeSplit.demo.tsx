import gsap from "gsap";

import { Slider } from "@/components/core/Slider";

const TL = { overwrite: "auto" as const, force3D: false };

export function SliderMotionRangeSplitDemo() {
  return (
    <Slider range defaultValue={[22, 74]} className="w-full max-w-sm">
      <Slider.Header>
        <Slider.Label>Range split</Slider.Label>
        <Slider.Value />
      </Slider.Header>
      <Slider.Track range defaultValue={[22, 74]}>
        <Slider.Rail>
          <Slider.Fill />
        </Slider.Rail>
        <Slider.Thumb
          thumb="start"
          motion={{
            pressIn: (ctx) =>
              gsap.to(ctx.el, {
                rotate: -22,
                duration: 0.12,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut",
                ...TL,
              }),
          }}
        />
        <Slider.Thumb
          thumb="end"
          motion={{
            pressIn: (ctx) =>
              gsap.to(ctx.el, {
                scale: 1.28,
                duration: 0.12,
                yoyo: true,
                repeat: 1,
                ease: "back.out(2)",
                ...TL,
              }),
          }}
        />
      </Slider.Track>
      <Slider.Hint>Compound Thumb motion — start rotates, end scales</Slider.Hint>
    </Slider>
  );
}
