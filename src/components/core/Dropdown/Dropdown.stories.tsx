import type { ComponentType } from "react";
import { useLayoutEffect, useRef, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor } from "storybook/test";
import { IoArrowForward, IoChevronForward, IoGlobeOutline, IoLogOutOutline, IoPeopleOutline, IoSettingsOutline } from "react-icons/io5";

import { Avatar } from "@/components/core/Avatar";
import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";
import { OptionListItemLayoutShowcase } from "@/stories-utils/optionListItemStoryLayouts";
import { PIN_IMAGE2 } from "@/stories-utils/mockImages";

import { Dropdown } from ".";

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

const lightDecorator = [
  (Story: ComponentType) => (
    <div
      data-theme="light"
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Dropdown",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Compound API: `Dropdown.Trigger`, `Dropdown.Popover`, `Dropdown.Item` with `<Dropdown.ItemIndicator />`, `<Dropdown.ItemLabel>`, `<Dropdown.ItemHint>`, `<Dropdown.ItemIcon>`. Item layout — grid like Radio/Checkbox: indicator | label+hint | icon. Panel — via `Popover`.",
      },
    },
  },
  decorators: [...framedDecorator],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const SingleSelect: Story = {
  name: "Single selection",
  render() {
    return (
      <Dropdown selectionIndicator defaultValue="ru">
        <Dropdown.Trigger asChild>
          <Button variant="outline">Interface language</Button>
        </Dropdown.Trigger>
        <Dropdown.Popover>
          <Dropdown.Group>
            <Dropdown.Label>Select language</Dropdown.Label>
            <Dropdown.Item value="ru">
              <Dropdown.ItemIndicator />
              <Dropdown.ItemLabel>Russian</Dropdown.ItemLabel>
              <Dropdown.ItemHint>Cyrillic, default locale</Dropdown.ItemHint>
            </Dropdown.Item>
            <Dropdown.Item value="en">
              <Dropdown.ItemIndicator />
              <Dropdown.ItemLabel>English</Dropdown.ItemLabel>
              <Dropdown.ItemHint>Latin script</Dropdown.ItemHint>
              <Dropdown.ItemIcon>
                <IoGlobeOutline aria-hidden />
              </Dropdown.ItemIcon>
            </Dropdown.Item>
            <Dropdown.Item value="de" disabled>
              <Dropdown.ItemIndicator />
              <Dropdown.ItemLabel>Deutsch</Dropdown.ItemLabel>
              <Dropdown.ItemHint>Coming soon</Dropdown.ItemHint>
            </Dropdown.Item>
          </Dropdown.Group>
          <Dropdown.Separator />
          <Dropdown.Group>
            <Dropdown.Label>System</Dropdown.Label>
            <Dropdown.Item value="sys" selection={false}>
              <Dropdown.ItemLabel>Settings</Dropdown.ItemLabel>
              <Dropdown.ItemIcon>⌘</Dropdown.ItemIcon>
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Popover>
      </Dropdown>
    );
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Interface language" }));
    await expect(await screen.findByRole("menu")).toBeVisible();
    await userEvent.click(screen.getByRole("menuitemradio", { name: /English/i }));
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  },
};

export const MultiSelect: Story = {
  name: "Multi-select",
  render() {
    return (
      <Dropdown multiple defaultValue={["a", "c"]}>
        <Dropdown.Trigger asChild>
          <Button variant="ghost">Table columns</Button>
        </Dropdown.Trigger>
        <Dropdown.Popover className="max-w-xs">
          <Dropdown.Group>
            <Dropdown.Label>Visibility</Dropdown.Label>
            <Dropdown.Item value="a">
              <Dropdown.ItemIndicator />
              <Dropdown.ItemLabel>User</Dropdown.ItemLabel>
              <Dropdown.ItemHint>Name and avatar</Dropdown.ItemHint>
            </Dropdown.Item>
            <Dropdown.Item value="b">
              <Dropdown.ItemIndicator />
              <Dropdown.ItemLabel>Country</Dropdown.ItemLabel>
              <Dropdown.ItemHint>ISO code</Dropdown.ItemHint>
            </Dropdown.Item>
            <Dropdown.Item value="c">
              <Dropdown.ItemIndicator />
              <Dropdown.ItemLabel>Status</Dropdown.ItemLabel>
            </Dropdown.Item>
          </Dropdown.Group>
          <Dropdown.Separator />
          <Dropdown.Group>
            <Dropdown.Item value="d" selection={false}>
              <Dropdown.ItemLabel>Actions</Dropdown.ItemLabel>
              <Dropdown.ItemIcon>
                <IoChevronForward aria-hidden />
              </Dropdown.ItemIcon>
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Popover>
      </Dropdown>
    );
  },
};

