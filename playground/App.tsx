import { useState } from "react";

import { Button } from "@/components/core/Button";
import { cn } from "@/utils/cn";

import { ComponentsShowcase } from "./ComponentsShowcase";
import { FresnelTorusDemo } from "./FresnelTorusDemo";
import { ThemePlayground } from "./ThemePlayground";

type PlaygroundPage = "components" | "theme" | "fresnel";

const NAV: { id: PlaygroundPage; label: string }[] = [
  { id: "components", label: "Компоненты" },
  { id: "theme", label: "Тема" },
  { id: "fresnel", label: "Fresnel 3D" },
];

export function App() {
  const [page, setPage] = useState<PlaygroundPage>("components");

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-base bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-mid px-mid py-small">
          <span className="text-sm font-medium">Burne UI Playground</span>
          <nav className="flex gap-xsmall" aria-label="Разделы playground">
            {NAV.map((item) => (
              <Button
                key={item.id}
                type="button"
                size="small"
                variant={page === item.id ? "default" : "ghost"}
                className={cn(page !== item.id && "text-muted")}
                onClick={() => setPage(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      </header>

      {page === "components" ? (
        <ComponentsShowcase />
      ) : page === "theme" ? (
        <ThemePlayground />
      ) : (
        <div className="relative min-h-[calc(100dvh-3rem)]">
          <div className="pointer-events-none absolute left-4 top-4 z-10 max-w-[min(90vw,28rem)] rounded-small border border-base/60 bg-surface/85 px-mid py-plus text-sm shadow-lg backdrop-blur-md">
            <p className="font-medium text-foreground">Simple Fresnel Shader</p>
            <p className="mt-1 text-muted">
              Как в{" "}
              <code className="rounded bg-background/80 px-1 py-0.5 text-xs">
                examples/fresnel.html
              </code>{" "}
              репозитория ogl. Тяни мышью по канвасу.
            </p>
          </div>
          <FresnelTorusDemo />
        </div>
      )}
    </div>
  );
}
