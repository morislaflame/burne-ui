import { AspectRatio } from "@/components/core/AspectRatio";

export function AspectRatioClassNamesFullDemo() {
  return (
    <AspectRatio ratio="16/9" classNames={{ root: "bg-surface", content: "flex items-center justify-center" }}>
      16/9
    </AspectRatio>
  );
}
