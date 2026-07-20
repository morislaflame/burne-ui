import type { ReactNode } from "react";

/** Story wrapper: two API variants in one story, component JSX stays in `.stories.tsx`. */
export function DualApiStoryPanels({ children }: { children: ReactNode }) {
  return <div className="flex w-full max-w-md flex-col gap-xlarge">{children}</div>;
}

export function DualApiStoryPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-mid">
      <p className="text-small font-medium text-muted">{title}</p>
      {children}
    </div>
  );
}

