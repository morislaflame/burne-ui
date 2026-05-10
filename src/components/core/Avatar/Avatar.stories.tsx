import type { ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar, AvatarGroup } from "./Avatar";
import { PIN_IMAGE1, PIN_IMAGE2, PIN_IMAGE3, PIN_IMAGE4 } from "@/utils/mockImages";

const framedDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-8 p-10 text-brn-text"
      style={{ backgroundColor: "var(--brn-color-bg)" }}
    >
      <Story />
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [...framedDecorator],
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  name: "Размеры",
  render: () => (
    <div className="flex flex-row flex-wrap items-center gap-6">
      <Avatar size="s" label="Ada Lovelace">
        <Avatar.Image src={PIN_IMAGE1} alt="" loading="lazy" />
        <Avatar.Fallback />
      </Avatar>
      <Avatar size="m" label="Grace Hopper">
        <Avatar.Image src={PIN_IMAGE2} alt="" loading="lazy" />
        <Avatar.Fallback />
      </Avatar>
      <Avatar size="l" label="Katherine Johnson">
        <Avatar.Image src={PIN_IMAGE3} alt="" loading="lazy" />
        <Avatar.Fallback />
      </Avatar>
    </div>
  ),
};

export const FallbackOnly: Story = {
  name: "Только буква из label",
  render: () => (
    <div className="flex flex-row flex-wrap items-center gap-5">
      <Avatar size="s" label="Burne Team">
        <Avatar.Fallback />
      </Avatar>
      <Avatar size="m" label="Анна Каренина">
        <Avatar.Fallback />
      </Avatar>
      <Avatar size="l" label="北京">
        <Avatar.Fallback />
      </Avatar>
    </div>
  ),
};

export const BrokenImageUsesFallback: Story = {
  name: "Сбой изображения → фоллбек",
  render: () => (
    <Avatar size="m" label="Сергей Прокофьев">
      <Avatar.Image src="https://example.invalid/avatar-missing.png" alt="" />
      <Avatar.Fallback />
    </Avatar>
  ),
};

export const AvatarGroupStory: Story = {
  name: "Группа (наслоение + подъём anime.js)",
  render: () => (
    <AvatarGroup>
      <Avatar size="m" label="Один" nickname="echo_north">
        <Avatar.Image src={PIN_IMAGE1} alt="" loading="lazy" />
        <Avatar.Fallback />
      </Avatar>
      <Avatar size="m" label="Два" nickname="orbit_fox" tooltipVariant="info">
        <Avatar.Image src={PIN_IMAGE2} alt="" loading="lazy" />
        <Avatar.Fallback />
      </Avatar>
      <Avatar size="m" label="Три" nickname="vela_wave" tooltipVariant="success">
        <Avatar.Image src={PIN_IMAGE3} alt="" loading="lazy" />
        <Avatar.Fallback />
      </Avatar>
      <Avatar size="m" label="Четыре" nickname="rust_line" tooltipVariant="outline">
        <Avatar.Image src={PIN_IMAGE4} alt="" loading="lazy" />
        <Avatar.Fallback />
      </Avatar>
      <Avatar size="m" label="Плюс пять" nickname="+5" tooltipVariant="warning">
        <Avatar.Fallback />
      </Avatar>
    </AvatarGroup>
  ),
};

export const WithNicknameTooltip: Story = {
  name: "Никнейм в Tooltip",
  render: () => (
    <Avatar
      size="l"
      label="Амелия Кларк"
      nickname="starlight.muse"
      tooltipVariant="default"
      tooltipSize="m"
    >
      <Avatar.Image src={PIN_IMAGE1} alt="" loading="lazy" />
      <Avatar.Fallback />
    </Avatar>
  ),
};
