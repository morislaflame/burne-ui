import { useEffect, useState } from "react";
import { IoColorPaletteOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Drawer } from "@/components/core/Drawer";

import { ComponentsCatalog } from "./showcase/ComponentsCatalog";
import { ThemeControls } from "./ThemeControls";
import type { ThemeTokensApi } from "./useThemeTokens";
import { useThemeTokens } from "./useThemeTokens";

/** Renders heavy controls after the drawer open animation has started. */
function DeferredThemeControls({ open, tokens }: { open: boolean; tokens: ThemeTokensApi }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!open) {
      setReady(false);
      return;
    }

    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) setReady(true);
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [open]);

  if (!ready) return null;
  return <ThemeControls tokens={tokens} />;
}

export function ThemePlayground() {
  const tokens = useThemeTokens();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="relative flex h-[calc(100dvh-3rem)] overflow-hidden">
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
        <ComponentsCatalog embedded />
      </main>

      <aside className="hidden md:flex h-full w-96 shrink-0 flex-col overflow-hidden border-l-token bg-surface">
        <div className="min-h-0 flex-1 overflow-y-auto p-mid">
          <ThemeControls tokens={tokens} />
        </div>
      </aside>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} placement="bottom">
        <div className="fixed bottom-6 right-6 z-30 md:hidden">
          <Drawer.Trigger asChild>
            <Button
              className="flex h-12 w-12 items-center justify-center rounded-full p-0 shadow-token-large bg-primary text-primary-foreground hover:bg-primary-hover"
              aria-label="Theme settings"
            >
              <IoColorPaletteOutline className="size-6" />
            </Button>
          </Drawer.Trigger>
        </div>

        <Drawer.Panel extent="default">
          <Drawer.Header>
            <Drawer.HeadingBlock>
              <Drawer.Title>Theme settings</Drawer.Title>
              <Drawer.Description>Set up theme tokens for Burne UI.</Drawer.Description>
            </Drawer.HeadingBlock>
            <Drawer.Close />
          </Drawer.Header>
          <Drawer.Body className="p-mid">
            <DeferredThemeControls open={drawerOpen} tokens={tokens} />
          </Drawer.Body>
        </Drawer.Panel>
      </Drawer>
    </div>
  );
}
