import type { ReactNode } from "react";

import { Card } from "@/components/core/Card";
import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

function ShowcaseDocRoot({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Card variant="outline" className={cn("flex flex-col gap-mid", className)}>
      <Card.Header>
        <Card.Title>Documentation</Card.Title>
        <Card.Description>Import, API and customization rules.</Card.Description>
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
        variant="xsmall"
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
 * Standard customization block for showcase-documentation.
 * @param gloss — `true` → `variant="gloss"`; string - arbitrary prop (for example. `variant="gloss"`).
 */
function ShowcaseDocCustomization({
  gloss,
  motion = true,
  children,
}: {
  gloss?: boolean | string;
  /** Show hint about configureMotion(). Default true. */
  motion?: boolean;
  children?: ReactNode;
}) {
  const glossProp =
    gloss === true ? 'variant="gloss"' : typeof gloss === "string" ? gloss : null;

  return (
    <ShowcaseDocBlock title="Customization">
      <div className="flex flex-col gap-xsmall">
        <p>
          Additional styles - via <code>className</code> on root and slots.
          {glossProp ? (
            <>
              {" "}
              <code>{glossProp}</code> — glass surface; transparency and stroke are set
              CSS-theme variables (<code>--color-surface</code>, <code>--color-border</code>).
            </>
          ) : (
            <>
              {" "}
              Palette and Padding - Override CSS-topic variables after{" "}
              <code>burne-ui/styles.css</code> (<code>--color-*</code>, <code>--space-*</code>,{" "}
              <code>--radius</code>).
            </>
          )}
          {motion ? (
            <>
              {" "}
              Animation timings - via <code>configureMotion()</code> from the package (
              <code>interactiveDuration</code>, <code>enableHoverLift</code>, <code>enableRipple</code>{" "}
              etc..).
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
