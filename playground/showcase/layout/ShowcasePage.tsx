import type { ReactNode } from "react";

import { Badge } from "@/components/core/Badge";
import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

export function ShowcasePage({
  title,
  description,
  importPath,
  tags,
  children,
  className,
}: {
  title: string;
  description?: string;
  importPath?: string;
  tags?: string[];
  children: ReactNode;
  className?: string;
}) {
  return (
    <article className={cn("flex flex-col gap-2xlarge", className)}>
      <header className="flex flex-col gap-small">
        <div className="flex flex-wrap items-center gap-small">
          <Text as="h1" variant="header-1">
            {title}
          </Text>
          {tags?.map((tag) => (
            <Badge key={tag} variant="secondary" size="small">
              {tag}
            </Badge>
          ))}
        </div>
        {description ? (
          <Text as="p" variant="base" className="text-muted max-w-2xl">
            {description}
          </Text>
        ) : null}
        {importPath ? (
          <Text as="p" variant="small" className="font-mono text-primary">
            {importPath}
          </Text>
        ) : null}
      </header>
      {children}
    </article>
  );
}
