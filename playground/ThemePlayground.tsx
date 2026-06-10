import { ComponentsShowcase } from "./ComponentsShowcase";
import { ThemeControls } from "./ThemeControls";
import { useThemeTokens } from "./useThemeTokens";

export function ThemePlayground() {
  const tokens = useThemeTokens();

  return (
    <div className="flex h-[calc(100dvh-3rem)] overflow-hidden">
      <aside className="flex h-full w-96 shrink-0 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto p-mid">
          <ThemeControls tokens={tokens} />
        </div>
      </aside>
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
        <ComponentsShowcase embedded />
      </main>
    </div>
  );
}
