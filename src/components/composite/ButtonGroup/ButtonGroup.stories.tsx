import type { ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { IoEllipsisHorizontal, IoSearch, IoTrashOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";
import { Input } from "@/components/core/Input";
import { SearchInput } from "@/components/core/SearchInput";
import { ButtonGroup, ButtonGroupText } from "./index";

const framedDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
] as const;

const meta = {
  title: "Composite Components/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [...framedDecorator],
} satisfies Meta<typeof ButtonGroup>;

export default meta;

type Story = StoryObj<typeof ButtonGroup>;

/** Basic: text + buttons + «⋯» menu (`Dropdown` at end of group). */
export const Horizontal: Story = {
  render() {
    return (
      <ButtonGroup aria-label="Document actions">
        <ButtonGroupText>View</ButtonGroupText>
        <Button variant="secondary" ripple>List</Button>
        <Button variant="primary" groupSegment={{ orientation: "horizontal", position: "middle" }}>Grid</Button>
        <Dropdown>
          <Dropdown.Trigger asChild>
            <Button
              variant="outline"
              aria-label="Additional actions"
              iconOnly
              groupSegment={{ orientation: "horizontal", position: "last" }}
            >
              <IoEllipsisHorizontal aria-hidden className="icon-base" />
            </Button>
          </Dropdown.Trigger>
          <Dropdown.Popover>
            <Dropdown.Item value="dup" selection={false}>
              Duplicate
            </Dropdown.Item>
            <Dropdown.Item value="share" selection={false}>
              Share
            </Dropdown.Item>
            <Dropdown.Separator />
            <Dropdown.Item value="del" status="danger" selection={false}>
              Delete
            </Dropdown.Item>
          </Dropdown.Popover>
        </Dropdown>
      </ButtonGroup>
    );
  },
};

/** Buttons with gap — each with its own radius, no shared border. */
export const Segmented: Story = {
  render() {
    return (
      <ButtonGroup segmented aria-label="Actions" buttonSize="base">
        <Button variant="outline">Cancel</Button>
        <Button variant="outline">Draft</Button>
        <Button variant="primary">Save</Button>
      </ButtonGroup>
    );
  },
};

export const ClickInteraction: Story = {
  name: "Interaction: click",
  render() {
    return (
      <ButtonGroup segmented aria-label="Actions" buttonSize="base">
        <Button variant="outline">Cancel</Button>
        <Button variant="outline">Draft</Button>
        <Button variant="primary">Save</Button>
      </ButtonGroup>
    );
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await expect(canvas.getByRole("button", { name: "Save" })).toHaveFocus();
  },
};

export const Vertical: Story = {
  render() {
    return (
      <ButtonGroup orientation="vertical" buttonSize="base" aria-label="Vertical group">
        <ButtonGroupText>Sorting</ButtonGroupText>
        <Button variant="outline">By date</Button>
        <Button variant="outline">By name</Button>
        <Button variant="primary" status="danger" icon={<IoTrashOutline />}>
          Delete
        </Button>
      </ButtonGroup>
    );
  },
};

/** Search field + icon: shared edge between `Input` and `Button` without radius. */
export const ToolbarFusedInput: Story = {
  render() {
    return (
      <div className="max-w-lg">
        <ButtonGroup aria-label="Search">
          <Input.Control placeholder="Search..." aria-label="Search query" variant="outline" />
          <Button variant="outline" aria-label="Search" className="min-w-fit min-h-fit">
            <IoSearch aria-hidden className="icon-base" />
          </Button>
        </ButtonGroup>
      </div>
    );
  },
};

/** Row: SearchInput and separate group (`SearchInput` with inline radius does not attach to group without extra work). */
export const ToolbarWithSearchInputRow: Story = {
  render() {
    return (
      <div className="flex min-w-[min(100%,40rem)] max-w-[min(100%,48rem)] flex-wrap items-center justify-center gap-small">
        <SearchInput defaultExpanded expandedWidth={280} placeholder="Search everywhere…" aria-label="Search sections" />
        <ButtonGroup aria-label="View" buttonSize="base">
          <ButtonGroupText>Table</ButtonGroupText>
          <Button variant="outline">Cards</Button>
          <Button variant="outline">List</Button>
          <Button variant="primary">Save</Button>
        </ButtonGroup>
      </div>
    );
  },
};

/** Multiple independent groups in one row with spacing between blocks. */
export const MultipleGroupsInRow: Story = {
  render() {
    return (
      <div className="flex flex-wrap items-center justify-center gap-large">
        <ButtonGroup aria-label="Format" buttonSize="small">
          <ButtonGroupText>Format</ButtonGroupText>
          <Button size="small" variant="outline">
            JSON
          </Button>
          <Button size="small" variant="outline">
            YAML
          </Button>
          <Button size="small" variant="primary">
            Export
          </Button>
        </ButtonGroup>
        <ButtonGroup aria-label="View" buttonSize="small">
          <ButtonGroupText>View</ButtonGroupText>
          <Button size="small" variant="outline">
            A
          </Button>
          <Button size="small" variant="outline">
            B
          </Button>
        </ButtonGroup>
        <ButtonGroup aria-label="Status" buttonSize="small">
          <Button size="small" variant="primary" status="danger" icon={<IoTrashOutline />}>
            Reset
          </Button>
        </ButtonGroup>
      </div>
    );
  },
};
