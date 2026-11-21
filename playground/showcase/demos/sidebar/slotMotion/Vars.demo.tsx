import { Sidebar } from "@/components/core/Sidebar";

export function SidebarMotionVarsDemo() {
  return (
    <Sidebar aria-label="Sections" motion={{ root: { enter: { y: -8, opacity: 0, duration: 0.35 } } }}>Nav</Sidebar>
  );
}
