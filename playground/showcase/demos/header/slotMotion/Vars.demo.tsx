import { Header } from "@/components/core/Header";

export function HeaderMotionVarsDemo() {
  return (
    <Header motion={{ root: { enter: { y: -8, opacity: 0, duration: 0.35 } } }}>Title</Header>
  );
}
