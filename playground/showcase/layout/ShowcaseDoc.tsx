import type { ReactNode } from "react";

import { Card } from "@/components/core/Card";
import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

function ShowcaseDocRoot({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Card variant="outline" className={cn("flex flex-col gap-mid", className)}>
      <Card.Header>
        <Card.Title>Документация</Card.Title>
        <Card.Description>Импорт, API и правила кастомизации.</Card.Description>
      </Card.Header>
      <Card.Body className="flex flex-col gap-mid pt-0">{children}</Card.Body>
    </Card>
  );
}

function ShowcaseDocBlock({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-xsmall", className)}>
      <Text as="h3" variant="small" className="font-semibold text-foreground">
        {title}
      </Text>
      <div className="text-sm text-muted [&_code]:rounded [&_code]:bg-surface-secondary [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_code]:text-primary">
        {children}
      </div>
    </div>
  );
}

function ShowcaseDocCode({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-small border-token bg-surface-secondary/60 p-small text-xs text-foreground">
      <code>{children}</code>
    </pre>
  );
}

function ShowcaseDocImport({ path }: { path: string }) {
  return <ShowcaseDocCode>{`import { … } from "${path}";`}</ShowcaseDocCode>;
}

function ShowcaseDocApiRow({
  api,
  description,
}: {
  api: "simple" | "compound";
  description: string;
}) {
  const label = api === "simple" ? "Simple API" : "Compound API";
  return (
    <div className="flex flex-col gap-xsmall sm:flex-row sm:items-start sm:gap-small">
      <Text
        as="span"
        variant="tools"
        className="inline-flex w-fit shrink-0 rounded-small bg-surface-secondary px-small py-0.5 font-medium text-foreground"
      >
        {label}
      </Text>
      <Text as="p" variant="small" className="text-muted">
        {description}
      </Text>
    </div>
  );
}

export const ShowcaseDoc = Object.assign(ShowcaseDocRoot, {
  Block: ShowcaseDocBlock,
  Code: ShowcaseDocCode,
  Import: ShowcaseDocImport,
  ApiRow: ShowcaseDocApiRow,
});
