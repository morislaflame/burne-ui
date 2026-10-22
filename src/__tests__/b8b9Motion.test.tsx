import { fireEvent } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Button } from "@/components/core/Button";
import { Calendar } from "@/components/core/Calendar";
import { Checkbox } from "@/components/core/Checkbox";
import { Radio } from "@/components/core/Radio";
import { Switch } from "@/components/core/Switch";
import { gsap } from "@/components/core/utils/gsapMotion";
import { configureMotion, MOTION_CONFIG_DEFAULTS } from "@/components/core/utils/motionConfig";
import { MotionConfigProvider } from "@/components/core/utils/motionConfigContext";

import { render, setReducedMotion } from "./helpers";

afterEach(() => {
  configureMotion({ ...MOTION_CONFIG_DEFAULTS });
  setReducedMotion(false);
  vi.restoreAllMocks();
});

function markOf(container: HTMLElement) {
  const mark = container.querySelector("[data-selection-mark]");
  if (!(mark instanceof HTMLElement)) throw new Error("selection mark missing");
  return mark;
}

function expectVisible(el: HTMLElement) {
  expect(el.style.visibility).not.toBe("hidden");
  expect(el.style.opacity).not.toBe("0");
}

describe("reduced selection mark stays visible", () => {
  it("shows the mark after a click when motion is reduced", () => {
    setReducedMotion(true);
    const { container, getByRole } = render(<Checkbox label="Agree" />);
    expect(markOf(container).style.visibility).toBe("hidden");
    fireEvent.click(getByRole("checkbox"));
    expectVisible(markOf(container));
  });

  it("shows the radio mark after a click when motion is reduced", () => {
    setReducedMotion(true);
    const { container, getByRole } = render(<Radio label="One" />);
    fireEvent.click(getByRole("radio"));
    expectVisible(markOf(container));
  });

  it("shows the switch icon after a click when motion is reduced", () => {
    setReducedMotion(true);
    const { getByRole, getByText } = render(<Switch label="Alerts" iconOn={<span>On</span>} />);
    const icon = getByText("On").parentElement?.parentElement;
    if (!(icon instanceof HTMLElement)) throw new Error("switch icon missing");
    icon.style.visibility = "hidden";
    fireEvent.click(getByRole("switch"));
    expectVisible(icon);
  });

  it("shows the mark when selection fill is disabled", () => {
    setReducedMotion(false);
    const { container, getByRole } = render(
      <MotionConfigProvider motion={{ enableSelectionFill: false }}>
        <Checkbox label="Agree" />
      </MotionConfigProvider>,
    );
    expect(markOf(container).style.visibility).toBe("hidden");
    fireEvent.click(getByRole("checkbox"));
    expectVisible(markOf(container));
  });
});

describe("calendar hover is a slot", () => {
  it("lets motion.root.hoverIn replace the default hover", () => {
    setReducedMotion(false);
    const to = vi.spyOn(gsap, "to");
    const lifted = render(<Calendar />);
    const panel = lifted.container.querySelector("[data-variant]");
    if (!(panel instanceof HTMLElement)) throw new Error("calendar root missing");
    to.mockClear();
    fireEvent.pointerOver(panel);
    expect(to).toHaveBeenCalled();

    to.mockClear();
    const replaced = render(<Calendar motion={{ root: { hoverIn: false } }} />);
    const quiet = replaced.container.querySelector("[data-variant]");
    if (!(quiet instanceof HTMLElement)) throw new Error("calendar root missing");
    to.mockClear();
    fireEvent.pointerOver(quiet);
    expect(to).not.toHaveBeenCalled();
  });

  it("lets a scoped enableHoverLift win over the global flag", () => {
    setReducedMotion(false);
    configureMotion({ enableHoverLift: false });
    const to = vi.spyOn(gsap, "to");
    const blocked = render(<Button>Save</Button>);
    to.mockClear();
    fireEvent.pointerOver(blocked.getByRole("button"));
    expect(to).not.toHaveBeenCalled();
    blocked.unmount();

    const allowed = render(
      <MotionConfigProvider motion={{ enableHoverLift: true }}>
        <Button>Save</Button>
      </MotionConfigProvider>,
    );
    to.mockClear();
    fireEvent.pointerOver(allowed.getByRole("button"));
    expect(to).toHaveBeenCalled();
  });
});
