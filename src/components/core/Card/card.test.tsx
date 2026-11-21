import { createRef } from "react";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { render } from "@/__tests__/helpers";
import { Button } from "@/components/core/Button";

import { Card } from ".";

describe("Card Phase 2E fixes", () => {
  it("supports disabled on pressable Card and blocks activation", async () => {
    const onClick = vi.fn();
    const { user, rerender } = render(
      <Card pressable disabled onClick={onClick}>
        <Card.Body>Locked</Card.Body>
      </Card>,
    );
    const btn = screen.getByRole("button", { name: "Locked" });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("data-disabled", "");
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();

    rerender(
      <Card pressable disabled asChild onClick={onClick}>
        <a href="/secret">Link card</a>
      </Card>,
    );
    const link = screen.getByText("Link card").closest("a")!;
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).not.toHaveAttribute("href");
    await user.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("merges ref and onClick via mergeAsChildProps when asChild and ignores nested interactive controls", async () => {
    const cardRef = createRef<HTMLElement>();
    const childRef = createRef<HTMLDivElement>();
    const onCardClick = vi.fn();
    const onChildClick = vi.fn();
    const onInnerButton = vi.fn();

    const { user } = render(
      <Card ref={cardRef} pressable asChild onClick={onCardClick}>
        <div
          ref={childRef}
          role="button"
          tabIndex={0}
          onClick={onChildClick}
          onKeyDown={() => {}}
        >
          <span>Card surface</span>
          <Button onClick={onInnerButton}>Inner action</Button>
        </div>
      </Card>,
    );

    expect(cardRef.current).toBe(childRef.current);

    await user.click(screen.getByRole("button", { name: "Inner action" }));
    expect(onInnerButton).toHaveBeenCalledTimes(1);
    expect(onCardClick).not.toHaveBeenCalled();
    onChildClick.mockClear();

    await user.click(screen.getByText("Card surface"));
    expect(onChildClick).toHaveBeenCalledTimes(1);
    expect(onCardClick).toHaveBeenCalledTimes(1);
  });
});
