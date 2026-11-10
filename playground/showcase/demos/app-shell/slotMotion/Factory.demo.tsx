import { AppShell } from "@/components/core/AppShell";

export function AppShellMotionFactoryDemo() {
  return (
    <AppShell motion={{ main: { enter: (ctx) => ctx.fromTo({ y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }) } }}><span>Shell</span></AppShell>
  );
}
