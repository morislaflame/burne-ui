import { fireEvent, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { render, setReducedMotion } from "@/__tests__/helpers";
import { Form } from "@/components/composite/Form";
import { ButtonGroup } from "@/components/composite/ButtonGroup";
import { createMotionStates } from "@/components/core/utils/slotMotion";
import { gsap } from "@/components/core/utils/gsapMotion";

import { Button } from ".";

afterEach(() => {
  setReducedMotion(false);
  vi.restoreAllMocks();
});

describe("Button fixes", () => {
  it("preserves motion.states.loading transform without clearMotionTransform killing it", () => {
    setReducedMotion(false);
    const states = createMotionStates({
      loading: {
        root: (ctx) => ctx.to({ scale: 0.96, duration: 0.2 }),
      },
    });
    const { rerender } = render(
      <Button motion={{ states }} motionState="idle">
        Save
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "Save" });
    rerender(
      <Button motion={{ states }} motionState="loading">
        Save
      </Button>,
    );
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(btn).toHaveAttribute("data-state", "loading");
    expect(gsap.getTweensOf(btn).length).toBeGreaterThan(0);

    // When actual disabled becomes true, transform and tweens ARE cleared
    rerender(
      <Button motion={{ states }} motionState="loading" disabled>
        Save
      </Button>,
    );
    expect(gsap.getTweensOf(btn)).toHaveLength(0);
    expect(Number(gsap.getProperty(btn, "scale"))).toBe(1);
  });

  it("blocks <Button asChild> when disabled or loading and strips href", () => {
    const onClick = vi.fn();
    const childClick = vi.fn();
    const { rerender } = render(
      <Button asChild disabled onClick={onClick}>
        <a href="/secret" onClick={childClick}>
          Secret
        </a>
      </Button>,
    );
    const el = screen.getByText("Secret").closest("a")!;
    expect(el).not.toHaveAttribute("href");
    expect(el).toHaveAttribute("aria-disabled", "true");
    expect(el).toHaveAttribute("data-disabled", "");
    expect(el).toHaveAttribute("tabindex", "-1");
    expect(el.className).toContain("aria-disabled:pointer-events-none");
    expect(el.className).toContain("aria-disabled:opacity-50");

    fireEvent.click(el);
    fireEvent.keyDown(el, { key: " " });
    fireEvent.keyDown(el, { key: "Enter" });
    expect(onClick).not.toHaveBeenCalled();
    expect(childClick).not.toHaveBeenCalled();

    rerender(
      <Button asChild motionState="loading" onClick={onClick}>
        <a href="/secret" onClick={childClick}>
          Secret
        </a>
      </Button>,
    );
    expect(el).not.toHaveAttribute("href");
    expect(el).toHaveAttribute("aria-busy", "true");
    expect(el).toHaveAttribute("aria-disabled", "true");
    expect(el).toHaveAttribute("data-state", "loading");
  });

  it("activates non-button <Button asChild> on Space key when enabled", () => {
    const onClick = vi.fn((e: React.MouseEvent) => e.preventDefault());
    render(
      <Button asChild onClick={onClick}>
        <a href="/docs">Docs</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Docs" });
    const spaceAllowed = fireEvent.keyDown(link, { key: " " });
    expect(spaceAllowed).toBe(false);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("cascades size from Form shell when size prop is omitted", () => {
    render(
      <Form size="large" aria-label="Profile">
        <Button>Submit</Button>
      </Form>,
    );
    expect(screen.getByRole("button", { name: "Submit" })).toHaveAttribute("data-size", "large");
  });

  it("keeps contentMotionRef wired when Button.Content receives a custom ref in a ButtonGroup", () => {
    setReducedMotion(false);
    const contentRef = createRef<HTMLSpanElement>();
    const spy = vi.spyOn(gsap, "timeline");
    render(
      <ButtonGroup>
        <Button>
          <Button.Content ref={contentRef}>
            <Button.Label>One</Button.Label>
          </Button.Content>
        </Button>
        <Button>Two</Button>
      </ButtonGroup>,
    );
    expect(contentRef.current).toBeInstanceOf(HTMLSpanElement);
    spy.mockClear();
    fireEvent.pointerDown(screen.getByRole("button", { name: "One" }));
    return Promise.resolve().then(() => {
      expect(spy).toHaveBeenCalled();
    });
  });
});
