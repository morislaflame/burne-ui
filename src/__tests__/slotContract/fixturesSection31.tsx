import { IoStar } from "react-icons/io5";

import { Accordion } from "@/components/composite/Accordion";
import { Form } from "@/components/composite/Form";
import { Badge } from "@/components/core/Badge";
import { Button } from "@/components/core/Button";
import { CloseButton } from "@/components/core/CloseButton";
import { ComboBox } from "@/components/core/ComboBox";
import { Disclosure } from "@/components/core/Disclosure";
import { Dropdown } from "@/components/core/Dropdown";
import { Expandable } from "@/components/core/Expandable";
import { HoverCard } from "@/components/core/HoverCard";
import { Input } from "@/components/core/Input";
import { Popover } from "@/components/core/Popover";
import { SearchInput } from "@/components/core/SearchInput";
import { Select } from "@/components/core/Select";
import { Table } from "@/components/core/Table";
import { TextArea } from "@/components/core/TextArea";
import { ToggleButton } from "@/components/core/ToggleButton";
import { Tooltip } from "@/components/core/Tooltip";

import type { SlotContractFixture } from "./types";

const OPTIONS = [
  { value: "a", label: "Alpha", hint: "A", icon: <IoStar /> },
  { value: "b", label: "Beta" },
];

