import { Container } from "@/components/core/Container";
import { Grid } from "@/components/core/Grid";
import { Stack } from "@/components/core/Stack";
import { Surface } from "@/components/core/Surface";

export function ContainerSizeDemo() {
  return (
    <Container maxWidth="mid" padding="mid" classNames={{ root: "rounded-mid bg-surface" }}>
      <span>Centered column</span>
    </Container>
  );
}

export function LayoutScreenDemo() {
  return (
    <Container maxWidth="xlarge" padding="large">
      <Stack gap="large">
        <span>Overview</span>
        <Grid columns={3} gap="mid">
          <Surface padding="mid">One</Surface>
          <Surface padding="mid">Two</Surface>
          <Surface padding="mid">Three</Surface>
        </Grid>
      </Stack>
    </Container>
  );
}
