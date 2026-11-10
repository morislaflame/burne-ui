import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { render } from "@/__tests__/helpers";
import { Checkbox } from "@/components/core/Checkbox";
import { Dropdown } from "@/components/core/Dropdown";
import { Radio } from "@/components/core/Radio";

import { SelectionIndicator } from ".";

describe("SelectionIndicator icon", () => {
  it("renders the icon prop", () => {
    render(<SelectionIndicator selected check icon={<span>star</span>} />);
    expect(screen.getByText("star")).toBeInTheDocument();
  });

  it("does not turn a loose child into the icon", () => {
    render(
      <SelectionIndicator selected check>
        <span>loose</span>
      </SelectionIndicator>,
    );
    expect(screen.queryByText("loose")).not.toBeInTheDocument();
  });

  it("keeps Mark children as the mark", () => {
    render(
      <SelectionIndicator selected check>
        <SelectionIndicator.Mark>
          <span>mark</span>
        </SelectionIndicator.Mark>
      </SelectionIndicator>,
    );
    expect(screen.getByText("mark")).toBeInTheDocument();
    expect(screen.queryByText("loose")).not.toBeInTheDocument();
  });

  it("forwards icon through Checkbox, Radio, and Dropdown indicators", async () => {
    const { user } = render(
      <>
        <Checkbox defaultChecked label="Box">
          <Checkbox.Control>
            <Checkbox.Indicator icon={<span>box-icon</span>} />
          </Checkbox.Control>
        </Checkbox>
        <Radio name="pick" value="a" defaultChecked label="Dot">
          <Radio.Control>
            <Radio.Indicator icon={<span>radio-icon</span>} />
          </Radio.Control>
        </Radio>
        <Dropdown>
          <Dropdown.Trigger>Open</Dropdown.Trigger>
          <Dropdown.Popover>
            <Dropdown.Item value="a">
              <Dropdown.ItemIndicator icon={<span>menu-icon</span>} />
              <Dropdown.ItemLabel>Alpha</Dropdown.ItemLabel>
            </Dropdown.Item>
          </Dropdown.Popover>
        </Dropdown>
      </>,
    );
    expect(screen.getByText("box-icon")).toBeInTheDocument();
    expect(screen.getByText("radio-icon")).toBeInTheDocument();
    const trigger = screen.getByRole("button", { name: "Open" });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByText("menu-icon")).toBeInTheDocument();
  });
});