export const GroupsWithDifferentIndicators: Story = {
  name: "Groups: indicator in one only",
  render() {
    return (
      <Dropdown defaultValue="a">
        <Dropdown.Trigger asChild>
          <Button variant="outline">Mixed menu</Button>
        </Dropdown.Trigger>
        <Dropdown.Popover className="max-w-xs">
          <Dropdown.Group selectionIndicator>
            <Dropdown.Label>With indicator</Dropdown.Label>
            <Dropdown.Item value="a">
              <Dropdown.ItemIndicator />
              <Dropdown.ItemLabel>Option A</Dropdown.ItemLabel>
            </Dropdown.Item>
            <Dropdown.Item value="b">
              <Dropdown.ItemIndicator />
              <Dropdown.ItemLabel>Option B</Dropdown.ItemLabel>
            </Dropdown.Item>
          </Dropdown.Group>
          <Dropdown.Separator />
          <Dropdown.Group selectionIndicator={false}>
            <Dropdown.Label>Without indicator (same single selection)</Dropdown.Label>
            <Dropdown.Item value="c">
              <Dropdown.ItemLabel>Option C</Dropdown.ItemLabel>
            </Dropdown.Item>
            <Dropdown.Item value="d">
              <Dropdown.ItemLabel>Option D</Dropdown.ItemLabel>
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Popover>
      </Dropdown>
    );
  },
};

export const ItemVariants: Story = {
  name: "Item variants (semantics)",
  render() {
    return (
      <Dropdown>
        <Dropdown.Trigger asChild>
          <Button variant="outline">Status actions</Button>
        </Dropdown.Trigger>
        <Dropdown.Popover>
          <Dropdown.Group>
            <Dropdown.Label>Messages</Dropdown.Label>
            <Dropdown.Item value="ok" status="success" selection={false}>
              <Dropdown.ItemLabel>Success</Dropdown.ItemLabel>
              <Dropdown.ItemHint>Operation succeeded</Dropdown.ItemHint>
            </Dropdown.Item>
            <Dropdown.Item value="warn" status="warning" selection={false}>
              <Dropdown.ItemLabel>Warning</Dropdown.ItemLabel>
              <Dropdown.ItemHint>Review data</Dropdown.ItemHint>
            </Dropdown.Item>
            <Dropdown.Item value="inf" status="info" selection={false}>
              <Dropdown.ItemLabel>Help</Dropdown.ItemLabel>
            </Dropdown.Item>
            <Dropdown.Item value="bad" status="danger" selection={false}>
              <Dropdown.ItemLabel>Delete permanently</Dropdown.ItemLabel>
              <Dropdown.ItemHint>No undo</Dropdown.ItemHint>
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Popover>
      </Dropdown>
    );
  },
};

export const WithSubmenu: Story = {
  name: "Nested menu (hover)",
  render() {
    return (
      <Dropdown>
        <Dropdown.Trigger asChild>
          <Button variant="outline">Menu</Button>
        </Dropdown.Trigger>
        <Dropdown.Popover>
          <Dropdown.Group>
            <Dropdown.Label>Actions</Dropdown.Label>
            <Dropdown.Item value="new" selection={false}>
              <Dropdown.ItemLabel>New document</Dropdown.ItemLabel>
            </Dropdown.Item>
            <Dropdown.Sub>
              <Dropdown.SubTrigger>Invite users</Dropdown.SubTrigger>
              <Dropdown.SubContent>
                <Dropdown.Item value="email" selection={false}>
                  <Dropdown.ItemLabel>Email</Dropdown.ItemLabel>
                </Dropdown.Item>
                <Dropdown.Item value="msg" selection={false}>
                  <Dropdown.ItemLabel>Message</Dropdown.ItemLabel>
                </Dropdown.Item>
                <Dropdown.Separator />
                <Dropdown.Item value="more" selection={false}>
                  <Dropdown.ItemLabel>More…</Dropdown.ItemLabel>
                </Dropdown.Item>
              </Dropdown.SubContent>
            </Dropdown.Sub>
          </Dropdown.Group>
        </Dropdown.Popover>
      </Dropdown>
    );
  },
};

