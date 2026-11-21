import { describe, expect, it } from "vitest";

import { render } from "@/__tests__/helpers";
import { AspectRatio } from "@/components/core/AspectRatio";
import { Container } from "@/components/core/Container";
import { Grid } from "@/components/core/Grid";
import { Header } from "@/components/core/Header";
import { Stack } from "@/components/core/Stack";
import { SkinProvider } from "@/skins/skinContext";

import { AppShell } from ".";

const LAYOUT_SKIN = {
  name: "layout-test-skin",
  styleUrl: "skin-fixture/layout.css",
  targets: {
    "appShell.root": { extend: "skin-appshell" },
    "header.root": { extend: "skin-header" },
    "container.root": { extend: "skin-container" },
    "grid.root": { extend: "skin-grid" },
    "stack.root": { extend: "skin-stack" },
    "aspectRatio.root": { extend: "skin-aspect" },
  },
};

describe("Layout primitives Phase 2E fixes", () => {
  it("unwraps React.Fragment in AppShell, applies text-foreground, guards AspectRatio, and reads active skin targets", () => {

    const { container, getByRole } = render(
      <SkinProvider skin={LAYOUT_SKIN}>
        <AppShell>
          <>
            <Header>Top bar</Header>
          </>
          <Container>
            <Stack>
              <Grid columns={2}>
                <AspectRatio ratio={0}>Zero ratio</AspectRatio>
                <AspectRatio ratio={Number.NaN}>NaN ratio</AspectRatio>
              </Grid>
            </Stack>
          </Container>
        </AppShell>
      </SkinProvider>,
    );

    const shell = container.querySelector(".skin-appshell") as HTMLElement;
    expect(shell).toBeTruthy();
    expect(shell.className).toContain("text-foreground");

    const header = container.querySelector("header")!;
    // Slotted outside <main>, not trapped inside <main> due to Fragment!
    expect(getByRole("main").contains(header)).toBe(false);
    expect(header.className).toContain("text-foreground");
    expect(header.className).toContain("skin-header");

    expect(container.querySelector(".skin-container")).toBeTruthy();
    expect(container.querySelector(".skin-stack")).toBeTruthy();
    expect(container.querySelector(".skin-grid")).toBeTruthy();

    const aspects = container.querySelectorAll(".skin-aspect");
    expect(aspects).toHaveLength(2);
    expect((aspects[0] as HTMLElement).style.aspectRatio).toMatch(/^1(?:\s*\/\s*1)?$/);
    expect((aspects[0] as HTMLElement).className).toContain("shrink-0");
    expect((aspects[1] as HTMLElement).style.aspectRatio).toMatch(/^1(?:\s*\/\s*1)?$/);
  });
});
