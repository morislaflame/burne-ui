import { Container } from "@/components/core/Container";

export function ContainerMotionFactoryDemo() {
  return (
    <Container
      maxWidth="mid" padding="mid"
      motion={{
        root: {
          enter: (ctx) => ctx.fromTo({ y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }),
        },
      }}
    >
      <span>Factory</span>
    </Container>
  );
}