export const CustomSubTriggerIcon: Story = {
  name: "Custom SubTrigger icon",
  parameters: {
    docs: {
      description: {
        story:
          "`Dropdown.SubTrigger` `icon` replaces the default chevron. Pass `null` to hide.",
      },
    },
  },
  render() {
    return (
      <Dropdown>
        <Dropdown.Trigger asChild>
          <Button variant="outline">Menu</Button>
        </Dropdown.Trigger>
        <Dropdown.Popover>
          <Dropdown.Group>
            <Dropdown.Sub>
              <Dropdown.SubTrigger
                icon={<IoArrowForward aria-hidden className="icon-xsmall text-primary" />}
              >
                Invite users
              </Dropdown.SubTrigger>
              <Dropdown.SubContent>
                <Dropdown.Item value="email" selection={false}>
                  <Dropdown.ItemLabel>Email</Dropdown.ItemLabel>
                </Dropdown.Item>
                <Dropdown.Item value="msg" selection={false}>
                  <Dropdown.ItemLabel>Message</Dropdown.ItemLabel>
                </Dropdown.Item>
              </Dropdown.SubContent>
            </Dropdown.Sub>
          </Dropdown.Group>
        </Dropdown.Popover>
      </Dropdown>
    );
  },
};

export const WithSelectionIndicator: Story = {
  name: "With selection indicator",
  render() {
    return (
      <Dropdown selectionIndicator defaultValue="copy">
        <Dropdown.Trigger asChild>
          <Button variant="secondary">Action</Button>
        </Dropdown.Trigger>
        <Dropdown.Popover>
          <Dropdown.Group>
            <Dropdown.Item value="copy">
              <Dropdown.ItemIndicator />
              <Dropdown.ItemLabel>Copy</Dropdown.ItemLabel>
            </Dropdown.Item>
            <Dropdown.Item value="move">
              <Dropdown.ItemIndicator />
              <Dropdown.ItemLabel>Move</Dropdown.ItemLabel>
            </Dropdown.Item>
          </Dropdown.Group>
          <Dropdown.Separator />
          <Dropdown.Group>
            <Dropdown.Item value="del" status="danger" selection={false}>
              <Dropdown.ItemLabel>Delete</Dropdown.ItemLabel>
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Popover>
      </Dropdown>
    );
  },
};

export const CustomItemIndicator: Story = {
  name: "ItemIndicator (compound)",
  render() {
    return (
      <Dropdown multiple defaultValue={["ru"]}>
        <Dropdown.Trigger asChild>
          <Button variant="outline">Languages</Button>
        </Dropdown.Trigger>
        <Dropdown.Popover>
          <Dropdown.Group>
            <Dropdown.Label>With secondary variant</Dropdown.Label>
            <Dropdown.Item value="ru">
              <Dropdown.ItemIndicator variant="secondary" />
              <Dropdown.ItemLabel>Russian</Dropdown.ItemLabel>
            </Dropdown.Item>
            <Dropdown.Item value="en">
              <Dropdown.ItemIndicator variant="outline" />
              <Dropdown.ItemLabel>English</Dropdown.ItemLabel>
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Popover>
      </Dropdown>
    );
  },
};

