import { useState, type ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import {
  IoBookmarkOutline,
  IoGridOutline,
  IoHeartOutline,
  IoListOutline,
  IoTextOutline,
} from "react-icons/io5";

import { Text } from "@/components/core/Text";
import { ToggleButton } from "@/components/core/ToggleButton";

import { ToggleButtonGroup } from "./index";

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
  title: "Composite Components/ToggleButtonGroup",
  component: ToggleButtonGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Группа `ToggleButton`: по умолчанию склеена как `ButtonGroup`; `separated` — с зазором. `type=\"single\"` — только один выбран (radiogroup). Горизонтальная и вертикальная ориентация, `disabled` на группе.",
      },
    },
  },
  decorators: [...framedDecorator],
} satisfies Meta<typeof ToggleButtonGroup>;

export default meta;

type Story = StoryObj<typeof ToggleButtonGroup>;

export const ConnectedHorizontal: Story = {
  name: "Склеенная (горизонталь)",
  render: () => (
    <ToggleButtonGroup aria-label="Фильтр формата" defaultValue={["bold"]}>
      <ToggleButton value="bold" leftIcon={<IoTextOutline aria-hidden />}>
        Жирный
      </ToggleButton>
      <ToggleButton value="italic">Курсив</ToggleButton>
      <ToggleButton value="underline">Подчёркнутый</ToggleButton>
    </ToggleButtonGroup>
  ),
};

export const ConnectedVertical: Story = {
  name: "Склеенная (вертикаль)",
  render: () => (
    <ToggleButtonGroup orientation="vertical" aria-label="Вид списка" defaultValue={["list"]}>
      <ToggleButton value="list" leftIcon={<IoListOutline aria-hidden />}>
        Список
      </ToggleButton>
      <ToggleButton value="grid" leftIcon={<IoGridOutline aria-hidden />}>
        Сетка
      </ToggleButton>
    </ToggleButtonGroup>
  ),
};

export const Separated: Story = {
  name: "Separated",
  render: () => (
    <ToggleButtonGroup separated aria-label="Теги" defaultValue={["design"]}>
      <ToggleButton value="design">Design</ToggleButton>
      <ToggleButton value="dev">Dev</ToggleButton>
      <ToggleButton value="qa">QA</ToggleButton>
    </ToggleButtonGroup>
  ),
};

export const SingleSelection: Story = {
  name: "Single selection",
  render: function SingleSelectDemo() {
    const [value, setValue] = useState("list");
    return (
      <div className="flex flex-col items-center gap-mid">
        <ToggleButtonGroup
          type="single"
          value={value}
          onValueChange={(v) => setValue(v as string)}
          aria-label="Режим отображения"
        >
          <ToggleButton value="list" leftIcon={<IoListOutline aria-hidden />}>
            Список
          </ToggleButton>
          <ToggleButton value="grid" leftIcon={<IoGridOutline aria-hidden />}>
            Сетка
          </ToggleButton>
        </ToggleButtonGroup>
        <Text as="p" variant="small" className="text-muted">
          value=&quot;{value}&quot;
        </Text>
      </div>
    );
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("radio", { name: "Сетка" }));
    await expect(canvas.getByText('value="grid"')).toBeInTheDocument();
  },
};

export const SingleSeparated: Story = {
  name: "Single + separated",
  render: () => (
    <ToggleButtonGroup type="single" separated defaultValue="like" aria-label="Реакции">
      <ToggleButton value="like" leftIcon={<IoHeartOutline aria-hidden />}>
        Like
      </ToggleButton>
      <ToggleButton value="save" leftIcon={<IoBookmarkOutline aria-hidden />}>
        Save
      </ToggleButton>
    </ToggleButtonGroup>
  ),
};

export const Disabled: Story = {
  name: "Disabled",
  render: () => (
    <ToggleButtonGroup disabled defaultValue={["a"]} aria-label="Отключённая группа">
      <ToggleButton value="a">A</ToggleButton>
      <ToggleButton value="b">B</ToggleButton>
      <ToggleButton value="c">C</ToggleButton>
    </ToggleButtonGroup>
  ),
};

export const Variants: Story = {
  name: "Варианты",
  render: () => (
    <div className="flex flex-col items-center gap-large">
      {(["default", "outline", "ghost"] as const).map((variant) => (
        <ToggleButtonGroup key={variant} variant={variant} defaultValue={["one"]} aria-label={variant}>
          <ToggleButton value="one">{variant} 1</ToggleButton>
          <ToggleButton value="two">{variant} 2</ToggleButton>
        </ToggleButtonGroup>
      ))}
    </div>
  ),
};
