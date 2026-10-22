import { Container } from "@/components/core/Container";

export function ContainerMotionVarsDemo() {
  return (
    <Container
      maxWidth="mid" padding="mid"
      motion={{ root: { enter: { y: -8, opacity: 0, duration: 0.35 } } }}
    >
      <span>Enter</span>
    </Container>
  );
}
