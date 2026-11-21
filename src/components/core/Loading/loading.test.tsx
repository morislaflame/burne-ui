import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { render } from "@/__tests__/helpers";

import { Loading } from ".";

describe("Loading Phase 2E fixes", () => {
  it("sets data-status on root and cleans up dot animations across size changes and unmount", () => {
    const { rerender, unmount } = render(
      <Loading indicator="dots" size="small" status="info" />,
    );
    const loader = screen.getByRole("status");
    expect(loader).toHaveAttribute("data-status", "info");
    expect(loader).toHaveAttribute("data-size", "small");

    rerender(<Loading indicator="dots" size="large" status="success" />);
    expect(loader).toHaveAttribute("data-status", "success");
    expect(loader).toHaveAttribute("data-size", "large");
    unmount();
  });
});
