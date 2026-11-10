import { describe, expect, it } from "vitest";

import { Button } from "@/components/core/Button";
import { ToggleButton } from "@/components/core/ToggleButton";

import { render } from "./helpers";

describe("R1.5 root className lands once", () => {
  it("Button simple API: className stays on the button, not the label", () => {
    const { container } = render(<Button className="px-xlarge">Save</Button>);
    const button = container.querySelector("button");
    expect(button?.className).toContain("px-xlarge");
    const innerWithPad = [...container.querySelectorAll("span")].filter((el) =>
      el.classList.contains("px-xlarge"),
    );
    expect(innerWithPad).toEqual([]);
  });

  it("ToggleButton simple API: className stays on the button, not content", () => {
    const { container } = render(<ToggleButton className="px-xlarge">Like</ToggleButton>);
    const button = container.querySelector("button");
    expect(button?.className).toContain("px-xlarge");
    const innerWithPad = [...container.querySelectorAll("span")].filter((el) =>
      el.classList.contains("px-xlarge"),
    );
    expect(innerWithPad).toEqual([]);
  });
});
