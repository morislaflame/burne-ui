import { IoStar } from "react-icons/io5";

import { AlertDialog } from "@/components/composite/AlertDialog";
import { ButtonGroup } from "@/components/composite/ButtonGroup";
import { CheckboxGroup } from "@/components/composite/CheckboxGroup";
import { RadioGroup } from "@/components/composite/RadioGroup";
import { ToggleButtonGroup } from "@/components/composite/ToggleButtonGroup";
import { Alert } from "@/components/core/Alert";
import { Avatar } from "@/components/core/Avatar";
import { Breadcrumbs } from "@/components/core/Breadcrumbs";
import { Button } from "@/components/core/Button";
import { Calendar } from "@/components/core/Calendar";
import { Card } from "@/components/core/Card";
import { Checkbox } from "@/components/core/Checkbox";
import { ColorPicker, ColorSlider, ColorSwatch } from "@/components/core/ColorPicker";
import { ContextMenu } from "@/components/core/ContextMenu";
import { DatePicker } from "@/components/core/DatePicker";
import { Dialog } from "@/components/core/Dialog";
import { Drawer } from "@/components/core/Drawer";
import { Field } from "@/components/core/Field";
import { Input } from "@/components/core/Input";
import { Kbd } from "@/components/core/Kbd";
import { Label } from "@/components/core/Label";
import { Link } from "@/components/core/Link";
import { ListBox } from "@/components/core/ListBox";
import { Loading } from "@/components/core/Loading";
import { Meter } from "@/components/core/Meter";
import { NumberInput } from "@/components/core/NumberInput";
import { Pagination } from "@/components/core/Pagination";
import { PinInput } from "@/components/core/PinInput";
import { ProgressBar } from "@/components/core/ProgressBar";
import { Radio } from "@/components/core/Radio";
import { ScrollArea } from "@/components/core/ScrollArea";
import { SelectionIndicator } from "@/components/core/SelectionIndicator";
import { SelectionThumb } from "@/components/core/SelectionThumb";
import { Skeleton } from "@/components/core/Skeleton";
import { Slider } from "@/components/core/Slider";
import { Stepper } from "@/components/core/Stepper";
import { Stack } from "@/components/core/Stack";
import { Grid } from "@/components/core/Grid";
import { Container } from "@/components/core/Container";
import { AppShell } from "@/components/core/AppShell";
import { AspectRatio } from "@/components/core/AspectRatio";
import { Header } from "@/components/core/Header";
import { Resizable } from "@/components/core/Resizable";
import { Sidebar } from "@/components/core/Sidebar";
import { Surface } from "@/components/core/Surface";
import { Switch } from "@/components/core/Switch";
import { Tabs } from "@/components/core/Tabs";
import { TagsInput } from "@/components/core/TagsInput";
import { TimeField } from "@/components/core/TimeField";
import { Toast } from "@/components/core/Toast";
import { ToggleButton } from "@/components/core/ToggleButton";

import type { SlotContractFixture } from "./types";

const OCTOBER = new Date(2026, 9, 1);