export const CustomItemParts: Story = {
  name: "Compound — slot layout",
  render() {
    return (
      <Dropdown selectionIndicator={false} defaultValue="full-grid">
        <Dropdown.Trigger asChild>
          <Button variant="outline">Slot layout</Button>
        </Dropdown.Trigger>
        <Dropdown.Popover className="max-w-md">
          <Dropdown.Group>
            <Dropdown.Label>How the grid changes</Dropdown.Label>
            <OptionListItemLayoutShowcase
              Item={Dropdown.Item}
              ItemLabel={Dropdown.ItemLabel}
              ItemHint={Dropdown.ItemHint}
              ItemIcon={Dropdown.ItemIcon}
              ItemIndicator={Dropdown.ItemIndicator}
            />
          </Dropdown.Group>
        </Dropdown.Popover>
      </Dropdown>
    );
  },
};

export const CustomAvatarTrigger: Story = {
  name: "Custom trigger (Avatar)",
  render() {
    return (
      <Dropdown>
        <Dropdown.Trigger asChild>
          <button
            type="button"
            className="rounded-full outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Jane Doe user menu"
          >
            <Avatar size="base" label="Jane Doe">
              <Avatar.Image src={PIN_IMAGE2} alt="" loading="lazy" />
              <Avatar.Fallback>JD</Avatar.Fallback>
            </Avatar>
          </button>
        </Dropdown.Trigger>
        <Dropdown.Popover className="min-w-[14rem]">
          <div role="presentation" className="pb-plus">
            <div className="flex items-center gap-small">
              <Avatar size="small" label="Jane Doe">
                <Avatar.Image src={PIN_IMAGE2} alt="" loading="lazy" />
                <Avatar.Fallback>JD</Avatar.Fallback>
              </Avatar>
              <div className="flex min-w-0 flex-col gap-px">
                <Text as="p" variant="base" className="font-medium leading-tight">
                  Jane Doe
                </Text>
                <Text as="p" variant="tools" className="text-muted leading-tight">
                  jane@example.com
                </Text>
              </div>
            </div>
          </div>
          <Dropdown.Separator />
          <Dropdown.Group>
            <Dropdown.Item value="dashboard" selection={false}>
              <Dropdown.ItemLabel>Dashboard</Dropdown.ItemLabel>
            </Dropdown.Item>
            <Dropdown.Item value="profile" selection={false}>
              <Dropdown.ItemLabel>Profile</Dropdown.ItemLabel>
            </Dropdown.Item>
            <Dropdown.Item value="settings" selection={false}>
              <Dropdown.ItemLabel>Settings</Dropdown.ItemLabel>
              <Dropdown.ItemIcon>
                <IoSettingsOutline aria-hidden className="opacity-70" />
              </Dropdown.ItemIcon>
            </Dropdown.Item>
            <Dropdown.Item value="team" selection={false}>
              <Dropdown.ItemLabel>Create Team</Dropdown.ItemLabel>
              <Dropdown.ItemIcon>
                <IoPeopleOutline aria-hidden className="opacity-70" />
              </Dropdown.ItemIcon>
            </Dropdown.Item>
            <Dropdown.Item value="logout" status="danger" selection={false}>
              <Dropdown.ItemLabel>Log Out</Dropdown.ItemLabel>
              <Dropdown.ItemIcon>
                <IoLogOutOutline aria-hidden />
              </Dropdown.ItemIcon>
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Popover>
      </Dropdown>
    );
  },
};

export const OnLightTheme: Story = {
  name: "Light theme",
  decorators: [...lightDecorator],
  render() {
    return (
      <Dropdown multiple defaultValue={["x"]}>
        <Dropdown.Trigger asChild>
          <Button variant="outline">Multi-select</Button>
        </Dropdown.Trigger>
        <Dropdown.Popover>
          <Dropdown.Group>
            <Dropdown.Label>Tags</Dropdown.Label>
            <Dropdown.Item value="x">
              <Dropdown.ItemIndicator />
              <Dropdown.ItemLabel>Alpha</Dropdown.ItemLabel>
            </Dropdown.Item>
            <Dropdown.Item value="y">
              <Dropdown.ItemIndicator />
              <Dropdown.ItemLabel>Beta</Dropdown.ItemLabel>
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Popover>
      </Dropdown>
    );
  },
};

