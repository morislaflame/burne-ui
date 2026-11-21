import { afterEach, describe, expect, it } from "vitest";

import { render } from "@/__tests__/helpers";
import { Alert, Avatar, Badge, Button, Card, Input, Kbd, Surface, Tabs, ToggleButton } from "@/index";
import { SkinProvider } from "@/skins/skinContext";
import { registerSkin, unregisterSkin } from "@/skins/skinRegistry";

const SLOTS = [
  "alert.root",
  "avatar.root",
  "badge.root",
  "button.root",
  "card.root",
  "input.shell",
  "kbd.root",
  "surface.root",
  "tabs.list",
  "tabs.tab",
  "toggleButton.root",
] as const;

const extendClass = (slot: string) => `ext-${slot.replace(".", "-")}`;

afterEach(() => {
  unregisterSkin("ext");
});

describe("skin targets { extend }", () => {
  it("appends the class after the kit classes on every target root", () => {
    registerSkin({
      name: "ext",
      baseVariant: "default",
      elevation: "kit",
      targets: Object.fromEntries(SLOTS.map((slot) => [slot, { extend: extendClass(slot) }])),
    });

    const { container } = render(
      <SkinProvider skin="ext">
        <Alert title="Note" />
        <Avatar label="AB" />
        <Badge>New</Badge>
        <Button>Save</Button>
        <Card>Body</Card>
        <Input aria-label="Name" />
        <Kbd>K</Kbd>
        <Surface>Pane</Surface>
        <Tabs defaultValue="a">
          <Tabs.List>
            <Tabs.Tab value="a">A</Tabs.Tab>
          </Tabs.List>
        </Tabs>
        <ToggleButton>Bold</ToggleButton>
      </SkinProvider>,
    );

    for (const slot of SLOTS) {
      expect(container.querySelector(`.${extendClass(slot)}`), slot).toBeTruthy();
    }
    expect(container.querySelector(".ext-card-root")?.className).toContain("bg-surface");
  });
});
