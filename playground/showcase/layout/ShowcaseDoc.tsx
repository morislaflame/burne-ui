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

/**
 * Стандартный блок кастомизации для showcase-документации.
 * @param gloss — `true` → `variant="gloss"`; строка — произвольный проп (напр. `surface="gloss"`).
 */
function ShowcaseDocCustomization({
  gloss,
  motion = true,
  children,
}: {
  gloss?: boolean | string;
  /** Показывать подсказку про configureMotion(). По умолчанию true. */
  motion?: boolean;
  children?: ReactNode;
}) {
  const glossProp =
    gloss === true ? 'variant="gloss"' : typeof gloss === "string" ? gloss : null;

  return (
    <ShowcaseDocBlock title="Кастомизация">
      <div className="flex flex-col gap-xsmall">
        <p>
          Дополнительные стили — через <code>className</code> на корне и слотах.
          {glossProp ? (
            <>
              {" "}
              <code>{glossProp}</code> — стеклянная поверхность; прозрачность и обводка задаются
              CSS-переменными темы (<code>--color-surface</code>, <code>--color-border</code>).
            </>
          ) : (
            <>
              {" "}
              Палитра и отступы — переопределение CSS-переменных темы после{" "}
              <code>burne-ui/styles.css</code> (<code>--color-*</code>, <code>--space-*</code>,{" "}
              <code>--radius</code>).
            </>
          )}
          {motion ? (
            <>
              {" "}
              Тайминги анимаций — через <code>configureMotion()</code> из пакета (
              <code>interactiveDuration</code>, <code>enableHoverLift</code>, <code>enableRipple</code>{" "}
              и др.).
            </>
          ) : null}
        </p>
        {children}
      </div>
    </ShowcaseDocBlock>
  );
}

export const ShowcaseDoc = Object.assign(ShowcaseDocRoot, {
  Block: ShowcaseDocBlock,
  Code: ShowcaseDocCode,
  Import: ShowcaseDocImport,
  ApiRow: ShowcaseDocApiRow,
  Customization: ShowcaseDocCustomization,
});
