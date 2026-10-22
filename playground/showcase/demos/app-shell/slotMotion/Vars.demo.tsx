import { AppShell } from "@/components/core/AppShell";

export function AppShellMotionVarsDemo() {
  return (
    <AppShell motion={{ root: { enter: { y: -8, opacity: 0, duration: 0.35 } } }}><span>Shell</span></AppShell>
  );
}