export const REST_FIXTURES: SlotContractFixture[] = [
  {
    typeName: "AlertClassNames",
    parts: {
      Indicator: "indicator",
      Message: "message",
      Content: "content",
      Title: "title",
      Description: "description",
      Action: "action",
    },
    notMotionTargets: ["message", "content"],
    render: (ctx) => (
      <Alert
        icon={<IoStar />}
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <Alert.Indicator {...ctx.part("Indicator")}>
          <IoStar />
        </Alert.Indicator>
        <Alert.Message {...ctx.part("Message")}>
          <Alert.Content {...ctx.part("Content")}>
            <Alert.Title {...ctx.part("Title")}>Title</Alert.Title>
            <Alert.Description {...ctx.part("Description")}>Hint</Alert.Description>
          </Alert.Content>
        </Alert.Message>
        <Alert.Action {...ctx.part("Action")}>Ok</Alert.Action>
      </Alert>
    ),
  },
  {
    typeName: "AlertDialogClassNames",
    nestedScopeSlots: ["trigger"],
    parts: {
      Trigger: "trigger",
      Title: "title",
      Description: "description",
      Body: "body",
      Footer: "footer",
      Close: "close",
      Indicator: "indicator",
    },
    skipRootMerge: true,
    notMotionTargets: ["headingBlock"],
    optionalSlots: ["headingBlock"],
    render: (ctx) => (
      <AlertDialog open status="danger" classNames={ctx.classNames}>
        <AlertDialog.Trigger {...ctx.part("Trigger")}>Delete</AlertDialog.Trigger>
        <AlertDialog.Panel motionController={ctx.motionController}>
          <AlertDialog.Header>
            <AlertDialog.Indicator {...ctx.part("Indicator")} />
            <AlertDialog.Title {...ctx.part("Title")}>Delete?</AlertDialog.Title>
            <AlertDialog.Description {...ctx.part("Description")}>Gone</AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Body {...ctx.part("Body")}>Body</AlertDialog.Body>
          <AlertDialog.Footer {...ctx.part("Footer")}>
            <AlertDialog.Close {...ctx.part("Close")} aria-label="Cancel" />
          </AlertDialog.Footer>
        </AlertDialog.Panel>
      </AlertDialog>
    ),
  },
  {
    typeName: "AvatarClassNames",
    parts: { Image: "image", Fallback: "fallback" },
    optionalSlots: ["group", "groupItem"],
    notMotionTargets: ["groupItem"],
    render: (ctx) => (
      <>
        <Avatar
          label="Ada"
          classNames={ctx.classNames}
          className={ctx.className}
          motionController={ctx.motionController}
        >
          <Avatar.Image {...ctx.part("Image")} src="https://example.com/a.png" alt="" />
          <Avatar.Fallback {...ctx.part("Fallback")}>A</Avatar.Fallback>
        </Avatar>
        <Avatar.Group classNames={ctx.classNames}>
          <Avatar label="A" classNames={ctx.classNames} />
          <Avatar label="B" classNames={ctx.classNames} />
        </Avatar.Group>
      </>
    ),
  },
  {
    typeName: "BreadcrumbsClassNames",
    parts: { Separator: "separatorWrapper" },
    // `separator` class sits on the icon; motion node is the wrapper.
    // Crumb slots live on a nested scope, not the list controller.
    notMotionTargets: ["separator", "itemLink", "itemLinkText", "ellipsisLiftWrapper"],
    optionalSlots: ["ellipsisPopover", "dropdownItem", "itemStatic"],
    render: (ctx) => (
      <>
        <Breadcrumbs
          classNames={ctx.classNames}
          className={ctx.className}
          motionController={ctx.motionController}
          collapse
          items={[
            { href: "/", label: "Home" },
            { href: "/a", label: "Library" },
            { href: "/b", label: "Data" },
            { label: "Here" },
          ]}
        />
        <Breadcrumbs classNames={ctx.classNames} aria-label="Custom separator">
          <Breadcrumbs.Separator {...ctx.part("Separator")} />
        </Breadcrumbs>
      </>
    ),
  },
  {
    typeName: "ButtonGroupClassNames",
    parts: { Text: "text" },
    render: (ctx) => (
      <ButtonGroup
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <Button>One</Button>
        <ButtonGroup.Text {...ctx.part("Text")}>or</ButtonGroup.Text>
        <Button>Two</Button>
      </ButtonGroup>
    ),
  },
  {
    typeName: "CalendarClassNames",
    nestedScopeSlots: ["cell", "cellText", "cellFill"],
    optionalSlots: [
      "monthsGrid",
      "monthCell",
      "yearsGrid",
      "yearCell",
      "rangeHalfFill",
      "dayEmpty",
      "footer",
      "footerToday",
      "footerClear",
    ],
    render: (ctx) => (
      <Calendar
        defaultMonth={OCTOBER}
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      />
    ),
  },
  {
    typeName: "CardClassNames",
    parts: {
      Header: "header",
      HeadingBlock: "headingBlock",
      Title: "title",
      Description: "description",
      Body: "body",
      Footer: "footer",
    },
    optionalSlots: ["content"],
    render: (ctx) => (
      <Card classNames={ctx.classNames} className={ctx.className} motionController={ctx.motionController}>
        <Card.Header {...ctx.part("Header")}>
          <Card.HeadingBlock {...ctx.part("HeadingBlock")}>
            <Card.Title {...ctx.part("Title")}>Title</Card.Title>
            <Card.Description {...ctx.part("Description")}>Hint</Card.Description>
          </Card.HeadingBlock>
        </Card.Header>
        <Card.Body {...ctx.part("Body")}>Body</Card.Body>
        <Card.Footer {...ctx.part("Footer")}>Footer</Card.Footer>
      </Card>
    ),
  },
  {
    typeName: "CheckboxClassNames",
    covers: ["CheckboxIndicatorClassNames"],
    parts: {
      Control: "control",
      Indicator: "indicator",
      Content: "content",
      Label: "label",
      Hint: "hint",
      Error: "error",
    },
    notMotionTargets: ["content"],
    nestedScopeSlots: ["indicator", "indicatorFill", "indicatorMark"],
    optionalSlots: ["simpleLabelWrap", "simpleLabelText", "requiredMark", "input"],
    render: (ctx) => (
      <Checkbox
        label="Accept"
        hint="Hint"
        error="Error"
        required
        defaultChecked
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <Checkbox.Control {...ctx.part("Control")}>
          <Checkbox.Indicator {...ctx.part("Indicator")} />
        </Checkbox.Control>
        <Checkbox.Content {...ctx.part("Content")}>
          <Checkbox.Label {...ctx.part("Label")}>Accept</Checkbox.Label>
          <Checkbox.Hint {...ctx.part("Hint")}>Hint</Checkbox.Hint>
          <Checkbox.Error {...ctx.part("Error")}>Error</Checkbox.Error>
        </Checkbox.Content>
      </Checkbox>
    ),
  },
  {
    typeName: "CheckboxGroupClassNames",
    parts: {
      Legend: "legend",
      Hint: "hint",
      Error: "error",
      List: "list",
      Actions: "actions",
    },
    render: (ctx) => (
      <CheckboxGroup
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <CheckboxGroup.Legend {...ctx.part("Legend")}>Topics</CheckboxGroup.Legend>
        <CheckboxGroup.Hint {...ctx.part("Hint")}>Pick</CheckboxGroup.Hint>
        <CheckboxGroup.Error {...ctx.part("Error")}>Required</CheckboxGroup.Error>
        <CheckboxGroup.List {...ctx.part("List")}>
          <Checkbox value="a" label="A" />
        </CheckboxGroup.List>
        <CheckboxGroup.Actions {...ctx.part("Actions")}>More</CheckboxGroup.Actions>
      </CheckboxGroup>
    ),
  },
  {
    typeName: "ColorPickerClassNames",
    nestedScopeSlots: ["hueSlider", "alphaSlider", "trigger"],
    skipRootMerge: true,
    optionalSlots: [
      "content",
      "contentPanel",
      "area",
      "areaThumb",
      "slidersRow",
      "slidersStack",
      "previewSwatch",
      "hueSlider",
      "alphaSlider",
      "inputsRow",
      "hexInput",
      "hexPrefix",
      "hexInputField",
      "alphaInput",
      "alphaInputField",
      "alphaSuffix",
      "presets",
      "presetSwatch",
    ],
    render: (ctx) => (
      <ColorPicker
        open
        classNames={ctx.classNames}
        motionController={ctx.motionController}
      >
        <ColorPicker.Label>Brand</ColorPicker.Label>
        <ColorPicker.Trigger>Color</ColorPicker.Trigger>
        <ColorPicker.Hint>Hex</ColorPicker.Hint>
        <ColorPicker.Error>Bad</ColorPicker.Error>
        <ColorPicker.Content presets={["#ff0000"]} />
      </ColorPicker>
    ),
  },
  {
    typeName: "ColorSliderClassNames",
    // Simple API forwards the handle to Track. Root plays on its own scope.
    notMotionTargets: ["root"],
    render: (ctx) => (
      <ColorSlider
        channel="hue"
        label="Hue"
        defaultValue={180}
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      />
    ),
  },
  {
    typeName: "ColorSwatchClassNames",
    nestedScopeSlots: ["root"],
    allowDuplicateSlots: [["root", "selected"]],
    render: (ctx) => (
      <ColorSwatch
        color="#ff0000"
        selected
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      />
    ),
  },
  {
    typeName: "ContextMenuClassNames",
    skipRootMerge: true,
    optionalSlots: ["root", "subPopover", "subPopoverBody", "itemIndicatorFill", "itemIndicatorMark", "itemIndicator"],
    render: (ctx) => (
      <ContextMenu open classNames={ctx.classNames} className={ctx.className}>
        <ContextMenu.Trigger>Surface</ContextMenu.Trigger>
        <ContextMenu.Popover motionController={ctx.motionController}>
          <ContextMenu.Group>
            <ContextMenu.Label>Edit</ContextMenu.Label>
            <ContextMenu.Item selection>
              <ContextMenu.ItemIcon>
                <IoStar />
              </ContextMenu.ItemIcon>
              <ContextMenu.ItemLabel>Copy</ContextMenu.ItemLabel>
              <ContextMenu.ItemHint>⌘C</ContextMenu.ItemHint>
              <ContextMenu.ItemIndicator />
            </ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.Sub>
              <ContextMenu.SubTrigger>Share</ContextMenu.SubTrigger>
              <ContextMenu.SubPopover>
                <ContextMenu.Item>Mail</ContextMenu.Item>
              </ContextMenu.SubPopover>
            </ContextMenu.Sub>
          </ContextMenu.Group>
        </ContextMenu.Popover>
      </ContextMenu>
    ),
  },
  {
    typeName: "DatePickerClassNames",
    nestedScopeSlots: ["popover", "calendar"],
    parts: {
      Label: "label",
      Trigger: "trigger",
      Hint: "hint",
      Error: "error",
    },
    render: (ctx) => (
      <DatePicker
        open
        label="Date"
        hint="Hint"
        error="Error"
        defaultMonth={OCTOBER}
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <DatePicker.Label {...ctx.part("Label")}>Date</DatePicker.Label>
        <DatePicker.Trigger {...ctx.part("Trigger")} />
        <DatePicker.Hint {...ctx.part("Hint")}>Hint</DatePicker.Hint>
        <DatePicker.Error {...ctx.part("Error")}>Error</DatePicker.Error>
        <DatePicker.Popover />
      </DatePicker>
    ),
  },
  {
    typeName: "DialogClassNames",
    nestedScopeSlots: ["trigger"],
    parts: {
      Trigger: "trigger",
      Title: "title",
      Description: "description",
      Body: "body",
      Footer: "footer",
      Close: "close",
    },
    skipRootMerge: true,
    optionalSlots: ["headingBlock"],
    render: (ctx) => (
      <Dialog open classNames={ctx.classNames}>
        <Dialog.Trigger {...ctx.part("Trigger")}>Open</Dialog.Trigger>
        <Dialog.Panel motionController={ctx.motionController}>
          <Dialog.Header>
            <Dialog.Title {...ctx.part("Title")}>Account</Dialog.Title>
            <Dialog.Description {...ctx.part("Description")}>Hint</Dialog.Description>
          </Dialog.Header>
          <Dialog.Body {...ctx.part("Body")}>Body</Dialog.Body>
          <Dialog.Footer {...ctx.part("Footer")}>
            <Dialog.Close {...ctx.part("Close")} aria-label="Dismiss" />
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    ),
  },
  {
    typeName: "DrawerClassNames",
    nestedScopeSlots: ["trigger"],
    parts: {
      Trigger: "trigger",
      Title: "title",
      Description: "description",
      Body: "body",
      Footer: "footer",
      Close: "close",
    },
    skipRootMerge: true,
    optionalSlots: ["handle", "handleGrip", "headingBlock"],
    render: (ctx) => (
      <Drawer open classNames={ctx.classNames}>
        <Drawer.Trigger {...ctx.part("Trigger")}>Open</Drawer.Trigger>
        <Drawer.Panel motionController={ctx.motionController}>
          <Drawer.Header>
            <Drawer.Title {...ctx.part("Title")}>Menu</Drawer.Title>
            <Drawer.Description {...ctx.part("Description")}>Hint</Drawer.Description>
          </Drawer.Header>
          <Drawer.Body {...ctx.part("Body")}>Body</Drawer.Body>
          <Drawer.Footer {...ctx.part("Footer")}>
            <Drawer.Close {...ctx.part("Close")} aria-label="Close drawer" />
          </Drawer.Footer>
        </Drawer.Panel>
      </Drawer>
    ),
  },
  {
    typeName: "FieldClassNames",
    parts: { Label: "label", Hint: "hint", Error: "error" },
    render: (ctx) => (
      <Field
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <Field.Label {...ctx.part("Label")}>Name</Field.Label>
        <Input />
        <Field.Hint {...ctx.part("Hint")}>Hint</Field.Hint>
        <Field.Error {...ctx.part("Error")}>Error</Field.Error>
      </Field>
    ),
  },
  {
    typeName: "FieldSetClassNames",
    parts: {
      Legend: "legend",
      LegendHeader: "legendHeader",
      Group: "group",
      Actions: "actions",
    },
    render: (ctx) => (
      <Field.Set
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <Field.Legend {...ctx.part("Legend")}>
          <Field.LegendHeader {...ctx.part("LegendHeader")}>Group</Field.LegendHeader>
        </Field.Legend>
        <Field.Group {...ctx.part("Group")}>
          <Input label="A" />
        </Field.Group>
        <Field.Actions {...ctx.part("Actions")}>Ok</Field.Actions>
      </Field.Set>
    ),
  },
  {
    typeName: "KbdClassNames",
    nestedScopeSlots: ["group"],
    parts: { Text: "text" },
    optionalSlots: ["group", "separator"],
    render: (ctx) => (
      <>
        <Kbd
          classNames={ctx.classNames}
          className={ctx.className}
          motionController={ctx.motionController}
        >
          <Kbd.Text {...ctx.part("Text")} size="base">
            ⌘
          </Kbd.Text>
        </Kbd>
        <Kbd.Group classNames={ctx.classNames}>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </Kbd.Group>
      </>
    ),
  },
  {
    typeName: "LabelClassNames",
    render: (ctx) => (
      <Label
        required
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        Name
      </Label>
    ),
  },
  {
    typeName: "LinkClassNames",
    render: (ctx) => (
      <Link
        href="#docs"
        icon={<IoStar />}
        iconPosition="start"
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <Link.Icon iconPosition="start">
          <IoStar />
        </Link.Icon>
        Docs
        <Link.Icon iconPosition="end">
          <IoStar />
        </Link.Icon>
      </Link>
    ),
  },
  {
    typeName: "ListBoxClassNames",
    covers: ["ListBoxItemIndicatorClassNames"],
    parts: {
      Section: "section",
      Header: "header",
      Item: "item",
      Label: "label",
      Hint: "hint",
      Icon: "icon",
      ItemIndicator: "itemIndicator",
      Separator: "separator",
    },
    nestedScopeSlots: ["item", "label", "hint", "icon"],
    optionalSlots: ["empty", "itemIndicatorFill", "itemIndicatorMark"],
    render: (ctx) => (
      <ListBox
        aria-label="Cities"
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <ListBox.Section {...ctx.part("Section")}>
          <ListBox.Header {...ctx.part("Header")}>Europe</ListBox.Header>
          <ListBox.Item value="a" {...ctx.part("Item")}>
            <ListBox.Icon {...ctx.part("Icon")}>
              <IoStar />
            </ListBox.Icon>
            <ListBox.Label {...ctx.part("Label")}>Oslo</ListBox.Label>
            <ListBox.Hint {...ctx.part("Hint")}>NO</ListBox.Hint>
            <ListBox.ItemIndicator {...ctx.part("ItemIndicator")} />
          </ListBox.Item>
          <ListBox.Separator {...ctx.part("Separator")} />
          <ListBox.Empty>None</ListBox.Empty>
        </ListBox.Section>
      </ListBox>
    ),
  },
  {
    typeName: "LoadingClassNames",
    optionalSlots: ["spinner"],
    render: (ctx) => (
      <Loading
        indicator="dots"
        aria-label="Loading"
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      />
    ),
  },
  {
    typeName: "MeterClassNames",
    parts: {
      Label: "label",
      Header: "header",
      Value: "value",
      Hint: "hint",
      Error: "error",
    },
    // Track hosts its own scope, so the field controller does not see track/fill.
    notMotionTargets: ["track", "fill"],
    render: (ctx) => (
      <Meter
        value={40}
        label="Storage"
        hint="Hint"
        error="Error"
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <Meter.Header {...ctx.part("Header")}>
          <Meter.Label {...ctx.part("Label")}>Storage</Meter.Label>
          <Meter.Value {...ctx.part("Value")}>40%</Meter.Value>
        </Meter.Header>
        <Meter.Track value={40} />
        <Meter.Hint {...ctx.part("Hint")}>Hint</Meter.Hint>
        <Meter.Error {...ctx.part("Error")}>Error</Meter.Error>
      </Meter>
    ),
  },
  {
    typeName: "NumberInputClassNames",
    parts: {
      Label: "label",
      Control: "control",
      Decrement: "decrement",
      Increment: "increment",
      Hint: "hint",
      Error: "error",
    },
    render: (ctx) => (
      <NumberInput
        label="Quantity"
        hint="Hint"
        error="Error"
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <NumberInput.Label {...ctx.part("Label")}>Quantity</NumberInput.Label>
        <NumberInput.Decrement {...ctx.part("Decrement")} />
        <NumberInput.Control {...ctx.part("Control")} />
        <NumberInput.Increment {...ctx.part("Increment")} />
        <NumberInput.Hint {...ctx.part("Hint")}>Hint</NumberInput.Hint>
        <NumberInput.Error {...ctx.part("Error")}>Error</NumberInput.Error>
      </NumberInput>
    ),
  },
  {
    typeName: "PaginationClassNames",
    parts: {
      Summary: "summary",
      Content: "content",
      Previous: "previous",
      Next: "next",
      Page: "page",
      Ellipsis: "ellipsis",
    },
    render: (ctx) => (
      <Pagination
        page={2}
        totalPages={8}
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <Pagination.Summary {...ctx.part("Summary")} />
        <Pagination.Content {...ctx.part("Content")}>
          <Pagination.Previous {...ctx.part("Previous")} />
          <Pagination.Page {...ctx.part("Page")} page={1} />
          <Pagination.Ellipsis {...ctx.part("Ellipsis")} />
          <Pagination.Pages />
          <Pagination.Next {...ctx.part("Next")} />
        </Pagination.Content>
      </Pagination>
    ),
  },
  {
    typeName: "PinInputClassNames",
    parts: {
      Label: "label",
      Group: "shell",
      Hint: "hint",
      Error: "error",
    },
    render: (ctx) => (
      <PinInput
        label="Code"
        hint="Hint"
        error="Error"
        length={4}
        separator
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <PinInput.Label {...ctx.part("Label")}>Code</PinInput.Label>
        <PinInput.Shell {...ctx.part("Group")} />
        <PinInput.Hint {...ctx.part("Hint")}>Hint</PinInput.Hint>
        <PinInput.Error {...ctx.part("Error")}>Error</PinInput.Error>
      </PinInput>
    ),
  },
  {
    typeName: "ProgressBarClassNames",
    parts: {
      Label: "label",
      Header: "header",
      Value: "value",
      Hint: "hint",
      Error: "error",
    },
    // Track hosts its own scope, so the field controller does not see track/fill.
    notMotionTargets: ["track", "fill"],
    optionalSlots: ["indeterminateFill"],
    render: (ctx) => (
      <>
        <ProgressBar
          value={40}
          label="Upload"
          hint="Hint"
          error="Error"
          classNames={ctx.classNames}
          className={ctx.className}
          motionController={ctx.motionController}
        >
          <ProgressBar.Header {...ctx.part("Header")}>
            <ProgressBar.Label {...ctx.part("Label")}>Upload</ProgressBar.Label>
            <ProgressBar.Value {...ctx.part("Value")}>40%</ProgressBar.Value>
          </ProgressBar.Header>
          <ProgressBar.Track value={40} />
          <ProgressBar.Hint {...ctx.part("Hint")}>Hint</ProgressBar.Hint>
          <ProgressBar.Error {...ctx.part("Error")}>Error</ProgressBar.Error>
        </ProgressBar>
        <ProgressBar indeterminate label="Wait" classNames={ctx.classNames} />
      </>
    ),
  },
  {
    typeName: "RadioClassNames",
    covers: ["RadioIndicatorClassNames"],
    parts: {
      Control: "control",
      Indicator: "indicator",
      Content: "content",
      Label: "label",
      Hint: "hint",
      Error: "error",
    },
    notMotionTargets: ["content"],
    nestedScopeSlots: ["indicator", "indicatorFill", "indicatorMark"],
    optionalSlots: ["simpleLabelWrap", "simpleLabelText", "requiredMark", "input"],
    render: (ctx) => (
      <Radio
        label="A"
        hint="Hint"
        error="Error"
        required
        defaultChecked
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <Radio.Control {...ctx.part("Control")}>
          <Radio.Indicator {...ctx.part("Indicator")} />
        </Radio.Control>
        <Radio.Content {...ctx.part("Content")}>
          <Radio.Label {...ctx.part("Label")}>A</Radio.Label>
          <Radio.Hint {...ctx.part("Hint")}>Hint</Radio.Hint>
          <Radio.Error {...ctx.part("Error")}>Error</Radio.Error>
        </Radio.Content>
      </Radio>
    ),
  },
  {
    typeName: "RadioGroupClassNames",
    skipMotion: true,
    parts: {
      Legend: "legend",
      Hint: "hint",
      Error: "error",
      List: "list",
      Actions: "actions",
    },
    render: (ctx) => (
      <RadioGroup classNames={ctx.classNames} className={ctx.className}>
        <RadioGroup.Legend {...ctx.part("Legend")}>Choice</RadioGroup.Legend>
        <RadioGroup.Hint {...ctx.part("Hint")}>Pick</RadioGroup.Hint>
        <RadioGroup.Error {...ctx.part("Error")}>Required</RadioGroup.Error>
        <RadioGroup.List {...ctx.part("List")}>
          <Radio value="a" label="A" />
        </RadioGroup.List>
        <RadioGroup.Actions {...ctx.part("Actions")}>More</RadioGroup.Actions>
      </RadioGroup>
    ),
  },
  {
    typeName: "ScrollAreaClassNames",
    parts: {
      Viewport: "viewport",
      Scrollbar: "scrollbar",
      Thumb: "thumb",
      Corner: "corner",
    },
    render: (ctx) => (
      <ScrollArea
        aria-label="Cities"
        className={ctx.className}
        classNames={ctx.classNames}
        motionController={ctx.motionController}
      >
        <ScrollArea.Viewport {...ctx.part("Viewport")}>
          <p>Oslo</p>
          <p>Bergen</p>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical" {...ctx.part("Scrollbar")}>
          <ScrollArea.Thumb {...ctx.part("Thumb")} />
        </ScrollArea.Scrollbar>
        <ScrollArea.Scrollbar orientation="horizontal">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner {...ctx.part("Corner")} />
      </ScrollArea>
    ),
  },
  {
    typeName: "SelectionIndicatorClassNames",
    parts: { Fill: "fill", Mark: "mark" },
    render: (ctx) => (
      <SelectionIndicator
        selected
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <SelectionIndicator.Fill {...ctx.part("Fill")} />
        <SelectionIndicator.Mark {...ctx.part("Mark")}>✓</SelectionIndicator.Mark>
      </SelectionIndicator>
    ),
  },
  {
    typeName: "SelectionThumbClassNames",
    render: (ctx) => (
      <SelectionThumb
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <SelectionThumb.Icon />
      </SelectionThumb>
    ),
  },
  {
    typeName: "SelectionThumbIconClassNames",
    rootSlot: "root",
    render: (ctx) => (
      <SelectionThumb motionController={ctx.motionController}>
        <SelectionThumb.Icon
          classNames={ctx.classNames}
          className={ctx.className}
        />
      </SelectionThumb>
    ),
  },
  {
    typeName: "SkeletonClassNames",
    render: (ctx) => (
      <Skeleton
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      />
    ),
  },
  {
    typeName: "SkeletonCircleClassNames",
    render: (ctx) => (
      <Skeleton.Circle
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      />
    ),
  },
  {
    typeName: "SkeletonTextClassNames",
    render: (ctx) => (
      <Skeleton.Text
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      />
    ),
  },
  {
    typeName: "SkeletonBlockClassNames",
    render: (ctx) => (
      <Skeleton.Block
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      />
    ),
  },
  {
    typeName: "SkeletonRegionClassNames",
    render: (ctx) => (
      <Skeleton.Region
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        Loading
      </Skeleton.Region>
    ),
  },
  {
    typeName: "SliderClassNames",
    parts: {
      Label: "label",
      Header: "header",
      Value: "value",
      Hint: "hint",
      Error: "error",
    },
    optionalSlots: ["mark"],
    render: (ctx) => (
      <Slider
        defaultValue={40}
        label="Volume"
        hint="Hint"
        error="Error"
        icon={<IoStar />}
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <Slider.Header {...ctx.part("Header")}>
          <Slider.Label {...ctx.part("Label")}>Volume</Slider.Label>
          <Slider.Value {...ctx.part("Value")} />
        </Slider.Header>
        <Slider.Hint {...ctx.part("Hint")}>Hint</Slider.Hint>
        <Slider.Error {...ctx.part("Error")}>Error</Slider.Error>
        <Slider.Track icon={<IoStar />} />
      </Slider>
    ),
  },
  {
    typeName: "StepperClassNames",
    parts: {
      Item: "item",
      Trigger: "trigger",
      Indicator: "indicator",
      Title: "title",
      Description: "description",
    },
    optionalSlots: ["separator"],
    render: (ctx) => (
      <Stepper
        aria-label="Checkout"
        value="account"
        steps={[
          { value: "account", title: "Account", description: "Email" },
          { value: "shipping", title: "Shipping", description: "Address" },
        ]}
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <Stepper.Item value="account" {...ctx.part("Item")}>
          <Stepper.Trigger {...ctx.part("Trigger")}>
          <Stepper.Indicator {...ctx.part("Indicator")} />
          <Stepper.Title {...ctx.part("Title")}>Account</Stepper.Title>
          <Stepper.Description {...ctx.part("Description")}>Email</Stepper.Description>
          </Stepper.Trigger>
        </Stepper.Item>
      </Stepper>
    ),
  },
  {
    typeName: "StackClassNames",
    render: (ctx) => (
      <Stack
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        Row
      </Stack>
    ),
  },
  {
    typeName: "GridClassNames",
    render: (ctx) => (
      <Grid
        columns={2}
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        Cell
      </Grid>
    ),
  },
  {
    typeName: "ContainerClassNames",
    render: (ctx) => (
      <Container
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        Page
      </Container>
    ),
  },
  {
    typeName: "AppShellClassNames",
    render: (ctx) => (
      <AppShell
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <Header>Top</Header>
        <Sidebar aria-label="Sections">Side</Sidebar>
        Main
      </AppShell>
    ),
  },
  {
    typeName: "HeaderClassNames",
    render: (ctx) => (
      <Header
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        Title
      </Header>
    ),
  },
  {
    typeName: "SidebarClassNames",
    render: (ctx) => (
      <Sidebar aria-label="Sections"
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        Nav
      </Sidebar>
    ),
  },
  {
    typeName: "AspectRatioClassNames",
    render: (ctx) => (
      <AspectRatio
        ratio="16/9"
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        Frame
      </AspectRatio>
    ),
  },
  {
    typeName: "ResizableClassNames",
    render: (ctx) => (
      <Resizable
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <Resizable.Panel>A</Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel>B</Resizable.Panel>
      </Resizable>
    ),
  },
  {
    typeName: "SurfaceClassNames",
    render: (ctx) => (
      <Surface
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        Card
      </Surface>
    ),
  },
  {
    typeName: "SwitchClassNames",
    nestedScopeSlots: ["fill", "thumb", "track"],
    parts: {
      Control: "control",
      Track: "track",
      Fill: "fill",
      Thumb: "thumb",
      Content: "content",
      Label: "label",
      Hint: "hint",
      Error: "error",
    },
    notMotionTargets: ["content"],
    optionalSlots: ["iconOn", "iconOff", "simpleLabelWrap", "simpleLabelText"],
    render: (ctx) => (
      <Switch
        label="Alerts"
        hint="Hint"
        error="Error"
        defaultChecked
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <Switch.Control {...ctx.part("Control")}>
          <Switch.Track {...ctx.part("Track")} size="base">
            <Switch.Fill {...ctx.part("Fill")} />
            <Switch.Thumb {...ctx.part("Thumb")} />
          </Switch.Track>
        </Switch.Control>
        <Switch.Content {...ctx.part("Content")}>
          <Switch.Label {...ctx.part("Label")}>Alerts</Switch.Label>
          <Switch.Hint {...ctx.part("Hint")}>Hint</Switch.Hint>
          <Switch.Error {...ctx.part("Error")}>Error</Switch.Error>
        </Switch.Content>
      </Switch>
    ),
  },
  {
    typeName: "TabsClassNames",
    nestedScopeSlots: ["tab", "tabText", "panel"],
    parts: { List: "list", Tab: "tab", Panel: "panel" },
    render: (ctx) => (
      <Tabs
        defaultValue="one"
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <Tabs.List {...ctx.part("List")}>
          <Tabs.Tab value="one" {...ctx.part("Tab")}>
            One
          </Tabs.Tab>
          <Tabs.Tab value="two">Two</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="one" {...ctx.part("Panel")}>
          Panel
        </Tabs.Panel>
      </Tabs>
    ),
  },
  {
    typeName: "TagsInputClassNames",
    parts: {
      Label: "label",
      Shell: "shell",
      Hint: "hint",
      Error: "error",
    },
    render: (ctx) => (
      <TagsInput
        label="Topics"
        hint="Hint"
        error="Error"
        defaultValues={["design"]}
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <TagsInput.Label {...ctx.part("Label")}>Topics</TagsInput.Label>
        <TagsInput.Shell {...ctx.part("Shell")} />
        <TagsInput.Hint {...ctx.part("Hint")}>Hint</TagsInput.Hint>
        <TagsInput.Error {...ctx.part("Error")}>Error</TagsInput.Error>
      </TagsInput>
    ),
  },
  {
    typeName: "TimeFieldClassNames",
    nestedScopeSlots: ["shell", "prefix", "suffix", "segments"],
    parts: {
      Label: "label",
      Control: "control",
      Hint: "hint",
      Error: "error",
    },
    optionalSlots: ["prefix", "suffix", "keyboardInput"],
    render: (ctx) => (
      <TimeField
        label="Time"
        hint="Hint"
        error="Error"
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <TimeField.Label {...ctx.part("Label")}>Time</TimeField.Label>
        <TimeField.Control {...ctx.part("Control")} />
        <TimeField.Hint {...ctx.part("Hint")}>Hint</TimeField.Hint>
        <TimeField.Error {...ctx.part("Error")}>Error</TimeField.Error>
      </TimeField>
    ),
  },
  {
    typeName: "ToastClassNames",
    parts: {
      Indicator: "indicator",
      Message: "message",
      Content: "content",
      Title: "title",
      Description: "description",
      Action: "action",
      Close: "close",
    },
    notMotionTargets: ["message", "content"],
    optionalSlots: ["viewport", "scrim", "stack", "stackItem"],
    render: (ctx) => (
      <Toast.Provider>
        <Toast
          title="Saved"
          description="Ok"
          action="Undo"
          status="success"
          classNames={ctx.classNames}
          className={ctx.className}
          motionController={ctx.motionController}
        >
          <Toast.Indicator {...ctx.part("Indicator")} />
          <Toast.Message {...ctx.part("Message")}>
            <Toast.Content {...ctx.part("Content")}>
              <Toast.Title {...ctx.part("Title")}>Saved</Toast.Title>
              <Toast.Description {...ctx.part("Description")}>Ok</Toast.Description>
            </Toast.Content>
          </Toast.Message>
          <Toast.Action {...ctx.part("Action")}>Undo</Toast.Action>
          <Toast.Close {...ctx.part("Close")} />
        </Toast>
      </Toast.Provider>
    ),
  },
  {
    typeName: "ToggleButtonGroupClassNames",
    render: (ctx) => (
      <ToggleButtonGroup
        classNames={ctx.classNames}
        className={ctx.className}
        motionController={ctx.motionController}
      >
        <ToggleButton>A</ToggleButton>
        <ToggleButton>B</ToggleButton>
      </ToggleButtonGroup>
    ),
  },
];
