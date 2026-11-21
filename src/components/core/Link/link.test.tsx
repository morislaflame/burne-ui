import { fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { render, setReducedMotion } from "@/__tests__/helpers";

import { Link } from ".";

afterEach(() => {
  setReducedMotion(false);
  vi.restoreAllMocks();
});

describe("Link fixes", () => {
  it("applies classNames.text only once on the text span", () => {
    const { container } = render(
      <Link href="/docs" classNames={{ text: "custom-link-text" }}>
        Documentation
      </Link>,
    );
    expect(container.querySelectorAll(".custom-link-text")).toHaveLength(1);
  });

  it("broadcasts pointer hover and press from <a> to text, iconStart, and iconEnd", () => {
    setReducedMotion(false);
    const startHover = vi.fn();
    const endHover = vi.fn();
    const textPress = vi.fn();

    render(
      <Link
        href="/docs"
        motion={{
          iconStart: { hoverIn: () => void startHover() },
          iconEnd: { hoverIn: () => void endHover() },
          text: { pressIn: () => void textPress() },
        }}
      >
        <Link.Icon position="start">S</Link.Icon>
        Docs
        <Link.Icon position="end">E</Link.Icon>
      </Link>,
    );

    const anchor = screen.getByRole("link", { name: "Docs" });
    fireEvent.pointerOver(anchor);
    expect(startHover).toHaveBeenCalledTimes(1);
    expect(endHover).toHaveBeenCalledTimes(1);

    fireEvent.pointerDown(anchor);
    expect(textPress).toHaveBeenCalledTimes(1);
  });

  it("blocks disabled and aria-disabled links in both native and asChild modes", () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <Link href="/docs" disabled onClick={onClick}>
        Docs
      </Link>,
    );
    const nativeEl = screen.getByText("Docs").closest("a")!;
    expect(nativeEl).not.toHaveAttribute("href");
    expect(nativeEl).toHaveAttribute("aria-disabled", "true");
    expect(nativeEl).toHaveAttribute("data-disabled", "");
    fireEvent.click(nativeEl);
    expect(onClick).not.toHaveBeenCalled();

    rerender(
      <Link asChild disabled onClick={onClick}>
        <a href="/docs">Child Docs</a>
      </Link>,
    );
    const childEl = screen.getByText("Child Docs").closest("a")!;
    expect(childEl).not.toHaveAttribute("href");
    expect(childEl).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(childEl);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("guards asChild safely when children is not a valid ReactElement", () => {
    const { container, rerender } = render(<Link asChild>{null}</Link>);
    expect(container.firstChild).toBeNull();

    rerender(
      <Link asChild href="/fallback">
        Plain text
      </Link>,
    );
    expect(screen.getByRole("link", { name: "Plain text" })).toHaveAttribute("href", "/fallback");
  });
});
