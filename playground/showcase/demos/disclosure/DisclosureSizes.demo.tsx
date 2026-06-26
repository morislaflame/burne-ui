import { Disclosure } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";

const SIZES = ["small", "base", "mid", "large"] as const;

export function DisclosureSizesDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-small">
      {SIZES.map((size) => (
        <Disclosure key={size} size={size}>
          <Disclosure.Trigger>Size {size}</Disclosure.Trigger>
          <Disclosure.Content>
            <Text as="p" variant="small" className="text-muted">
              Disclosure size={size}
            </Text>
          </Disclosure.Content>
        </Disclosure>
      ))}
    </div>
  );
}
