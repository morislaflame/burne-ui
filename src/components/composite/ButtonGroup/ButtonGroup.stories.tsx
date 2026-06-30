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

/** Базово: текст + кнопки + меню «⋯» (`Dropdown` в конце группы). */
export const Horizontal: Story = {
  render() {
    return (
      <ButtonGroup aria-label="Действия с документом">
        <ButtonGroupText>Вид</ButtonGroupText>
        <Button variant="secondary" ripple>Список</Button>
        <Button variant="primary" groupSegment={{ orientation: "horizontal", position: "middle" }}>Сетка</Button>
        <Dropdown>
          <Dropdown.Trigger asChild>
            <Button
              variant="outline"
              aria-label="Дополнительные действия"
              iconOnly
              groupSegment={{ orientation: "horizontal", position: "last" }}
            >
              <IoEllipsisHorizontal aria-hidden className="icon-base" />
            </Button>
          </Dropdown.Trigger>
          <Dropdown.Popover>
            <Dropdown.Item value="dup" selection={false}>
              Дублировать
            </Dropdown.Item>
            <Dropdown.Item value="share" selection={false}>
              Поделиться
            </Dropdown.Item>
            <Dropdown.Separator />
            <Dropdown.Item value="del" variant="danger" selection={false}>
              Удалить
            </Dropdown.Item>
          </Dropdown.Popover>
        </Dropdown>
      </ButtonGroup>
    );
  },
};

/** Кнопки с зазором — каждая со своим скруглением, без общей границы. */
export const Segmented: Story = {
  render() {
    return (
      <ButtonGroup segmented aria-label="Действия" buttonSize="base">
        <Button variant="outline">Отмена</Button>
        <Button variant="outline">Черновик</Button>
        <Button variant="primary">Сохранить</Button>
      </ButtonGroup>
    );
  },
};

export const ClickInteraction: Story = {
  name: "Interaction: клик",
  render() {
    return (
      <ButtonGroup segmented aria-label="Действия" buttonSize="base">
        <Button variant="outline">Отмена</Button>
        <Button variant="outline">Черновик</Button>
        <Button variant="primary">Сохранить</Button>
      </ButtonGroup>
    );
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Сохранить" }));
    await expect(canvas.getByRole("button", { name: "Сохранить" })).toHaveFocus();
  },
};

export const Vertical: Story = {
  render() {
    return (
      <ButtonGroup orientation="vertical" buttonSize="base" aria-label="Вертикальная группа">
        <ButtonGroupText>Сортировка</ButtonGroupText>
        <Button variant="outline">По дате</Button>
        <Button variant="outline">По имени</Button>
        <Button variant="primary" status="danger" leftIcon={<IoTrashOutline />}>
          Удалить
        </Button>
      </ButtonGroup>
    );
  },
};

/** Поле поиска + иконка: общий край между `Input` и `Button` без скругления. */
export const ToolbarFusedInput: Story = {
  render() {
    return (
      <div className="max-w-lg">
        <ButtonGroup aria-label="Поиск">
          <Input.Control placeholder="Search..." aria-label="Search query" variant="outline" />
          <Button variant="outline" aria-label="Search" className="min-w-fit min-h-fit">
            <IoSearch aria-hidden className="icon-base" />
          </Button>
        </ButtonGroup>
      </div>
    );
  },
};

/** Строка: SearchInput и отдельная группа (`SearchInput` с инлайновым радиусом не клеится в группу без доработки). */
export const ToolbarWithSearchInputRow: Story = {
  render() {
    return (
      <div className="flex min-w-[min(100%,40rem)] max-w-[min(100%,48rem)] flex-wrap items-center justify-center gap-small">
        <SearchInput defaultExpanded expandedWidth={280} placeholder="Везде искать…" aria-label="Поиск по разделам" />
        <ButtonGroup aria-label="Представление" buttonSize="base">
          <ButtonGroupText>Таблица</ButtonGroupText>
          <Button variant="outline">Карты</Button>
          <Button variant="outline">Список</Button>
          <Button variant="primary">Сохранить</Button>
        </ButtonGroup>
      </div>
    );
  },
};

/** Несколько независимых групп в одном ряду с отступами между блоками. */
export const MultipleGroupsInRow: Story = {
  render() {
    return (
      <div className="flex flex-wrap items-center justify-center gap-large">
        <ButtonGroup aria-label="Формат" buttonSize="small">
          <ButtonGroupText>Формат</ButtonGroupText>
          <Button size="small" variant="outline">
            JSON
          </Button>
          <Button size="small" variant="outline">
            YAML
          </Button>
          <Button size="small" variant="primary">
            Экспорт
          </Button>
        </ButtonGroup>
        <ButtonGroup aria-label="Вид" buttonSize="small">
          <ButtonGroupText>Вид</ButtonGroupText>
          <Button size="small" variant="outline">
            A
          </Button>
          <Button size="small" variant="outline">
            B
          </Button>
        </ButtonGroup>
        <ButtonGroup aria-label="Статус" buttonSize="small">
          <Button size="small" variant="primary" status="danger" leftIcon={<IoTrashOutline />}>
            Сброс
          </Button>
        </ButtonGroup>
      </div>
    );
  },
};
