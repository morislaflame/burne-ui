import { describe, expect, it } from "vitest";

import { Alert } from "@/components/core/Alert";
import { Input } from "@/components/core/Input";
import { Kbd } from "@/components/core/Kbd";

import { render } from "./helpers";

describe("shadow levels", () => {
  it("keeps a rest shadow on Alert and Kbd when hover lift is off", () => {
    const alert = render(<Alert title="Saved" hoverLift={false} />);
    expect(alert.getByRole("status").className).toContain("animate-shadow");

    const kbd = render(<Kbd hoverLift={false}>⌘S</Kbd>);
    expect(kbd.container.querySelector("kbd")?.className).toContain("animate-shadow");
  });

  it("does not paint a rest shadow on a disabled field", () => {
    const { getByRole } = render(<Input label="Name" disabled />);
    const shell = getByRole("textbox").parentElement;
    expect(shell?.className ?? "").not.toContain("shadow-token-base");
    expect(shell?.style.getPropertyValue("--el-shadow") ?? "").toBe("");
  });
});
