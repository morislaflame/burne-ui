import { Text } from "@/components/core/Text";

export function TextVariantsDemo() {
  return (
    <div className="flex flex-col gap-small">
      <Text as="p" variant="accent-header">
        accent-header
      </Text>
      <Text as="p" variant="header-1">
        header-1
      </Text>
      <Text as="p" variant="header-2">
        header-2
      </Text>
      <Text as="p" variant="large">
        text-large
      </Text>
      <Text as="p" variant="mid">
        text-mid
      </Text>
      <Text as="p" variant="base">
        text-base — main text
      </Text>
      <Text as="p" variant="small" className="text-muted">
        text-small muted
      </Text>
      <Text as="p" variant="xsmall" className="text-muted">
        text-xsmall
      </Text>
    </div>
  );
}
