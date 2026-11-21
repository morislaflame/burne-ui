import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { render, setReducedMotion } from "@/__tests__/helpers";
import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";
import { gsap } from "@/components/core/utils/gsapMotion";
import { ToggleButton } from "@/components/core/ToggleButton";

import { ButtonGroup } from ".";

describe("ButtonGroup fixes", () => {
  it("cascades size, variant, and disabled even when segmented={true}", () => {
    render(
      <ButtonGroup segmented size="small" variant="outline" disabled>
        <Button>First</Button>
        <ToggleButton>Second</ToggleButton>
      </ButtonGroup>,
    );

    const first = screen.getByRole("button", { name: "First" });
    const second = screen.getByRole("button", { name: "Second" });

    expect(first).toHaveAttribute("data-size", "small");
    expect(first).toHaveAttribute("data-variant", "outline");
    expect(first).toBeDisabled();
    expect(first).not.toHaveAttribute("data-group-segment");

    expect(second).toHaveAttribute("data-size", "small");
    expect(second).toHaveAttribute("data-variant", "outline");
    expect(second).toBeDisabled();
    expect(second).not.toHaveAttribute("data-group-segment");
  });

  it("joins ToggleButton slots seamlessly when not segmented", () => {
    render(
      <ButtonGroup size="mid" variant="outline">
        <ToggleButton>Bold</ToggleButton>
        <ToggleButton>Italic</ToggleButton>
      </ButtonGroup>,
    );

    const bold = screen.getByRole("button", { name: "Bold" });
    const italic = screen.getByRole("button", { name: "Italic" });

    expect(bold).toHaveAttribute("data-group-segment", "");
    expect(italic).toHaveAttribute("data-group-segment", "");
    expect(bold).toHaveAttribute("data-size", "mid");
    expect(italic).toHaveAttribute("data-variant", "outline");
    expect(bold.className).toContain("rounded-s-[inherit]");
    expect(italic.className).toContain("rounded-e-[inherit]");
  });

  it("keeps dropdown trigger press scale off the segment fill", async () => {
    setReducedMotion(false);
    render(
      <ButtonGroup aria-label="Actions with a document">
        <Button>List</Button>
        <Dropdown>
          <Dropdown.Trigger asChild>
            <Button variant="primary" aria-label="Additional actions" iconOnly>
              <span aria-hidden>...</span>
            </Button>
          </Dropdown.Trigger>
          <Dropdown.Popover>
            <Dropdown.Item value="dup" selection={false}>
              Duplicate
            </Dropdown.Item>
          </Dropdown.Popover>
        </Dropdown>
      </ButtonGroup>,
    );

    const trigger = screen.getByRole("button", { name: "Additional actions" });
    const motion = trigger.querySelector(".button-group-motion");
    expect(motion).toBeInstanceOf(HTMLElement);

    const created: gsap.core.Timeline[] = [];
    const original = gsap.timeline.bind(gsap);
    const timelineSpy = vi.spyOn(gsap, "timeline").mockImplementation((vars) => {
      const tl = original(vars);
      created.push(tl);
      return tl;
    });

    fireEvent.pointerDown(trigger, { button: 0, pointerType: "mouse" });
    await act(async () => {
      await Promise.resolve();
    });

    const targets = created.flatMap((tl) =>
      tl
        .getChildren(false, true, false)
        .flatMap((child) => ("targets" in child ? (child as gsap.core.Tween).targets() : [])),
    );
    expect(targets).toContain(motion);
    expect(targets).not.toContain(trigger);
    timelineSpy.mockRestore();
  });
});
