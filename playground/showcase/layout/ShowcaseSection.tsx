import type { ReactNode } from "react";

import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

export function ShowcaseSection({
  title,
  description,
  children,
  className,
  id,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("flex flex-col gap-large scroll-mt-24", className)}>
      <div>
        <Text as="h2" variant="header-2">
          {title}
        </Text>
        {description ? (
          <Text as="p" variant="small" className="mt-xsmall text-muted">
            {description}
          </Text>
        ) : null}
      </div>
      {children}
    </section>
  );
}
