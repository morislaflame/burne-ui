import { Ripple } from "@/components/core/Ripple";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

export function RippleSurfaceOutDemo() {
  return (
    <Surface variant="tertiary" padding="large" className="relative w-full max-w-xs overflow-hidden">
      <Ripple color="primarySolid" direction="out" duration={520} />
      <Text as="p" variant="base" className="relative z-[1] font-medium">
        Ripple direction=&quot;out&quot;
      </Text>
      <Text as="p" variant="small" className="relative z-[1] text-muted">
        Slow wave on Surface-panels.
      </Text>
    </Surface>
  );
}
