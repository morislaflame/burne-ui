import { Resizable } from "@/components/core/Resizable";

export function ResizableMotionVarsDemo() {
  return (
    <Resizable motion={{ root: { enter: { y: -8, opacity: 0, duration: 0.35 } } }}><Resizable.Panel>A</Resizable.Panel><Resizable.Handle /><Resizable.Panel>B</Resizable.Panel></Resizable>
  );
}
