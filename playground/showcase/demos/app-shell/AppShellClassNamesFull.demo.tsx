import { AppShell } from "@/components/core/AppShell";
import { Header } from "@/components/core/Header";
import { Sidebar } from "@/components/core/Sidebar";

export function AppShellClassNamesFullDemo() {
  return (
    <AppShell classNames={{ root: "bg-background", body: "min-h-0", main: "p-large" }}>
      <Header>App</Header>
      <Sidebar aria-label="Sections">Nav</Sidebar>
      <span>Main</span>
    </AppShell>
  );
}
