import { screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { ComboBox } from "@/components/core/ComboBox";
import { Slider } from "@/components/core/Slider";
import { Switch } from "@/components/core/Switch";
import { TextArea } from "@/components/core/TextArea";
import { TimeField } from "@/components/core/TimeField";

import { render } from "./helpers";

const OPTIONS = [
  { value: "alpha", label: "Alpha" },
  { value: "beta", label: "Beta" },
];

describe("R5.2 ComboBox", () => {
  it("keeps an uncontrolled value and a controlled value", async () => {
    const onValueChange = vi.fn();
    const { user, rerender } = render(
      <ComboBox label="City" items={OPTIONS} defaultValue="alpha" onValueChange={onValueChange} />,
    );
    expect(screen.getByRole("combobox")).toHaveValue("Alpha");
    const input = screen.getByRole("combobox");
    input.focus();
    await user.keyboard("{ArrowDown}");
    expect(await screen.findByRole("listbox")).toBeInTheDocument();
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalled();

    function Controlled() {
      const [value, setValue] = useState<string | null>("beta");
      return <ComboBox label="City" items={OPTIONS} value={value} onValueChange={setValue} />;
    }
    rerender(<Controlled />);
    expect(screen.getByRole("combobox")).toHaveValue("Beta");
  });

  it("publishes invalid and describedby", () => {
    render(<ComboBox label="City" items={OPTIONS} hint="Pick one" error="Required" />);
    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.getAttribute("aria-describedby")).toBeTruthy();
  });
});

describe("R5.2 Slider", () => {
  it("steps an uncontrolled value and keeps a controlled value", async () => {
    const onValueChange = vi.fn();
    const { user, rerender } = render(
      <Slider aria-label="Volume" defaultValue={40} min={0} max={100} step={10} onValueChange={onValueChange} />,
    );
    const slider = screen.getByRole("slider");
    slider.focus();
    await user.keyboard("{ArrowRight}");
    expect(slider).toHaveAttribute("aria-valuenow", "50");
    expect(onValueChange).toHaveBeenCalledWith(50);

    function Controlled() {
      const [value, setValue] = useState(20);
      return (
        <Slider aria-label="Volume" value={value} onValueChange={setValue} min={0} max={100} step={10} />
      );
    }
    rerender(<Controlled />);
    const next = screen.getByRole("slider");
    next.focus();
    await user.keyboard("{ArrowRight}");
    expect(next).toHaveAttribute("aria-valuenow", "30");
  });

  it("publishes invalid and describedby", () => {
    render(<Slider aria-label="Volume" defaultValue={10} error="Too low" />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-invalid", "true");
    expect(slider.getAttribute("aria-describedby")).toBeTruthy();
  });
});

describe("R5.2 Switch", () => {
  it("toggles uncontrolled and controlled checked state from the keyboard", async () => {
    const onChange = vi.fn();
    const { user, rerender } = render(<Switch label="Alerts" defaultChecked={false} onChange={onChange} />);
    const sw = screen.getByRole("switch", { name: "Alerts" });
    sw.focus();
    await user.keyboard(" ");
    expect(sw).toBeChecked();
    expect(onChange).toHaveBeenCalled();

    function Controlled() {
      const [checked, setChecked] = useState(true);
      return (
        <Switch
          label="Alerts"
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
        />
      );
    }
    rerender(<Controlled />);
    const controlled = screen.getByRole("switch", { name: "Alerts" });
    expect(controlled).toBeChecked();
    controlled.focus();
    await user.keyboard(" ");
    expect(controlled).not.toBeChecked();
  });

  it("publishes invalid and describedby", () => {
    render(<Switch label="Alerts" hint="Optional" error="Required" />);
    const sw = screen.getByRole("switch");
    expect(sw).toHaveAttribute("aria-invalid", "true");
    expect(sw.getAttribute("aria-describedby")).toBeTruthy();
  });
});

describe("R5.2 TextArea", () => {
  it("keeps uncontrolled and controlled text", async () => {
    const { user, rerender } = render(<TextArea label="Bio" defaultValue="Hi" />);
    const field = screen.getByRole("textbox", { name: "Bio" });
    expect(field).toHaveValue("Hi");
    await user.type(field, "!");
    expect(field).toHaveValue("Hi!");

    function Controlled() {
      const [value, setValue] = useState("Ok");
      return (
        <TextArea
          label="Bio"
          value={value}
          onChange={(event) => {
            if (event.target instanceof HTMLTextAreaElement) setValue(event.target.value);
          }}
        />
      );
    }
    rerender(<Controlled />);
    const next = screen.getByRole("textbox", { name: "Bio" });
    expect(next).toHaveValue("Ok");
    await user.type(next, "!");
    expect(next).toHaveValue("Ok!");
  });

  it("publishes invalid and describedby", () => {
    render(<TextArea label="Bio" hint="Short" invalid />);
    const field = screen.getByRole("textbox");
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field.getAttribute("aria-describedby")).toBeTruthy();
  });
});

describe("R5.2 TimeField", () => {
  it("keeps uncontrolled and controlled time and steps a segment", async () => {
    const onValueChange = vi.fn();
    const { user, rerender } = render(
      <TimeField label="Start" defaultValue="12:30" onValueChange={onValueChange} />,
    );
    const hour = screen.getAllByRole("spinbutton")[0]!;
    hour.focus();
    await user.keyboard("{ArrowUp}");
    expect(onValueChange).toHaveBeenCalled();
    expect(hour.getAttribute("aria-valuenow")).not.toBe("12");

    function Controlled() {
      const [value, setValue] = useState("08:15");
      return <TimeField label="Start" value={value} onValueChange={setValue} />;
    }
    rerender(<Controlled />);
    const nextHour = screen.getAllByRole("spinbutton")[0]!;
    expect(nextHour).toHaveAttribute("aria-valuenow", "8");
    nextHour.focus();
    await user.keyboard("{ArrowUp}");
    expect(nextHour).toHaveAttribute("aria-valuenow", "9");
  });

  it("publishes invalid and describedby on the group", () => {
    render(<TimeField label="Start" hint="Local" error="Required" />);
    const group = screen.getByRole("group");
    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(group.getAttribute("aria-describedby")).toBeTruthy();
  });
});
