import { Container } from "@/components/core/Container";

export function ContainerClassNamesFullDemo() {
  return (
    <Container maxWidth="small" classNames={{ root: "rounded-mid bg-surface" }}>
      <span>Page</span>
    </Container>
  );
}
