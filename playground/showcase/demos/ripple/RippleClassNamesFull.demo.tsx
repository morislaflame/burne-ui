import { Ripple } from "@/components/core/Ripple";
import { Text } from "@/components/core/Text";

export function RippleClassNamesFullDemo() {
  return (
    <div
      className="relative max-w-xs cursor-pointer rounded-large border-token bg-surface"
      role="presentation"
    >
      <Ripple color="info" className="rounded-[inherit]" />
      <div className="relative z-[1] flex items-center px-large py-2xlarge">
        <Text variant="base">className paints the ripple layer</Text>
      </div>
    </div>
  );
}
