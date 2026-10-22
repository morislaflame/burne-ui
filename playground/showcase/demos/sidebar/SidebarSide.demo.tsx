import { Sidebar } from "@/components/core/Sidebar";

export function SidebarSideDemo() {
  return (
    <div className="flex w-full">
      <Sidebar aria-label="Sections" width="small">Start</Sidebar>
      <Sidebar aria-label="Sections" side="end" width="mid">End</Sidebar>
    </div>
  );
}