export const LinkItems: Story = {
  name: "Link items (href)",
  render() {
    return (
      <Dropdown>
        <Dropdown.Trigger asChild>
          <Button variant="outline">Navigation</Button>
        </Dropdown.Trigger>
        <Dropdown.Popover aria-label="Sections">
          <Dropdown.Item href="/catalog" selection={false}>
            <Dropdown.ItemLabel>Catalog</Dropdown.ItemLabel>
          </Dropdown.Item>
          <Dropdown.Item href="/docs" selection={false}>
            <Dropdown.ItemLabel>Documentation</Dropdown.ItemLabel>
          </Dropdown.Item>
          <Dropdown.Item value="settings" selection={false}>
            <Dropdown.ItemLabel>Settings (button)</Dropdown.ItemLabel>
          </Dropdown.Item>
        </Dropdown.Popover>
      </Dropdown>
    );
  },
};

export const Accessibility: Story = {
  name: "Accessibility",
  render() {
    return (
      <div className="flex max-w-md flex-col gap-mid text-left">
        <p className="text-sm text-muted">
          Trigger: <code className="text-primary">aria-expanded</code>,{" "}
          <code className="text-primary">aria-controls</code>. Menu: arrows, Home/End, Escape
          returns focus to trigger. Group with <code className="text-primary">Dropdown.Label</code>{" "}
          — <code className="text-primary">aria-labelledby</code>.
        </p>
        <Dropdown selectionIndicator defaultValue="ru">
          <Dropdown.Trigger asChild>
            <Button variant="secondary">Language</Button>
          </Dropdown.Trigger>
          <Dropdown.Popover>
            <Dropdown.Group>
              <Dropdown.Label>Select language</Dropdown.Label>
              <Dropdown.Item value="ru">
                <Dropdown.ItemIndicator />
                <Dropdown.ItemLabel>Russian</Dropdown.ItemLabel>
              </Dropdown.Item>
              <Dropdown.Item value="en">
                <Dropdown.ItemIndicator />
                <Dropdown.ItemLabel>English</Dropdown.ItemLabel>
              </Dropdown.Item>
            </Dropdown.Group>
          </Dropdown.Popover>
        </Dropdown>
      </div>
    );
  },
};

// ─── portalContainer (3.1) ────────────────────────────────────────────────────

export const PortalContainer: Story = {
  name: "portalContainer",
  parameters: {
    docs: {
      description: {
        story:
          "`portalContainer` mounts the menu panel into a custom host instead of `document.body`.",
      },
    },
  },
  render: function PortalContainerDemo() {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    return (
      <div className="flex w-full max-w-lg flex-col gap-mid">
        <p className="text-sm text-muted">
          Menu portals into the box below (not <code className="text-foreground">document.body</code>).
        </p>
        <div
          ref={setContainer}
          className="relative flex h-64 items-start justify-center overflow-hidden rounded-mid border-2 border-dashed border-primary/40 bg-surface/40 p-mid"
          style={{ transform: "translateZ(0)" }}
        >
          <p className="absolute left-mid top-mid text-xs text-muted">Custom portal host</p>
          {container ? (
            <Dropdown portalContainer={container} selectionIndicator defaultValue="ru">
              <Dropdown.Trigger asChild>
                <Button variant="outline" type="button">
                  Open in host
                </Button>
              </Dropdown.Trigger>
              <Dropdown.Popover>
                <Dropdown.Group>
                  <Dropdown.Label>Language</Dropdown.Label>
                  <Dropdown.Item value="ru">
                    <Dropdown.ItemIndicator />
                    <Dropdown.ItemLabel>Russian</Dropdown.ItemLabel>
                  </Dropdown.Item>
                  <Dropdown.Item value="en">
                    <Dropdown.ItemIndicator />
                    <Dropdown.ItemLabel>English</Dropdown.ItemLabel>
                  </Dropdown.Item>
                </Dropdown.Group>
              </Dropdown.Popover>
            </Dropdown>
          ) : null}
        </div>
      </div>
    );
  },
};

// ─── asChild merged props (3.3) ───────────────────────────────────────────────

