import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Switch } from "@/components/core/Switch";
import { cn } from "@/utils/cn";

import { ComponentsCatalog } from "./showcase/ComponentsCatalog";
import { FresnelTorusDemo } from "./FresnelTorusDemo";
import { ThemePlayground } from "./ThemePlayground";
import { ThemeTokensProvider, useThemeTokens } from "./useThemeTokens";

type PlaygroundPage = "components" | "theme" | "fresnel";

const NAV: { id: PlaygroundPage; label: string }[] = [
  { id: "theme", label: "Тема" },
  { id: "components", label: "Компоненты" },
  { id: "fresnel", label: "Fresnel 3D" },
];

function AppHeader({
  page,
  onPageChange,
}: {
  page: PlaygroundPage;
  onPageChange: (page: PlaygroundPage) => void;
}) {
  const { state, setTheme } = useThemeTokens();

  return (
    <header className="sticky top-0 z-20 border-b-token bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-small sm:gap-mid px-small sm:px-mid py-small">
        <span className="text-sm font-medium max-sm:hidden">Burne UI Playground</span>
        <span className="text-sm font-medium sm:hidden">Burne UI</span>
        <div className="flex items-center gap-small sm:gap-plus">
          <Switch
            size="small"
            checked={state.theme === "light"}
            onChange={(e) => setTheme(e.target.checked ? "light" : "dark")}
            label={<span className="hidden sm:inline">Светлая тема</span>}
            className="shrink-0"
          />
          <nav className="flex gap-xsmall" aria-label="Разделы playground">
            {NAV.map((item) => (
              <Button
                key={item.id}
                type="button"
                size="small"
                variant={page === item.id ? "primary" : "ghost"}
                className={cn(page !== item.id && "text-muted", "max-sm:px-2")}
                onClick={() => onPageChange(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

function AppBody() {
  const [page, setPage] = useState<PlaygroundPage>("theme");

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <AppHeader page={page} onPageChange={setPage} />

      {page === "components" ? (
        <ComponentsCatalog />
      ) : page === "theme" ? (
        <ThemePlayground />
      ) : (
        <div className="relative min-h-[calc(100dvh-3rem)]">
          <div className="pointer-events-none absolute left-4 top-4 z-10 max-w-[min(90vw,28rem)] rounded-small border-token/60 bg-surface/85 px-mid py-plus text-sm shadow-lg backdrop-blur-md">
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

export function App() {
  return (
    <ThemeTokensProvider>
      <AppBody />
    </ThemeTokensProvider>
  );
}
