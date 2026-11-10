import { AppShell } from "@/components/core/AppShell";
import { Header } from "@/components/core/Header";
import { Sidebar } from "@/components/core/Sidebar";

export function AppShellScreenDemo() {
  return (
    <AppShell className="min-h-[20rem]">
      <Header sticky>Studio</Header>
      <Sidebar aria-label="Sections" width="small">Nav</Sidebar>
      <span className="block p-large">Overview</span>
    </AppShell>
  );
}
