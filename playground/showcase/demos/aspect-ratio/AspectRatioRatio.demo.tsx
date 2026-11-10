import { AspectRatio } from "@/components/core/AspectRatio";

export function AspectRatioRatioDemo() {
  return (
    <div className="flex w-full flex-col gap-mid">
      <AspectRatio ratio={1} classNames={{ root: "bg-surface", content: "flex items-center justify-center" }}>1</AspectRatio>
      <AspectRatio ratio="16/9" classNames={{ root: "bg-secondary", content: "flex items-center justify-center" }}>16/9</AspectRatio>
    </div>
  );
}
