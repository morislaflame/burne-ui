import type { ReactNode } from "react";

import { Text } from "@/components/core/Text";

export function RtlPair({ children }: { children: () => ReactNode }) {
  return (
    <div className="flex w-full flex-wrap items-start justify-center gap-2xlarge">
      <section dir="ltr" className="flex w-80 max-w-full flex-col items-stretch gap-mid">
        <Text variant="small" className="text-muted">
          LTR
        </Text>
        {children()}
      </section>
      <section dir="rtl" className="flex w-80 max-w-full flex-col items-stretch gap-mid">
        <Text variant="small" className="text-muted">
          RTL
        </Text>
        {children()}
      </section>
    </div>
  );
}
