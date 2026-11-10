import { Resizable } from "@/components/core/Resizable";

export function ResizableMotionFactoryDemo() {
  return (
    <Resizable motion={{ panel: { enter: (ctx) => ctx.fromTo({ y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }) } }}><Resizable.Panel>A</Resizable.Panel><Resizable.Handle /><Resizable.Panel>B</Resizable.Panel></Resizable>
  );
}
