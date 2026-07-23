import { useMemo, useState, type ChangeEvent } from "react";
import { IoAdd, IoCheckmark, IoMoon, IoSunny } from "react-icons/io5";

import { AlertDialog, primaryButtonVariantForAlertTone } from "@/components/composite/AlertDialog";
import { Alert } from "@/components/core/Alert";
import { Avatar } from "@/components/core/Avatar";
import { Badge } from "@/components/core/Badge";
import { Button } from "@/components/core/Button";
import { Calendar } from "@/components/core/Calendar";
import { Card } from "@/components/core/Card";
import { Checkbox } from "@/components/core/Checkbox";
import { CloseButton } from "@/components/core/CloseButton";
import { ColorPicker } from "@/components/core/ColorPicker";
import { ComboBox } from "@/components/core/ComboBox";
import { Dialog } from "@/components/core/Dialog";
import { Disclosure } from "@/components/core/Disclosure";
import { Drawer } from "@/components/core/Drawer";
import { Dropdown } from "@/components/core/Dropdown";
import { Expandable } from "@/components/core/Expandable";
import { Input } from "@/components/core/Input";
import { ListBox } from "@/components/core/ListBox";
import { Popover } from "@/components/core/Popover";
import { Radio } from "@/components/core/Radio";
import { SearchInput } from "@/components/core/SearchInput";
import { Slider } from "@/components/core/Slider";
import { Surface } from "@/components/core/Surface";
import { Switch } from "@/components/core/Switch";
import { Tabs } from "@/components/core/Tabs";
import { Table, type Selection, type SortDescriptor } from "@/components/core/Table";
import { Text } from "@/components/core/Text";
import { TextArea } from "@/components/core/TextArea";
import { TimeField } from "@/components/core/TimeField";
import { useToast } from "@/components/core/Toast";
import { ToggleButton } from "@/components/core/ToggleButton";
import { Tooltip } from "@/components/core/Tooltip";
import { glossDottedGridStyle } from "@/stories-utils/glossStoryChrome";
import { PIN_IMAGE1, PIN_IMAGE2, PIN_IMAGE3 } from "@/stories-utils/mockImages";
import { IoTimeOutline, IoGlobeOutline } from "react-icons/io5";

const GLOSS_STATUSES = ["default", "danger", "success", "info", "warning"] as const;

const GLOSS_COMBO_OPTIONS = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
];

const EXPANDABLE_INFO_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

type GlossTableRow = {
  id: number;
  name: string;
  role: string;
  status: "Active" | "On Leave";
};

const GLOSS_TABLE_ROWS: GlossTableRow[] = [
  { id: 1, name: "Kate Moore", role: "CEO", status: "Active" },
  { id: 2, name: "John Smith", role: "CTO", status: "Active" },
  { id: 3, name: "Sara Johnson", role: "CMO", status: "On Leave" },
  { id: 4, name: "Ada Lovelace", role: "Engineer", status: "Active" },
];

const GLOSS_TABLE_STATUS_BADGE: Record<GlossTableRow["status"], "success" | "warning"> = {
  Active: "success",
  "On Leave": "warning",
};