export const AsChildMergedProps: Story = {
  name: "asChild — merged props & ref",
  parameters: {
    docs: {
      description: {
        story:
          "`Dropdown.Trigger asChild` merges host `id`, `data-*`, `className`, and `ref` onto the child via `mergeAsChildProps`.",
      },
    },
  },
  render: function AsChildMergedPropsDemo() {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [refLabel, setRefLabel] = useState("ref: —");

    useLayoutEffect(() => {
      const node = triggerRef.current;
      setRefLabel(node ? `ref → #${node.id} (${node.tagName.toLowerCase()})` : "ref: —");
    }, []);

    return (
      <div className="flex flex-col items-center gap-mid">
        <p className="text-sm text-muted">{refLabel}</p>
        <Dropdown selectionIndicator defaultValue="ru">
          <Dropdown.Trigger
            asChild
            ref={triggerRef}
            id="story-dropdown-trigger"
            data-testid="story-dropdown-trigger"
            data-analytics="open-dropdown"
            className="ring-2 ring-primary/30"
          >
            <Button variant="outline" type="button">
              Open (merged props)
            </Button>
          </Dropdown.Trigger>
          <Dropdown.Popover>
            <Dropdown.Group>
              <Dropdown.Label>Language</Dropdown.Label>
              <Dropdown.Item value="ru">
                <Dropdown.ItemIndicator />
                <Dropdown.ItemLabel>Russian</Dropdown.ItemLabel>
              </Dropdown.Item>
              <Dropdown.Item value="en">
                <Dropdown.ItemIndicator />
                <Dropdown.ItemLabel>English</Dropdown.ItemLabel>
              </Dropdown.Item>
            </Dropdown.Group>
          </Dropdown.Popover>
        </Dropdown>
      </div>
    );
  },
  play: async ({ canvas }) => {
    const btn = canvas.getByTestId("story-dropdown-trigger");
    await expect(btn).toHaveAttribute("id", "story-dropdown-trigger");
    await expect(btn).toHaveAttribute("data-analytics", "open-dropdown");
    await expect(btn).toHaveAttribute("aria-haspopup", "menu");
  },
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story: "classNames customization for Dropdown",
      },
    },
  },
  render: function DropdownClassNamesStory() {
    return (
      <Dropdown
        selectionIndicator
        defaultValue="ru"
        classNames={{
          popoverBody: "border border-primary/20",
          label: "text-primary",
          item: "rounded-lg",
        }}
      >
        <Dropdown.Trigger asChild>
          <Button variant="outline">Interface language</Button>
        </Dropdown.Trigger>
        <Dropdown.Popover>
          <Dropdown.Group>
            <Dropdown.Label>Select language</Dropdown.Label>
            <Dropdown.Item value="ru">
              <Dropdown.ItemIndicator />
              <Dropdown.ItemLabel>Russian</Dropdown.ItemLabel>
            </Dropdown.Item>
            <Dropdown.Item value="en">
              <Dropdown.ItemIndicator />
              <Dropdown.ItemLabel>English</Dropdown.ItemLabel>
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Popover>
      </Dropdown>
    );
  },
};

/** Review 3.7: Popover `side` / `align` / `offset` are typed pass-through props. */
export const PopoverSideTop: Story = {
  name: "Popover side top",
  parameters: {
    docs: {
      description: {
        story:
          "`Dropdown.Popover` accepts `side`, `align`, and `offset` (same as Popover). Default side is `bottom`.",
      },
    },
  },
  render: () => (
    <Dropdown selectionIndicator defaultValue="ru">
      <Dropdown.Trigger asChild>
        <Button variant="outline">Opens upward</Button>
      </Dropdown.Trigger>
      <Dropdown.Popover side="top">
        <Dropdown.Group>
          <Dropdown.Label>Select language</Dropdown.Label>
          <Dropdown.Item value="ru">
            <Dropdown.ItemIndicator />
            <Dropdown.ItemLabel>Russian</Dropdown.ItemLabel>
          </Dropdown.Item>
          <Dropdown.Item value="en">
            <Dropdown.ItemIndicator />
            <Dropdown.ItemLabel>English</Dropdown.ItemLabel>
          </Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Popover>
    </Dropdown>
  ),
};
