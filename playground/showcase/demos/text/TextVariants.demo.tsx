import { Text } from "@/components/core/Text";

export function TextVariantsDemo() {
  return (
    <div className="flex flex-col gap-small">
      <Text as="p" textStyle="accent-header">
        accent-header
      </Text>
      <Text as="p" textStyle="header-1">
        header-1
      </Text>
      <Text as="p" textStyle="header-2">
        header-2
      </Text>
      <Text as="p" textStyle="large">
        text-large
      </Text>
      <Text as="p" textStyle="mid">
        text-mid
      </Text>
      <Text as="p" textStyle="base">
        text-base — main text
      </Text>
      <Text as="p" textStyle="small" className="text-muted">
        text-small muted
      </Text>
      <Text as="p" textStyle="xsmall" className="text-muted">
        text-xsmall
      </Text>
    </div>
  );
}
