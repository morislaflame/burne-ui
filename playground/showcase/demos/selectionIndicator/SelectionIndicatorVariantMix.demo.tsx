import { SelectionIndicator } from "@/components/core/SelectionIndicator";
import { Text } from "@/components/core/Text";

const VARIANTS = ["default", "secondary", "outline", "gloss"] as const;

export function SelectionIndicatorVariantMixDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-large">
      <Text as="p" variant="small" className="font-medium">
        Options (on / off)
      </Text>
      <div className="grid grid-cols-2 gap-large sm:grid-cols-4">
        {VARIANTS.map((variant) => (
          <div key={variant} className="flex flex-col items-center gap-small">
            <div className="flex items-center gap-small">
              <SelectionIndicator size="base" variant={variant} selected={false} check />
              <SelectionIndicator size="base" variant={variant} selected check />
            </div>
            <Text as="span" variant="xsmall" className="text-muted">
              {variant}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}
