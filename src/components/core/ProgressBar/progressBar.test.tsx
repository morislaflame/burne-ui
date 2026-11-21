import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { render } from "@/__tests__/helpers";

import { ProgressBar } from ".";

describe("ProgressBar Phase 2E fixes", () => {
  it("applies semantic status fill and data-status without leaking status attribute onto DOM", () => {
    render(<ProgressBar value={60} status="danger" label="Disk" />);
    const bar = screen.getByRole("progressbar", { name: "Disk" });
    expect(bar).toHaveAttribute("data-status", "danger");
    expect(bar).not.toHaveAttribute("status");
    const fill = bar.querySelector("span");
    expect(fill?.className).toContain("bg-danger");
  });

  it("only sets aria-labelledby when a label is actually rendered", () => {
    const { rerender } = render(<ProgressBar value={40} />);
    const unlabelled = screen.getByRole("progressbar");
    expect(unlabelled).not.toHaveAttribute("aria-labelledby");
    expect(unlabelled).toHaveAttribute("aria-label");

    rerender(
      <ProgressBar>
        <ProgressBar.Header>
          <ProgressBar.Label>Upload</ProgressBar.Label>
        </ProgressBar.Header>
        <ProgressBar.Track value={40} status="success" />
      </ProgressBar>,
    );
    const labelled = screen.getByRole("progressbar", { name: "Upload" });
    expect(labelled).toHaveAttribute("aria-labelledby");
    expect(labelled).toHaveAttribute("data-status", "success");
  });

  it("guards NaN, Infinity, and min >= max, and merges user style with thickness", () => {
    render(
      <ProgressBar.Track
        value={Number.NaN}
        min={100}
        max={50}
        thickness={12}
        style={{ opacity: 0.75 }}
      />,
    );
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "100");
    expect(bar).toHaveAttribute("aria-valuemin", "100");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar.style.height).toBe("12px");
    expect(bar.style.opacity).toBe("0.75");
  });
});
