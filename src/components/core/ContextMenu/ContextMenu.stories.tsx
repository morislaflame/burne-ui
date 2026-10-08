import type { ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { ContextMenuActionsDemo } from "../../../../playground/showcase/demos/contextMenu/ContextMenuActions.demo";
import { ContextMenuAsChildDemo } from "../../../../playground/showcase/demos/contextMenu/ContextMenuAsChild.demo";
import { ContextMenuClassNamesDemo } from "../../../../playground/showcase/demos/contextMenu/ContextMenuClassNames.demo";
import { ContextMenuDefaultDemo } from "../../../../playground/showcase/demos/contextMenu/ContextMenuDefault.demo";
import { ContextMenuSelectionDemo } from "../../../../playground/showcase/demos/contextMenu/ContextMenuSelection.demo";
import { ContextMenuSideDemo } from "../../../../playground/showcase/demos/contextMenu/ContextMenuSide.demo";
import { ContextMenuSubIconDemo } from "../../../../playground/showcase/demos/contextMenu/ContextMenuSubIcon.demo";
import { ContextMenuMotionControllerGalleryDemo } from "../../../../playground/showcase/demos/contextMenu/motionController/gallery";
import { ContextMenuSlotMotionGalleryDemo } from "../../../../playground/showcase/demos/contextMenu/slotMotion/gallery";

const framedDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[20rem] w-full flex-col items-center justify-center gap-2xlarge p-2xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
];

const meta = {
  title: "Core Components/ContextMenu",
  decorators: framedDecorator,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <ContextMenuDefaultDemo /> };
export const FileActions: Story = { render: () => <ContextMenuActionsDemo /> };
export const Selection: Story = { render: () => <ContextMenuSelectionDemo /> };
export const SlotMotionGallery: Story = { render: () => <ContextMenuSlotMotionGalleryDemo /> };
export const MotionControllerGallery: Story = { render: () => <ContextMenuMotionControllerGalleryDemo /> };
export const SubTriggerIcon: Story = { render: () => <ContextMenuSubIconDemo /> };
export const ContentSide: Story = { render: () => <ContextMenuSideDemo /> };
export const AsChild: Story = { render: () => <ContextMenuAsChildDemo /> };
export const ClassNames: Story = { render: () => <ContextMenuClassNamesDemo /> };
