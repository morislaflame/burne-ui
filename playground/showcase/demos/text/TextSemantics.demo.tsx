import { Text } from "@/components/core/Text";

export function TextSemanticsDemo() {
  return (
    <div className="flex flex-col gap-small">
      <Text as="h1" variant="header-1">
        Заголовок страницы (as=&quot;h1&quot;)
      </Text>
      <Text as="h2" variant="header-2">
        Подзаголовок секции (as=&quot;h2&quot;)
      </Text>
      <Text as="p" variant="base">
        Абзац основного текста (as=&quot;p&quot;)
      </Text>
      <Text as="span" variant="tools" className="text-muted">
        Метка или подпись (as=&quot;span&quot;)
      </Text>
    </div>
  );
}
