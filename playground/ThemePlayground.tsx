import { useState } from "react";
import { IoColorPaletteOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Drawer } from "@/components/core/Drawer";

import { ComponentsShowcase } from "./ComponentsShowcase";
import { ThemeControls } from "./ThemeControls";
import { useThemeTokens } from "./useThemeTokens";

export function ThemePlayground() {
  const tokens = useThemeTokens();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="relative flex h-[calc(100dvh-3rem)] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-full w-96 shrink-0 flex-col overflow-hidden border-r border-token">
        <div className="min-h-0 flex-1 overflow-y-auto p-mid">
          <ThemeControls tokens={tokens} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
        <ComponentsShowcase embedded />
      </main>

      {/* Mobile Floating Button */}
      <div className="fixed bottom-6 right-6 z-30 md:hidden">
        <Button
          onClick={() => setDrawerOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full p-0 shadow-token-lg bg-primary text-primary-foreground hover:bg-primary-hover active:scale-95 transition-transform"
          aria-label="Настройки темы"
        >
          <IoColorPaletteOutline className="size-6" />
        </Button>
      </div>

      {/* Mobile Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} placement="bottom" size="default">
        <Drawer.Header>
          <Drawer.HeadingBlock>
            <Drawer.Title>Настройки темы</Drawer.Title>
            <Drawer.Description>Настройте токены темы для Burne UI.</Drawer.Description>
          </Drawer.HeadingBlock>
          <Drawer.Close />
        </Drawer.Header>
        <Drawer.Body className="p-mid">
          <ThemeControls tokens={tokens} />
        </Drawer.Body>
      </Drawer>
    </div>
  );
}
