import { Resizable } from "@/components/core/Resizable";

export function ResizableClassNamesFullDemo() {
  return (
    <Resizable className="min-h-control-large" classNames={{ root: "bg-background", panel: "p-mid", handle: "bg-secondary" }}>
      <Resizable.Panel defaultSize={40}>A</Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel>B</Resizable.Panel>
    </Resizable>
  );
}