export function GlossComponentsDemo() {
  const [glossDialogOpen, setGlossDialogOpen] = useState(false);
  const [glossAlertOpen, setGlossAlertOpen] = useState(false);
  const [cardPressCount, setCardPressCount] = useState(0);
  const [glossComboValue, setGlossComboValue] = useState("react");
  const [glossTimeValue, setGlossTimeValue] = useState("09:30");
  const [glossCheckA, setGlossCheckA] = useState(false);
  const [glossCheckB, setGlossCheckB] = useState(true);
  const [glossRadio, setGlossRadio] = useState(false);
  const [glossSwitch, setGlossSwitch] = useState(false);
  const [glossSlider, setGlossSlider] = useState(40);
  const [glossSearch, setGlossSearch] = useState("");
  const [glossToggle, setGlossToggle] = useState(false);
  const [glossDrawerOpen, setGlossDrawerOpen] = useState(false);
  const [glossLang, setGlossLang] = useState("ru");
  const [glossTab, setGlossTab] = useState("overview");
  const [glossListBox, setGlossListBox] = useState("ru");
  const [glossCalendarDate, setGlossCalendarDate] = useState<Date | null>(null);
  const [glossColor, setGlossColor] = useState("#3b82f6");
  const [glossTableSort, setGlossTableSort] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  const [glossTableSelection, setGlossTableSelection] = useState<Selection>(new Set<number>());
  const { toast } = useToast();

  const glossTableSortedRows = useMemo(() => {
    const col = glossTableSort.column as keyof GlossTableRow;
    return [...GLOSS_TABLE_ROWS].sort((a, b) => {
      const cmp = String(a[col]).localeCompare(String(b[col]), "ru");
      return glossTableSort.direction === "descending" ? -cmp : cmp;
    });
  }, [glossTableSort]);

  const glossTableSelectionLabel =
    glossTableSelection === "all"
      ? "All"
      : glossTableSelection.size > 0
        ? Array.from(glossTableSelection).join(", ")
        : "No";

  return (
    <div
      className="flex flex-col gap-2xlarge rounded-mid p-large"
      style={{ backgroundColor: "var(--color-background)", ...glossDottedGridStyle }}
    >
      <div className="flex flex-col gap-xsmall">
        <Text as="p" variant="small" className="text-muted">
          Universal <code className="text-primary">variant=&quot;gloss&quot;</code> — glass
          surface with conic-stroke, GSAP hover-lift and adaptive glare.
        </Text>
      </div>

      <div className="flex flex-col gap-small">
        <Text as="h3" variant="base" className="font-medium">
          Buttons
        </Text>
        <div className="flex flex-wrap items-center gap-small">
          {GLOSS_STATUSES.map((status) => (
            <Button key={status} variant="gloss" status={status} className="capitalize">
              {status}
            </Button>
          ))}
          <Button variant="gloss" icon={<IoAdd aria-hidden />}>
            With icon
          </Button>
          <CloseButton variant="gloss" aria-label="Close gloss" />
          <ToggleButton
            variant="gloss"
            pressed={glossToggle}
            onPressedChange={setGlossToggle}
          >
            Toggle gloss
          </ToggleButton>
        </div>
      </div>

      <div className="flex flex-col gap-small">
        <Text as="h3" variant="base" className="font-medium">
          Input fields
        </Text>
        <div className="grid max-w-md gap-small">
          <Input.Control variant="gloss" placeholder="you@example.com" autoComplete="email" />
          <Input.Control variant="gloss" prefix="https://" suffix=".com" placeholder="example" />
          <ComboBox
            variant="gloss"
            label="Framework"
            options={GLOSS_COMBO_OPTIONS}
            value={glossComboValue}
            onValueChange={setGlossComboValue}
            hint={`Selected: ${glossComboValue}`}
          />
          <TimeField
            variant="gloss"
            label="Time"
            value={glossTimeValue}
            onValueChange={setGlossTimeValue}
            prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
            hint="Glass shell TimeField"
          />
          <TextArea
            variant="gloss"
            label="Comment"
            placeholder="Message text…"
            rows={2}
            hint="TextArea gloss"
          />
          <SearchInput
            variant="gloss"
            aria-label="Search gloss"
            placeholder="Find…"
            value={glossSearch}
            onChange={(e) => setGlossSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-small">
        <Text as="h3" variant="base" className="font-medium">
          Disclosure
        </Text>
        <Disclosure variant="gloss" defaultOpen className="max-w-md">
          <Disclosure.Trigger>Gloss disclosure</Disclosure.Trigger>
          <Disclosure.Content>
            <Text as="p" variant="small" className="text-muted">
              Glass panel with hover-lift on the root.
            </Text>
          </Disclosure.Content>
        </Disclosure>
      </div>

      <div className="flex flex-col gap-small">
        <Text as="h3" variant="base" className="font-medium">
          Popover and Dropdown
        </Text>
        <div className="flex flex-wrap items-center gap-small">
          <Popover variant="gloss">
            <Popover.Trigger asChild>
              <Button variant="gloss">Gloss Popover</Button>
            </Popover.Trigger>
            <Popover.Content showArrow>
              <Popover.Header>
                <Popover.Title>Heading</Popover.Title>
                <Popover.Description>Glass pop-up panel</Popover.Description>
              </Popover.Header>
              <Popover.Body>
                <Text as="p" variant="small" className="text-muted">
                  Content inside gloss Popover.
                </Text>
              </Popover.Body>
            </Popover.Content>
          </Popover>
          <Dropdown popoverVariant="gloss" value={glossLang} onValueChange={(v) => setGlossLang(v as string)}>
            <Dropdown.Trigger asChild>
              <Button variant="gloss">Gloss Dropdown</Button>
            </Dropdown.Trigger>
            <Dropdown.Popover>
              <Dropdown.Item value="ru" selection={false}>
                <Dropdown.Label>Russian</Dropdown.Label>
              </Dropdown.Item>
              <Dropdown.Item value="en" selection={false}>
                <Dropdown.Label>English</Dropdown.Label>
              </Dropdown.Item>
            </Dropdown.Popover>
          </Dropdown>
        </div>
      </div>

      <div className="flex flex-col gap-small">
        <Text as="h3" variant="base" className="font-medium">
          Toast, Tooltip, Tabs, Calendar, ListBox
        </Text>
        <div className="flex flex-wrap items-center gap-small">
          <Button
            variant="gloss"
            onClick={() =>
              toast.show({
                title: "Gloss toast",
                description: "Glass notice with hover-lift.",
                status: "info",
                variant: "gloss",
              })
            }
          >
            Gloss Toast
          </Button>
          <Tooltip variant="gloss" status="info">
            <Tooltip.Trigger asChild>
              <Button variant="gloss">Gloss Tooltip</Button>
            </Tooltip.Trigger>
            <Tooltip.Content>Glass tip (`surface=&quot;gloss&quot;`)</Tooltip.Content>
          </Tooltip>
        </div>
        <Tabs variant="gloss" value={glossTab} onValueChange={setGlossTab} className="max-w-md">
          <Tabs.List>
            <Tabs.Tab value="overview">Review</Tabs.Tab>
            <Tabs.Tab value="details">Details</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="overview" className="pt-large">
            <Text as="p" variant="small" className="text-muted">
              Gloss Tabs — glass tab list with indicator.
            </Text>
          </Tabs.Panel>
          <Tabs.Panel value="details" className="pt-large">
            <Text as="p" variant="small" className="text-muted">
              Active tab: {glossTab}
            </Text>
          </Tabs.Panel>
        </Tabs>
        <div className="flex flex-wrap items-start gap-large">
          <Calendar
            variant="gloss"
            mode="single"
            value={glossCalendarDate}
            onValueChange={setGlossCalendarDate}
          />
          <ListBox
            variant="gloss"
            className="min-w-[14rem]"
            value={glossListBox}
            onValueChange={(v) => setGlossListBox(v as string)}
          >
            <ListBox.Section>
              <ListBox.Header>Languages</ListBox.Header>
              <ListBox.Item value="ru">
                <ListBox.ItemIndicator />
                <ListBox.Label>Russian</ListBox.Label>
              </ListBox.Item>
              <ListBox.Item value="en">
                <ListBox.ItemIndicator />
                <ListBox.Label>English</ListBox.Label>
                <ListBox.Icon>
                  <IoGlobeOutline aria-hidden />
                </ListBox.Icon>
              </ListBox.Item>
            </ListBox.Section>
          </ListBox>
        </div>
      </div>

      <div className="flex flex-col gap-small">
        <Text as="h3" variant="base" className="font-medium">
          ColorPicker and Table
        </Text>
        <ColorPicker variant="gloss" value={glossColor} onValueChange={setGlossColor}>
          <ColorPicker.Trigger />
          <ColorPicker.Content presets={["#3b82f6", "#22c55e", "#ef4444", "#eab308"]} />
        </ColorPicker>
        <div className="grid gap-large xl:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-xsmall">
            <Text as="p" variant="small" className="text-muted">
              Base table
            </Text>
            <Table variant="gloss" className="w-full">
              <Table.ScrollContainer>
                <Table.Content aria-label="Gloss team" className="min-w-[28rem]">
                  <Table.Header>
                    <Table.Column isRowHeader>Name</Table.Column>
                    <Table.Column>Role</Table.Column>
                    <Table.Column>Status</Table.Column>
                  </Table.Header>
                  <Table.Body items={GLOSS_TABLE_ROWS}>
                    {(row: GlossTableRow) => (
                      <Table.Row key={row.id} id={row.id}>
                        <Table.Cell>{row.name}</Table.Cell>
                        <Table.Cell>{row.role}</Table.Cell>
                        <Table.Cell>
                          <Badge status={GLOSS_TABLE_STATUS_BADGE[row.status]}>{row.status}</Badge>
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </div>
          <div className="flex min-w-0 flex-col gap-xsmall">
            <Text as="p" variant="small" className="text-muted">
              Sorting by columns
            </Text>
            <Table variant="gloss" className="w-full">
              <Table.ScrollContainer>
                <Table.Content
                  aria-label="Gloss sorting"
                  className="min-w-[28rem]"
                  sortDescriptor={glossTableSort}
                  onSortChange={setGlossTableSort}
                >
                  <Table.Header>
                    <Table.Column allowsSorting isRowHeader id="name">
                      Name
                    </Table.Column>
                    <Table.Column allowsSorting id="role">
                      Role
                    </Table.Column>
                    <Table.Column allowsSorting id="status">
                      Status
                    </Table.Column>
                  </Table.Header>
                  <Table.Body items={glossTableSortedRows}>
                    {(row: GlossTableRow) => (
                      <Table.Row key={row.id} id={row.id}>
                        <Table.Cell>{row.name}</Table.Cell>
                        <Table.Cell>{row.role}</Table.Cell>
                        <Table.Cell>
                          <Badge status={GLOSS_TABLE_STATUS_BADGE[row.status]}>{row.status}</Badge>
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </div>
          <div className="flex min-w-0 flex-col gap-xsmall xl:col-span-2">
            <Text as="p" variant="small" className="text-muted">
              Multiple row selection · selected: {glossTableSelectionLabel}
            </Text>
            <Table variant="gloss" className="w-full max-w-3xl">
              <Table.ScrollContainer>
                <Table.Content
                  aria-label="Gloss row selection"
                  className="min-w-[28rem]"
                  selectionMode="multiple"
                  selectedKeys={glossTableSelection}
                  onSelectionChange={setGlossTableSelection}
                >
                  <Table.Header>
                    <Table.Column isRowHeader>Name</Table.Column>
                    <Table.Column>Role</Table.Column>
                    <Table.Column>Status</Table.Column>
                  </Table.Header>
                  <Table.Body items={GLOSS_TABLE_ROWS}>
                    {(row: GlossTableRow) => (
                      <Table.Row key={row.id} id={row.id}>
                        <Table.Cell>{row.name}</Table.Cell>
                        <Table.Cell>{row.role}</Table.Cell>
                        <Table.Cell>
                          <Badge status={GLOSS_TABLE_STATUS_BADGE[row.status]}>{row.status}</Badge>
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
              <Table.Footer>
                <Text as="span" variant="small" className="text-muted">
                  {GLOSS_TABLE_ROWS.length} records
                </Text>
              </Table.Footer>
            </Table>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-small">
        <Text as="h3" variant="base" className="font-medium">
          Expandable
        </Text>
        <div className="flex max-w-md flex-col gap-small">
          <Expandable
            variant="gloss"
            defaultOpen
            title="Gloss expandable"
            icon={EXPANDABLE_INFO_ICON}
            description="Glass panel throughout the unit"
          >
            <Text as="p" variant="small" className="text-muted">
              Content inside gloss Expandable.
            </Text>
          </Expandable>
        </div>
      </div>

      <div className="flex flex-col gap-small">
        <Text as="h3" variant="base" className="font-medium">
          Indicators
        </Text>
        <div className="flex flex-wrap items-center gap-large">
          <Checkbox
            label="Checkbox gloss (off)"
            variant="gloss"
            checked={glossCheckA}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setGlossCheckA(e.target.checked)}
          />
          <Checkbox
            label="Checkbox gloss (on)"
            variant="gloss"
            checked={glossCheckB}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setGlossCheckB(e.target.checked)}
            icon={<IoCheckmark aria-hidden />}
          />
          <Radio
            label="Radio gloss (off)"
            variant="gloss"
            checked={glossRadio}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setGlossRadio(e.target.checked)}
          />
          <Radio
            label="Radio gloss (on)"
            variant="gloss"
            checked={!glossRadio}
            onChange={() => setGlossRadio(false)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-large">
          <Switch
            gloss
            onChange={(e: ChangeEvent<HTMLInputElement>) => setGlossSwitch(e.target.checked)}
            aria-label="Gloss switch"
          />
          <Switch.Control
            gloss
            checked={!glossSwitch}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setGlossSwitch(!e.target.checked)}
            iconOff={<IoMoon aria-hidden />}
            iconOn={<IoSunny aria-hidden />}
            aria-label="Gloss switch with icons"
          />
          <Text as="span" variant="small" className="text-muted">
            Switch: track and circle gloss, filling primary
          </Text>
        </div>
        <div className="flex max-w-xs flex-col gap-xsmall">
          <Slider.Track
            gloss
            value={glossSlider}
            onValueChange={setGlossSlider}
            ariaLabel="Gloss slider"
          />
          <Text as="span" variant="small" className="text-muted">
            Slider gloss: rail original, circle gloss — meaning: {glossSlider}
          </Text>
        </div>
      </div>

      <div className="flex flex-col gap-small">
        <Text as="h3" variant="base" className="font-medium">
          Badges and alerts
        </Text>
        <div className="flex flex-wrap items-center gap-small">
          <Badge variant="gloss">Gloss</Badge>
          <Badge variant="gloss" status="success" icon={<IoCheckmark aria-hidden />}>
            Success
          </Badge>
          <Badge variant="gloss" status="danger">
            Danger
          </Badge>
          <Badge variant="gloss" status="info">
            Info
          </Badge>
        </div>
        <div className="flex flex-col gap-small">
          <Alert variant="gloss" status="info" title="Gloss alert" description="Glass panel with hover-lift." />
          <Alert variant="gloss" status="danger" title="Error" description="Status - text and icon color only." />
        </div>
      </div>

      <div className="flex flex-col gap-small">
        <Text as="h3" variant="base" className="font-medium">
          Surfaces
        </Text>
        <div className="grid gap-large lg:grid-cols-2">
          <Surface variant="gloss" padding="mid" radius="mid">
            <Text as="p" variant="base" className="font-medium">
              Surface gloss
            </Text>
            <Text as="p" variant="small" className="text-muted">
              Static glass panel.
            </Text>
          </Surface>
          <Card variant="gloss" pressable onPress={() => setCardPressCount((n) => n + 1)}>
            <Card.Header>
              <Card.Title>Card gloss + pressable</Card.Title>
              <Card.Description>
                Clicks: {cardPressCount}. Hover-lift and squeeze like a button.
              </Card.Description>
            </Card.Header>
            <Card.Footer className="flex justify-end gap-small">
              <Button variant="gloss" size="small">
                Gloss
              </Button>
              <Button variant="primary" size="small">
                Primary
              </Button>
            </Card.Footer>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-small">
        <Text as="h3" variant="base" className="font-medium">
          Avatars
        </Text>
        <div className="flex flex-wrap items-center gap-large">
          <Avatar variant="gloss" size="small" label="Ada" src={PIN_IMAGE1} alt="" loading="lazy" />
          <Avatar variant="gloss" size="base" label="Grace" src={PIN_IMAGE2} alt="" loading="lazy" />
          <Avatar variant="gloss" size="mid" label="Alan" src={PIN_IMAGE3} alt="" loading="lazy" />
          <Avatar variant="gloss" size="large" label="Burne" />
        </div>
      </div>

      <div className="flex flex-col gap-small">
        <Text as="h3" variant="base" className="font-medium">
          Modal windows
        </Text>
        <div className="flex flex-wrap gap-small">
          <Button variant="gloss" onClick={() => setGlossDialogOpen(true)}>
            Gloss Dialog
          </Button>
          <Button variant="gloss" status="danger" onClick={() => setGlossAlertOpen(true)}>
            Gloss AlertDialog
          </Button>
          <Button variant="gloss" onClick={() => setGlossDrawerOpen(true)}>
            Gloss Drawer
          </Button>
        </div>
      </div>

      <Dialog open={glossDialogOpen} onOpenChange={setGlossDialogOpen}>
        <Dialog.Panel variant="gloss">
          <Dialog.Header>
          <Dialog.HeadingBlock>
            <Dialog.Title>Gloss Dialog</Dialog.Title>
            <Dialog.Description>Glass modal panel with gloss-fields.</Dialog.Description>
          </Dialog.HeadingBlock>
          <Dialog.Close />
        </Dialog.Header>
        <Dialog.Body className="flex flex-col gap-mid">
          <Input>
            <Input.Label>Name</Input.Label>
            <Input.Control variant="gloss" name="name" placeholder="Ivan" autoComplete="name" />
          </Input>
          <Input>
            <Input.Label>Email</Input.Label>
            <Input.Control variant="gloss" name="email" placeholder="you@example.com" autoComplete="email" />
          </Input>
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="gloss" onClick={() => setGlossDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setGlossDialogOpen(false)}>
            Save
          </Button>
        </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>

      <AlertDialog open={glossAlertOpen} onOpenChange={setGlossAlertOpen} variant="gloss" status="danger">
        <AlertDialog.Panel>
          <AlertDialog.Header>
          <AlertDialog.HeadingBlock>
            <AlertDialog.Title>Delete project?</AlertDialog.Title>
            <AlertDialog.Description>
              Gloss AlertDialog — confirmation on glass panel.
            </AlertDialog.Description>
          </AlertDialog.HeadingBlock>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <Button type="button" variant="gloss" onClick={() => setGlossAlertOpen(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant={primaryButtonVariantForAlertTone("danger")}
            status="danger"
            onClick={() => setGlossAlertOpen(false)}
          >
            Delete
          </Button>
        </AlertDialog.Footer>
        </AlertDialog.Panel>
      </AlertDialog>

      <Drawer open={glossDrawerOpen} onOpenChange={setGlossDrawerOpen}>
        <Drawer.Panel variant="gloss">
          <Drawer.Header>
          <Drawer.HeadingBlock>
            <Drawer.Title>Gloss Drawer</Drawer.Title>
            <Drawer.Description>Glass side panel.</Drawer.Description>
          </Drawer.HeadingBlock>
          <Drawer.Close />
        </Drawer.Header>
        <Drawer.Body className="flex flex-col gap-mid">
          <Input>
            <Input.Label>Note</Input.Label>
            <Input.Control variant="gloss" placeholder="Text…" />
          </Input>
        </Drawer.Body>
        <Drawer.Footer>
          <Button variant="gloss" onClick={() => setGlossDrawerOpen(false)}>
            Close
          </Button>
        </Drawer.Footer>
        </Drawer.Panel>
      </Drawer>
    </div>
  );
}
