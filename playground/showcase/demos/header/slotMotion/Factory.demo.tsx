import { Header } from "@/components/core/Header";

export function HeaderMotionFactoryDemo() {
  return (
    <Header motion={{ root: { enter: (ctx) => ctx.fromTo({ y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }) } }}>Title</Header>
  );
}
