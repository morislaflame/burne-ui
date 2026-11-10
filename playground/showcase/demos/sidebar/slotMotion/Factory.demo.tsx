import { Sidebar } from "@/components/core/Sidebar";

export function SidebarMotionFactoryDemo() {
  return (
    <Sidebar aria-label="Sections" motion={{ root: { enter: (ctx) => ctx.fromTo({ y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }) } }}>Nav</Sidebar>
  );
}
