import { Resizable } from "@/components/core/Resizable";

export function ResizableSplitDemo() {
  return (
    <Resizable className="min-h-[12rem]">
      <Resizable.Panel defaultSize={30} className="p-mid">List</Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel className="p-mid">Detail</Resizable.Panel>
    </Resizable>
  );
}
