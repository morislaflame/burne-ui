import type { ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  DualApiStoryPanel,
  DualApiStoryPanels,
} from "@/components/core/utils/dualApiStoryChrome";
import { dualApiStorySource } from "@/components/core/utils/dualApiStorySource";
import { PIN_IMAGE1, PIN_IMAGE2, PIN_IMAGE3, PIN_IMAGE4 } from "@/utils/mockImages";

import { Avatar, AvatarGroup } from ".";

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
  title: "Core Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Аватар пользователя. **Simple** — `label`, `src`, `nickname` на root; **Compound** — `<Avatar.Image>` / `<Avatar.Fallback>`.",
      },
    },
  },
  decorators: [...framedDecorator],
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Simple и Compound",
  ...dualApiStorySource,
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple — props на &lt;Avatar&gt;">
        <Avatar
          size="base"
          label="Grace Hopper"
          src={PIN_IMAGE2}
          alt=""
          loading="lazy"
          nickname="grace_h"
        />
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound — children">
        <Avatar size="base" label="Grace Hopper" nickname="grace_h">
          <Avatar.Image src={PIN_IMAGE2} alt="" loading="lazy" />
          <Avatar.Fallback />
        </Avatar>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

export const Sizes: Story = {
  name: "Размеры",
  render: () => (
    <div className="flex flex-row flex-wrap items-center gap-xlarge">
      <Avatar size="small" label="Ada Lovelace" src={PIN_IMAGE1} alt="" loading="lazy" />
      <Avatar size="base" label="Grace Hopper" src={PIN_IMAGE2} alt="" loading="lazy" />
      <Avatar size="mid" label="Alan Turing" src={PIN_IMAGE4} alt="" loading="lazy" />
      <Avatar size="large" label="Katherine Johnson" src={PIN_IMAGE3} alt="" loading="lazy" />
    </div>
  ),
};

export const FallbackOnly: Story = {
  name: "Только буква из label",
  render: () => (
    <div className="flex flex-row flex-wrap items-center gap-large">
      <Avatar size="small" label="Burne Team" />
      <Avatar size="base" label="Анна Каренина" />
      <Avatar size="large" label="北京" />
    </div>
  ),
};

export const BrokenImageUsesFallback: Story = {
  name: "Сбой изображения → фоллбек",
  render: () => (
    <Avatar
      size="base"
      label="Сергей Прокофьев"
      src="https://example.invalid/avatar-missing.png"
      alt=""
    />
  ),
};

export const AvatarGroupStory: Story = {
  name: "Группа (наслоение + подъём GSAP)",
  render: () => (
    <AvatarGroup>
      <Avatar size="base" label="Один" nickname="echo_north" src={PIN_IMAGE1} alt="" loading="lazy" />
      <Avatar
        size="base"
        label="Два"
        nickname="orbit_fox"
        tooltipVariant="info"
        src={PIN_IMAGE2}
        alt=""
        loading="lazy"
      />
      <Avatar
        size="base"
        label="Три"
        nickname="vela_wave"
        tooltipVariant="success"
        src={PIN_IMAGE3}
        alt=""
        loading="lazy"
      />
      <Avatar
        size="base"
        label="Четыре"
        nickname="rust_line"
        tooltipVariant="outline"
        src={PIN_IMAGE4}
        alt=""
        loading="lazy"
      />
      <Avatar size="base" label="Плюс пять" nickname="+5" tooltipVariant="warning" />
    </AvatarGroup>
  ),
};

export const WithNicknameTooltip: Story = {
  name: "Никнейм в Tooltip",
  render: () => (
    <Avatar
      size="large"
      label="Амелия Кларк"
      nickname="starlight.muse"
      tooltipVariant="default"
      tooltipSize="base"
      src={PIN_IMAGE1}
      alt=""
      loading="lazy"
    />
  ),
};

export const CompoundCustomFallback: Story = {
  name: "Compound — кастомный Fallback",
  render: () => (
    <Avatar size="base" label="Design System">
      <Avatar.Fallback>DS</Avatar.Fallback>
    </Avatar>
  ),
};
