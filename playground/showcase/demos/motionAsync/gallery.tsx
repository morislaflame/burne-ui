import { ShowcaseDemoGallery } from "../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../layout/ShowcaseDemoGallery";

import { MotionAsyncInterruptDemo } from "./Interrupt.demo";
import interruptSource from "./Interrupt.demo.tsx?raw";
import { MotionAsyncPluginsDemo } from "./Plugins.demo";
import pluginsSource from "./Plugins.demo.tsx?raw";
import { MotionAsyncSequenceDemo } from "./Sequence.demo";
import sequenceSource from "./Sequence.demo.tsx?raw";
import { MotionAsyncWaitDemo } from "./Wait.demo";
import waitSource from "./Wait.demo.tsx?raw";

export const motionAsyncGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "wait", title: "ctx.wait", Demo: MotionAsyncWaitDemo, source: waitSource },
  { id: "sequence", title: "sequence / parallel", Demo: MotionAsyncSequenceDemo, source: sequenceSource },
  { id: "interrupt", title: "onInterrupt / onError", Demo: MotionAsyncInterruptDemo, source: interruptSource },
  { id: "plugins", title: "registerMotionPlugins", Demo: MotionAsyncPluginsDemo, source: pluginsSource },
];

export function MotionAsyncGalleryDemo() {
  return <ShowcaseDemoGallery aria-label="MotionAsync demos" items={motionAsyncGallery} />;
}
