import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { render } from "@/__tests__/helpers";

import { SearchInput } from "./index";

describe("SearchInput", () => {
  it("focuses the input synchronously on expand click so mobile virtual keyboard opens", () => {
    render(<SearchInput aria-label="Search docs" />);
    const trigger = screen.getByRole("button", { name: "Search docs" });
    fireEvent.click(trigger);

    const input = screen.getByRole("searchbox");
    expect(input).toHaveFocus();
  });

  it("fires onChange once on Clear click and keeps focus on the input", () => {
    const onChange = vi.fn();
    render(<SearchInput aria-label="Search" defaultExpanded defaultValue="react" onChange={onChange} />);

    const input = screen.getByRole("searchbox");
    input.focus();
    const clear = screen.getByRole("button", { name: "Clear field" });

    const mouseDown = new MouseEvent("mousedown", { bubbles: true, cancelable: true });
    clear.dispatchEvent(mouseDown);
    expect(mouseDown.defaultPrevented).toBe(true);

    fireEvent.click(clear);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue("");
    expect(input).toHaveFocus();
  });

  it("allows expanding and focusing in readOnly mode while hiding Clear", () => {
    const { container } = render(
      <SearchInput aria-label="Search" readOnly defaultValue="locked query" />,
    );
    const root = container.querySelector('[role="search"]')!;
    expect(root.className).not.toContain("pointer-events-none");
    expect(root).toHaveAttribute("data-readonly", "");

    fireEvent.click(screen.getByRole("button", { name: "Search" }));
    const input = screen.getByRole("searchbox");
    expect(input).toHaveFocus();
    expect(input).toHaveAttribute("readonly");
    expect(screen.queryByRole("button", { name: "Clear field" })).toBeNull();
  });

  it("ignores Escape while IME composition is active and resets Clear state on form reset", async () => {
    const { container } = render(
      <form>
        <SearchInput name="q" aria-label="Search" defaultExpanded />
      </form>,
    );
    const input = screen.getByRole("searchbox");
    fireEvent.keyDown(input, { key: "Escape", isComposing: true, keyCode: 229 });
    expect(container.querySelector('[role="search"]')).toHaveAttribute("data-state", "expanded");

    fireEvent.change(input, { target: { value: "hello" } });
    expect(screen.getByRole("button", { name: "Clear field" })).toBeInTheDocument();

    container.querySelector("form")!.reset();
    await waitFor(() => {
      expect(screen.queryByRole("button", { name: "Clear field" })).toBeNull();
    });
  });
});
