import { screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { Accordion } from "@/components/composite/Accordion";
import { ButtonGroup } from "@/components/composite/ButtonGroup";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";

import { render } from "./helpers";

describe("Э3.3 important-free frame", () => {
  it("drops kit !important frame rules in ButtonGroup and Accordion", () => {
    const group = readFileSync(
      resolve("src/components/composite/ButtonGroup/buttonGroupStyles.ts"),
      "utf8");
    const accordion = readFileSync(
      resolve("src/components/composite/Accordion/accordionStyles.ts"),
      "utf8");

    expect(group).not.toMatch(/!important/);
    expect(accordion).not.toMatch(/!rounded/);
    expect(accordion).toContain("--accordion-item-radius");
  });

  it("lets a joined Button keep a consumer border and shadow", () => {
    render(
      <ButtonGroup aria-label="Actions">
        <Button className="border-2 shadow-token-base">Save</Button>
        <Button>Cancel</Button>
      </ButtonGroup>);

    const save = screen.getByRole("button", { name: "Save" });
    const cancel = screen.getByRole("button", { name: "Cancel" });

    expect(save.className).toContain("button-group-segment");
    expect(save).toHaveAttribute("data-group-segment", "");
    expect(save.className).toContain("border-2");
    expect(save.className).toContain("shadow-token-base");
    expect(save.className).not.toContain("border-token");
    expect(cancel.className).toContain("button-group-segment");
    expect(cancel).toHaveAttribute("data-group-segment", "");
    expect(cancel.className).not.toContain("border-token");
  });

  it("lets a field keep a consumer border", () => {
    const { container } = render(
      <Input variant="default" aria-label="Name" classNames={{ shell: "border-2" }} />);
    const shell = container.querySelector('[data-slot="shell"], [class*="border"]');
    const control = container.querySelector("input")?.parentElement;

    expect(shell ?? control).toBeTruthy();
    const el = (shell ?? control)!;
    expect(el.className).toContain("border-2");
  });

  it("publishes accordion end-cap radius as a variable", () => {
    const { container } = render(
      <Accordion className="[--accordion-item-radius:0px]">
        <Accordion.Item value="a">
          <Accordion.Trigger>Alpha</Accordion.Trigger>
        </Accordion.Item>
        <Accordion.Item value="b">
          <Accordion.Trigger>Beta</Accordion.Trigger>
        </Accordion.Item>
      </Accordion>);

    const root = container.querySelector(".accordion-root");
    const items = container.querySelectorAll("[data-accordion-item]");

    expect(root?.className).toContain("[--accordion-item-radius:0px]");
    expect(root?.className).not.toContain("!rounded");
    expect(items).toHaveLength(2);
    expect(items[0]?.className).toContain(
      "first:rounded-t-[length:var(--accordion-item-radius)]");
    expect(items[0]?.className).toContain("rounded-none");
    expect(items[0]?.className).not.toContain("!rounded");
    expect(items[1]?.className).toContain(
      "last:rounded-b-[length:var(--accordion-item-radius)]");
  });
});
