import { describe, expect, it } from "vitest";

import { Container } from "@/components/core/Container";
import { Grid } from "@/components/core/Grid";
import { Stack } from "@/components/core/Stack";
import { Surface } from "@/components/core/Surface";

import { render } from "./helpers";

describe("layout primitives", () => {
  it("stacks on the space scale", () => {
    const view = render(
      <Stack gap="mid" orientation="horizontal">
        Row
      </Stack>,
    );
    const root = view.getByText("Row");
    expect(root).toHaveClass("flex-row", "gap-mid");
    expect(root).toHaveAttribute("data-orientation", "horizontal");
  });

  it("grids a fixed column count and an auto track", () => {
    const view = render(
      <>
        <Grid columns={3} gap="small">
          Three
        </Grid>
        <Grid columns="auto" minTrack="small">
          Auto
        </Grid>
      </>,
    );
    expect(view.getByText("Three")).toHaveClass("grid-cols-3", "gap-small");
    expect(view.getByText("Auto").className).toContain("minmax(min(100%,var(--max-component-small)),1fr)");
    expect(view.getByText("Three")).not.toHaveAttribute("data-columns");
  });

  it("centers a measured column", () => {
    const view = render(
      <Container maxWidth="large" padding="base">
        Page
      </Container>,
    );
    const root = view.getByText("Page");
    expect(root).toHaveClass("mx-auto", "max-w-page-large", "px-base");
  });

  it("composes a screen from Container, Stack, Grid, and Surface", () => {
    const view = render(
      <Container maxWidth="xlarge">
        <Stack gap="large">
          <Grid columns={3}>
            <Surface padding="mid">One</Surface>
          </Grid>
        </Stack>
      </Container>,
    );
    expect(view.getByText("One")).toBeInTheDocument();
  });
});
