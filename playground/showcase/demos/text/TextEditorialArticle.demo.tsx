import { Text } from "@/components/core/Text";

export function TextEditorialArticleDemo() {
  return (
    <article className="flex w-full max-w-md flex-col gap-small">
      <div className="flex flex-wrap items-center gap-small">
        <Text
          as="span"
          variant="tools"
          className="rounded-full bg-danger/15 px-small py-xsmall font-medium text-danger"
        >
          Черновик
        </Text>
        <Text as="span" variant="tools" className="text-muted">
          12 мин чтения
        </Text>
      </div>
      <Text as="h3" variant="header-2" className="leading-tight">
        Как собирать кастомные секции в playground
      </Text>
      <Text as="p" variant="small" className="border-l-2 border-primary pl-small text-muted">
        Lead-параграф с акцентной полосой слева — типографика Text, оформление className.
      </Text>
    </article>
  );
}
