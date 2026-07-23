import { Text } from "@/components/core/Text";

export function TextEditorialArticleDemo() {
  return (
    <article className="flex w-full max-w-md flex-col gap-small">
      <div className="flex flex-wrap items-center gap-small">
        <Text
          as="span"
          variant="xsmall"
          className="rounded-full bg-danger/15 px-small py-xsmall font-medium text-danger"
        >
          Draft
        </Text>
        <Text as="span" variant="xsmall" className="text-muted">
          12 min reading
        </Text>
      </div>
      <Text as="h3" variant="header-2" className="leading-tight">
        How to assemble custom sections in playground
      </Text>
      <Text as="p" variant="small" className="border-l-2 border-primary pl-small text-muted">
        Lead-paragraph with an accent bar on the left - typography Text, registration className.
      </Text>
    </article>
  );
}