export const SECTION_31_FIXTURES: SlotContractFixture[] = [
  {
    typeName: "AccordionClassNames",
    parts: {
      Item: "item",
      Trigger: "trigger",
      Message: "message",
      Icon: "icon",
      Content: "content",
      Title: "title",
      Description: "description",
      Chevron: "chevron",
      Panel: "panel",
      Body: "body",
    },
    notMotionTargets: [
      "message",
      "content",
      "heading",
      "triggerRippleOverlay",
      "contentWrap",
      "chevron",
      "title",
      "icon",
      "description",
    ],
    optionalSlots: ["heading", "triggerRippleOverlay"],
    render: (ctx) => (
      <Accordion classNames={ctx.classNames} className={ctx.className} defaultValue="one">
        <Accordion.Item value="one" motionController={ctx.motionController} {...ctx.part("Item")}>
          <Accordion.Heading>
            <Accordion.Trigger {...ctx.part("Trigger")}>
              <Accordion.Message {...ctx.part("Message")}>
                <Accordion.Icon {...ctx.part("Icon")}>
                  <IoStar />
                </Accordion.Icon>
                <Accordion.Content {...ctx.part("Content")}>
                  <Accordion.Title {...ctx.part("Title")}>Title</Accordion.Title>
                  <Accordion.Description {...ctx.part("Description")}>Hint</Accordion.Description>
                </Accordion.Content>
                <Accordion.Chevron {...ctx.part("Chevron")} />
              </Accordion.Message>
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel {...ctx.part("Panel")}>
            <Accordion.Body {...ctx.part("Body")}>Panel body</Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    ),
  },
  {
    typeName: "ExpandableClassNames",
    parts: {
      Trigger: "trigger",
      Message: "message",
      Icon: "icon",
      Content: "content",
      Title: "title",
      Description: "description",
      Chevron: "chevron",
      Panel: "panel",
    },
    notMotionTargets: [
      "message",
      "content",
      "triggerRippleOverlay",
      "contentWrap",
      "title",
      "icon",
      "description",
    ],
    optionalSlots: ["triggerRippleOverlay"],
    render: (ctx) => (
      <Expandable
        open
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <Expandable.Trigger {...ctx.part("Trigger")}>
          <Expandable.Message {...ctx.part("Message")}>
            <Expandable.Icon {...ctx.part("Icon")}>
              <IoStar />
            </Expandable.Icon>
            <Expandable.Content {...ctx.part("Content")}>
              <Expandable.Title {...ctx.part("Title")}>Title</Expandable.Title>
              <Expandable.Description {...ctx.part("Description")}>Hint</Expandable.Description>
            </Expandable.Content>
            <Expandable.Chevron {...ctx.part("Chevron")} />
          </Expandable.Message>
        </Expandable.Trigger>
        <Expandable.Panel {...ctx.part("Panel")}>Panel body</Expandable.Panel>
      </Expandable>
    ),
  },
  {
    typeName: "DisclosureClassNames",
    parts: {
      Trigger: "trigger",
      Icon: "icon",
      Chevron: "chevron",
      Handle: "handle",
      Content: "content",
    },
    notMotionTargets: ["contentWrap", "icon", "handle"],
    optionalSlots: ["group"],
    render: (ctx) => (
      <Disclosure
        open
        variant="card"
        dragHandle
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <Disclosure.Trigger {...ctx.part("Trigger")}>
          <Disclosure.Icon {...ctx.part("Icon")}>
            <IoStar />
          </Disclosure.Icon>
          Title
          <Disclosure.Chevron {...ctx.part("Chevron")} />
        </Disclosure.Trigger>
        <Disclosure.Handle {...ctx.part("Handle")} />
        <Disclosure.Content {...ctx.part("Content")}>Panel body</Disclosure.Content>
      </Disclosure>
    ),
  },
  {
    typeName: "DropdownClassNames",
    nestedScopeSlots: ["item", "itemLabel", "itemHint", "itemIcon", "label", "subTrigger", "separator"],
    covers: ["DropdownItemIndicatorClassNames"],
    parts: {
      Trigger: "trigger",
      Item: "item",
      ItemLabel: "itemLabel",
      ItemHint: "itemHint",
      ItemIcon: "itemIcon",
      ItemIndicator: "itemIndicator",
      SubTrigger: "subTrigger",
    },
    skipRootMerge: true,
    optionalSlots: ["root", "itemIndicatorFill", "itemIndicatorMark", "subPopover", "subPopoverBody"],
    render: (ctx) => (
      <Dropdown
        open
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <Dropdown.Trigger {...ctx.part("Trigger")}>Menu</Dropdown.Trigger>
        <Dropdown.Popover>
          <Dropdown.Group>
            <Dropdown.Label>Group</Dropdown.Label>
            <Dropdown.Item {...ctx.part("Item")}>
              <Dropdown.ItemIcon {...ctx.part("ItemIcon")}>
                <IoStar />
              </Dropdown.ItemIcon>
              <Dropdown.ItemLabel {...ctx.part("ItemLabel")}>Copy</Dropdown.ItemLabel>
              <Dropdown.ItemHint {...ctx.part("ItemHint")}>⌘C</Dropdown.ItemHint>
              <Dropdown.ItemIndicator {...ctx.part("ItemIndicator")} />
            </Dropdown.Item>
            <Dropdown.Separator />
            <Dropdown.Sub>
              <Dropdown.SubTrigger {...ctx.part("SubTrigger")}>More</Dropdown.SubTrigger>
              <Dropdown.SubPopover>
                <Dropdown.Item>Nested</Dropdown.Item>
              </Dropdown.SubPopover>
            </Dropdown.Sub>
          </Dropdown.Group>
        </Dropdown.Popover>
      </Dropdown>
    ),
  },
  {
    typeName: "TableClassNames",
    nestedScopeSlots: ["row", "cell"],
    parts: {
      ScrollContainer: "scrollContainer",
      Content: "content",
      Header: "header",
      HeaderRow: "headerRow",
      Column: "column",
      Label: "columnLabel",
      Body: "body",
      Row: "row",
      Cell: "cell",
      Footer: "footer",
      Caption: "caption",
    },
    optionalSlots: ["emptyCell"],
    render: (ctx) => (
      <Table classNames={ctx.classNames} className={ctx.className} motionController={ctx.motionController}>
        <Table.Caption {...ctx.part("Caption")}>People</Table.Caption>
        <Table.ScrollContainer {...ctx.part("ScrollContainer")}>
          <Table.Content {...ctx.part("Content")}>
            <Table.Header {...ctx.part("Header")}>
              <Table.HeaderRow {...ctx.part("HeaderRow")}>
                <Table.Column sortable {...ctx.part("Column")}>
                  <Table.Label {...ctx.part("Label")}>Name</Table.Label>
                </Table.Column>
                <Table.Column>Role</Table.Column>
              </Table.HeaderRow>
            </Table.Header>
            <Table.Body {...ctx.part("Body")}>
              <Table.Row {...ctx.part("Row")}>
                <Table.Cell {...ctx.part("Cell")}>Ada</Table.Cell>
                <Table.Cell>Engineer</Table.Cell>
              </Table.Row>
              <Table.Empty>None</Table.Empty>
            </Table.Body>
            <Table.Footer {...ctx.part("Footer")}>
              <Table.Row>
                <Table.Cell>Footer</Table.Cell>
                <Table.Cell> </Table.Cell>
              </Table.Row>
            </Table.Footer>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    ),
  },
  {
    typeName: "BadgeClassNames",
    nestedScopeSlots: ["anchor"],
    parts: { Anchor: "anchor" },
    allowDuplicateSlots: [
      ["root", "text"],
      ["root", "dot"],
      ["root", "iconOnly"],
    ],
    optionalSlots: ["splitShell"],
    render: (ctx) => (
      <>
        <Badge
          classNames={ctx.classNames}
          className={ctx.className}
          motionController={ctx.motionController}
        >
          Text
        </Badge>
        <Badge classNames={ctx.classNames} icon={<IoStar />}>
          With icon
        </Badge>
        <Badge classNames={ctx.classNames} icon={<IoStar />} />
        <Badge dot classNames={ctx.classNames} />
        <Badge.Anchor {...ctx.part("Anchor")}>
          <button type="button">Host</button>
          <Badge classNames={ctx.classNames} />
        </Badge.Anchor>
      </>
    ),
  },
  {
    typeName: "PopoverClassNames",
    allowDuplicateSlots: [["content", "panel"]],
    parts: {
      Trigger: "trigger",
      Content: "content",
      Header: "header",
      Title: "title",
      Description: "description",
      Body: "body",
      Arrow: "arrow",
    },
    skipRootMerge: true,
    // `trigger` plays on the root scope. The fixture controller is the portal host.
    notMotionTargets: ["trigger"],
    render: (ctx) => (
      <Popover open classNames={ctx.classNames}>
        <Popover.Trigger {...ctx.part("Trigger")}>Open</Popover.Trigger>
        <Popover.Content {...ctx.part("Content")} showArrow motionController={ctx.motionController}>
          <Popover.Header {...ctx.part("Header")}>
            <Popover.Title {...ctx.part("Title")}>Title</Popover.Title>
            <Popover.Description {...ctx.part("Description")}>Hint</Popover.Description>
          </Popover.Header>
          <Popover.Body {...ctx.part("Body")}>Body</Popover.Body>
          <Popover.Arrow {...ctx.part("Arrow")} />
        </Popover.Content>
      </Popover>
    ),
  },
  {
    typeName: "HoverCardClassNames",
    allowDuplicateSlots: [["content", "panel"]],
    parts: {
      Trigger: "trigger",
      Content: "content",
      Header: "header",
      Title: "title",
      Description: "description",
      Body: "body",
      Arrow: "arrow",
    },
    skipRootMerge: true,
    // `trigger` plays on the root scope. The fixture controller is the portal host.
    notMotionTargets: ["trigger"],
    render: (ctx) => (
      <HoverCard open openDelay={0} closeDelay={0} classNames={ctx.classNames}>
        <HoverCard.Trigger {...ctx.part("Trigger")}>Ada</HoverCard.Trigger>
        <HoverCard.Content {...ctx.part("Content")} showArrow motionController={ctx.motionController}>
          <HoverCard.Header {...ctx.part("Header")}>
            <HoverCard.Title {...ctx.part("Title")}>Ada Lovelace</HoverCard.Title>
            <HoverCard.Description {...ctx.part("Description")}>Mathematician</HoverCard.Description>
          </HoverCard.Header>
          <HoverCard.Body {...ctx.part("Body")}>Body</HoverCard.Body>
          <HoverCard.Arrow {...ctx.part("Arrow")} />
        </HoverCard.Content>
      </HoverCard>
    ),
  },
  {
    typeName: "TooltipClassNames",
    allowDuplicateSlots: [["content", "panel"]],
    parts: {
      Trigger: "trigger",
      Content: "content",
      Indicator: "indicator",
      Title: "title",
      Description: "description",
      Arrow: "arrow",
    },
    skipRootMerge: true,
    notMotionTargets: ["message"],
    render: (ctx) => (
      <Tooltip open status="info" classNames={ctx.classNames}>
        <Tooltip.Trigger {...ctx.part("Trigger")}>Tip</Tooltip.Trigger>
        <Tooltip.Content {...ctx.part("Content")} showArrow motionController={ctx.motionController}>
          <Tooltip.Indicator {...ctx.part("Indicator")} />
          <Tooltip.Message>Body</Tooltip.Message>
          <Tooltip.Title {...ctx.part("Title")}>Title</Tooltip.Title>
          <Tooltip.Description {...ctx.part("Description")}>Hint</Tooltip.Description>
          <Tooltip.Arrow {...ctx.part("Arrow")} />
        </Tooltip.Content>
      </Tooltip>
    ),
  },
  {
    typeName: "ComboBoxClassNames",
    nestedScopeSlots: ["popover"],
    parts: {
      Label: "label",
      InputGroup: "shell",
      Input: "input",
      Trigger: "trigger",
      Hint: "hint",
      Error: "error",
    },
    optionalSlots: ["listBoxEmpty", "listBoxHeader", "listBoxHeaderText"],
    notMotionTargets: ["label", "hint", "error"],
    render: (ctx) => (
      <ComboBox
        open
        label="City"
        items={OPTIONS}
        hint="Pick"
        error="Required"
        classNames={ctx.classNames}
        className={ctx.className}
      >
        <ComboBox.Label {...ctx.part("Label")}>City</ComboBox.Label>
        <ComboBox.Shell {...ctx.part("InputGroup")} motionController={ctx.motionController}>
          <ComboBox.Input {...ctx.part("Input")} />
          <ComboBox.Trigger {...ctx.part("Trigger")} />
        </ComboBox.Shell>
        <ComboBox.Hint {...ctx.part("Hint")}>Pick</ComboBox.Hint>
        <ComboBox.Error {...ctx.part("Error")}>Required</ComboBox.Error>
        <ComboBox.Popover />
      </ComboBox>
    ),
  },
  {
    typeName: "SelectClassNames",
    nestedScopeSlots: ["popover"],
    parts: {
      Label: "label",
      TriggerGroup: "shell",
      Value: "value",
      Trigger: "trigger",
      Hint: "hint",
      Error: "error",
    },
    optionalSlots: ["listBoxEmpty", "listBoxHeader", "listBoxHeaderText"],
    notMotionTargets: ["label", "hint", "error"],
    render: (ctx) => (
      <Select
        open
        label="City"
        items={OPTIONS}
        hint="Pick"
        error="Required"
        classNames={ctx.classNames}
        className={ctx.className}
      >
        <Select.Label {...ctx.part("Label")}>City</Select.Label>
        <Select.Shell {...ctx.part("TriggerGroup")} motionController={ctx.motionController}>
          <Select.Value {...ctx.part("Value")} />
          <Select.Trigger {...ctx.part("Trigger")} />
        </Select.Shell>
        <Select.Hint {...ctx.part("Hint")}>Pick</Select.Hint>
        <Select.Error {...ctx.part("Error")}>Required</Select.Error>
        <Select.Popover />
      </Select>
    ),
  },
  {
    typeName: "CloseButtonClassNames",
    optionalSlots: ["ripple"],
    render: (ctx) => (
      <CloseButton
        aria-label="Close"
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      />
    ),
  },
  {
    typeName: "FormClassNames",
    optionalSlots: ["announce"],
    nestedScopeSlots: ["section", "field"],
    parts: {
      Header: "header",
      Title: "title",
      Description: "description",
      Section: "section",
      Field: "field",
      Actions: "actions",
      ErrorSummary: "errorSummary",
      Announce: "announce",
    },
    render: (ctx) => (
      <Form
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
        defaultValues={{ name: "" }}
        rules={{ name: { required: true } }}
      >
        <Form.Header {...ctx.part("Header")}>
          <Form.Title {...ctx.part("Title")}>Sign in</Form.Title>
          <Form.Description {...ctx.part("Description")}>Hint</Form.Description>
        </Form.Header>
        <Form.Section {...ctx.part("Section")}>
          <Form.Field name="name" {...ctx.part("Field")}>
            <Input label="Name" />
          </Form.Field>
        </Form.Section>
        <Form.ErrorSummary {...ctx.part("ErrorSummary")} />
        <Form.Announce {...ctx.part("Announce")} />
        <Form.Actions {...ctx.part("Actions")}>Save</Form.Actions>
      </Form>
    ),
  },
  {
    typeName: "SearchInputClassNames",
    skipMotion: true,
    optionalSlots: ["expandTrigger"],
    render: (ctx) => (
      <>
        <SearchInput
          aria-label="Search"
          defaultValue="q"
          expanded
          classNames={ctx.classNames}
          className={ctx.className}
        />
        <SearchInput aria-label="Collapsed search" expanded={false} classNames={ctx.classNames} />
      </>
    ),
  },
  {
    typeName: "InputClassNames",
    nestedScopeSlots: ["shell", "control", "prefix", "suffix", "passwordToggle", "fileRow", "fileRemove"],
    parts: {
      Label: "label",
      Control: "control",
      Hint: "hint",
      Error: "error",
    },
    optionalSlots: ["filePreview", "fileArea", "fileEmpty", "fileRow", "fileGlyph", "fileRemove", "prefix", "suffix", "passwordToggle"],
    render: (ctx) => (
      <>
        <Input
          label="Name"
          hint="Hint"
          error="Error"
          prefix="@"
          suffix="x"
          type="password"
          classNames={ctx.classNames}
          className={ctx.className}
          motionController={ctx.motionController}
        >
          <Input.Label {...ctx.part("Label")}>Name</Input.Label>
          <Input.Control {...ctx.part("Control")} />
          <Input.Hint {...ctx.part("Hint")}>Hint</Input.Hint>
          <Input.Error {...ctx.part("Error")}>Error</Input.Error>
        </Input>
        <Input type="file" label="File" classNames={ctx.classNames} />
      </>
    ),
  },
  {
    typeName: "TextAreaClassNames",
    nestedScopeSlots: ["shell", "control", "resizeHandle"],
    parts: {
      Label: "label",
      Control: "control",
      Hint: "hint",
      Error: "error",
    },
    render: (ctx) => (
      <TextArea
        label="Bio"
        hint="Hint"
        error="Error"
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <TextArea.Label {...ctx.part("Label")}>Bio</TextArea.Label>
        <TextArea.Control {...ctx.part("Control")} />
        <TextArea.Hint {...ctx.part("Hint")}>Hint</TextArea.Hint>
        <TextArea.Error {...ctx.part("Error")}>Error</TextArea.Error>
      </TextArea>
    ),
  },
  {
    typeName: "ButtonClassNames",
    parts: {
      Content: "content",
      Icon: "icon",
      Label: "label",
      Text: "text",
      Loader: "loader",
      Success: "success",
      Error: "error",
    },
    render: (ctx) => (
      <>
        <Button
          classNames={ctx.classNames}
          className={ctx.className}
          motionController={ctx.motionController}
        >
          <Button.Content {...ctx.part("Content")}>
            <Button.Icon {...ctx.part("Icon")}>
              <IoStar />
            </Button.Icon>
            <Button.Label {...ctx.part("Label")}>
              <Button.Text {...ctx.part("Text")}>Save</Button.Text>
            </Button.Label>
            <Button.Loader {...ctx.part("Loader")} />
            <Button.Success {...ctx.part("Success")} />
            <Button.Error {...ctx.part("Error")} />
          </Button.Content>
        </Button>
      </>
    ),
  },
  {
    typeName: "ToggleButtonClassNames",
    parts: {
      Fill: "fill",
      Content: "content",
      Label: "label",
      IconStart: "iconStart",
      IconEnd: "iconEnd",
      Text: "text",
    },
    render: (ctx) => (
      <ToggleButton
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <ToggleButton.Fill {...ctx.part("Fill")} />
        <ToggleButton.Content {...ctx.part("Content")}>
          <ToggleButton.IconStart {...ctx.part("IconStart")}>
            <IoStar />
          </ToggleButton.IconStart>
          <ToggleButton.Label {...ctx.part("Label")}>
            <ToggleButton.Text {...ctx.part("Text")}>On</ToggleButton.Text>
          </ToggleButton.Label>
          <ToggleButton.IconEnd {...ctx.part("IconEnd")}>
            <IoStar />
          </ToggleButton.IconEnd>
        </ToggleButton.Content>
      </ToggleButton>
    ),
  },
];
