import { Text } from "@/components/core/Text";

export function TextSemanticsDemo() {
  return (
    <div className="flex flex-col gap-small">
      <Text as="h1" variant="header-1">
        Page title (as=&quot;h1&quot;)
      </Text>
      <Text as="h2" variant="header-2">
        Section subtitle (as=&quot;h2&quot;)
      </Text>
      <Text as="p" variant="base">
        Body paragraph (as=&quot;p&quot;)
      </Text>
      <Text as="span" variant="tools" className="text-muted">
        Label or signature (as=&quot;span&quot;)
      </Text>
    </div>
  );
}
