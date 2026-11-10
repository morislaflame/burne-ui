import { Resizable as ResizableRoot, ResizableHandle, ResizablePanel } from "./Resizable";

export const Resizable = Object.assign(ResizableRoot, {
  Panel: ResizablePanel,
  Handle: ResizableHandle,
});

export type {
  ResizableClassNames,
  ResizableHandleProps,
  ResizableMotion,
  ResizableOrientation,
  ResizablePanelProps,
  ResizablePartMotion,
  ResizableProps,
} from "./Resizable";
