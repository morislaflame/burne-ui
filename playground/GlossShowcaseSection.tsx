import { useMemo, useState, type ChangeEvent } from "react";
import { IoAdd, IoCheckmark, IoMoon, IoSunny } from "react-icons/io5";

import {
  AlertDialog,
  primaryButtonVariantForAlertTone,
} from "@/components/composite/AlertDialog";
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
import { glossDottedGridStyle } from "@/components/core/utils/glossStoryChrome";
import { PIN_IMAGE1, PIN_IMAGE2, PIN_IMAGE3 } from "@/utils/mockImages";
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

export function GlossShowcaseSection() {
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
      ? "Все"
      : glossTableSelection.size > 0
        ? Array.from(glossTableSelection).join(", ")
        : "Нет";

  return (
    <div
      className="flex flex-col gap-xlarge rounded-mid p-mid"
      style={{ backgroundColor: "var(--color-background)", ...glossDottedGridStyle }}
    >
      <div className="flex flex-col gap-xsmall">
        <Text as="p" variant="small" className="text-muted">
          Универсальный <code className="text-primary">variant=&quot;gloss&quot;</code> — стеклянная
          поверхность с conic-обводкой, GSAP hover-lift и адаптивным бликом.
        </Text>
      </div>

      <div className="flex flex-col gap-small">
        <Text as="h3" variant="base" className="font-medium">
          Кнопки
        </Text>
        <div className="flex flex-wrap items-center gap-small">
          {GLOSS_STATUSES.map((status) => (
            <Button key={status} variant="gloss" status={status} className="capitalize">
              {status}
            </Button>
          ))}
          <Button variant="gloss" leftIcon={<IoAdd aria-hidden />}>
            С иконкой
          </Button>
          <CloseButton variant="gloss" aria-label="Закрыть gloss" />
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
          Поля ввода
        </Text>
        <div className="grid max-w-md gap-small">
          <Input.Control variant="gloss" placeholder="you@example.com" autoComplete="email" />
          <Input.Control variant="gloss" prefix="https://" suffix=".com" placeholder="example" />
          <ComboBox
            variant="gloss"
            label="Фреймворк"
            options={GLOSS_COMBO_OPTIONS}
            value={glossComboValue}
            onValueChange={setGlossComboValue}
            hint={`Выбрано: ${glossComboValue}`}
          />
          <TimeField
            variant="gloss"
            label="Время"
            value={glossTimeValue}
            onValueChange={setGlossTimeValue}
            prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
            hint="Стеклянная оболочка TimeField"
          />
          <TextArea
            variant="gloss"
            label="Комментарий"
            placeholder="Текст сообщения…"
            rows={2}
            hint="TextArea gloss"
          />
          <SearchInput
            variant="gloss"
            aria-label="Поиск gloss"
            placeholder="Найти…"
            value={glossSearch}
            onValueChange={setGlossSearch}
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
              Стеклянная панель с hover-lift на корне.
            </Text>
          </Disclosure.Content>
        </Disclosure>
      </div>

      <div className="flex flex-col gap-small">
        <Text as="h3" variant="base" className="font-medium">
          Popover и Dropdown
        </Text>
        <div className="flex flex-wrap items-center gap-small">
          <Popover variant="gloss">
            <Popover.Trigger>
              <Button variant="gloss">Gloss Popover</Button>
            </Popover.Trigger>
            <Popover.Content showArrow>
              <Popover.Header>
                <Popover.Label>Заголовок</Popover.Label>
                <Popover.Hint>Стеклянная всплывающая панель</Popover.Hint>
              </Popover.Header>
              <Popover.Body>
                <Text as="p" variant="small" className="text-muted">
                  Контент внутри gloss Popover.
                </Text>
              </Popover.Body>
            </Popover.Content>
          </Popover>
          <Dropdown popoverVariant="gloss" value={glossLang} onValueChange={(v) => setGlossLang(v as string)}>
            <Dropdown.Trigger>
              <Button variant="gloss">Gloss Dropdown</Button>
            </Dropdown.Trigger>
            <Dropdown.Popover>
              <Dropdown.Item value="ru" selection={false}>
                <Dropdown.ItemLabel>Русский</Dropdown.ItemLabel>
              </Dropdown.Item>
              <Dropdown.Item value="en" selection={false}>
                <Dropdown.ItemLabel>English</Dropdown.ItemLabel>
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
                description: "Стеклянное уведомление с hover-lift.",
                status: "info",
                variant: "gloss",
              })
            }
          >
            Gloss Toast
          </Button>
          <Tooltip surface="gloss" variant="info">
            <Tooltip.Trigger>
              <Button variant="gloss">Gloss Tooltip</Button>
            </Tooltip.Trigger>
            <Tooltip.Content>Стеклянная подсказка (`surface=&quot;gloss&quot;`)</Tooltip.Content>
          </Tooltip>
        </div>
        <Tabs variant="gloss" value={glossTab} onValueChange={setGlossTab} className="max-w-md">
          <Tabs.List>
            <Tabs.Tab value="overview">Обзор</Tabs.Tab>
            <Tabs.Tab value="details">Детали</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="overview" className="pt-mid">
            <Text as="p" variant="small" className="text-muted">
              Gloss Tabs — стеклянный список вкладок с индикатором.
            </Text>
          </Tabs.Panel>
          <Tabs.Panel value="details" className="pt-mid">
            <Text as="p" variant="small" className="text-muted">
              Активная вкладка: {glossTab}
            </Text>
          </Tabs.Panel>
        </Tabs>
        <div className="flex flex-wrap items-start gap-mid">
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
              <ListBox.Header>Языки</ListBox.Header>
              <ListBox.Item value="ru">
                <ListBox.ItemIndicator />
                <ListBox.Label>Русский</ListBox.Label>
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
          ColorPicker и Table
        </Text>
        <ColorPicker variant="gloss" value={glossColor} onValueChange={setGlossColor}>
          <ColorPicker.Trigger />
          <ColorPicker.Content presets={["#3b82f6", "#22c55e", "#ef4444", "#eab308"]} />
        </ColorPicker>
        <div className="grid gap-mid xl:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-xsmall">
            <Text as="p" variant="small" className="text-muted">
              Базовая таблица
            </Text>
            <Table variant="gloss" className="w-full">
              <Table.ScrollContainer>
                <Table.Content aria-label="Gloss команда" className="min-w-[28rem]">
                  <Table.Header>
                    <Table.Column isRowHeader>Имя</Table.Column>
                    <Table.Column>Роль</Table.Column>
                    <Table.Column>Статус</Table.Column>
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
              Сортировка по колонкам
            </Text>
            <Table variant="gloss" className="w-full">
              <Table.ScrollContainer>
                <Table.Content
                  aria-label="Gloss сортировка"
                  className="min-w-[28rem]"
                  sortDescriptor={glossTableSort}
                  onSortChange={setGlossTableSort}
                >
                  <Table.Header>
                    <Table.Column allowsSorting isRowHeader id="name">
                      Имя
                    </Table.Column>
                    <Table.Column allowsSorting id="role">
                      Роль
                    </Table.Column>
                    <Table.Column allowsSorting id="status">
                      Статус
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
              Множественный выбор строк · выбрано: {glossTableSelectionLabel}
            </Text>
            <Table variant="gloss" className="w-full max-w-3xl">
              <Table.ScrollContainer>
                <Table.Content
                  aria-label="Gloss выбор строк"
                  className="min-w-[28rem]"
                  selectionMode="multiple"
                  selectedKeys={glossTableSelection}
                  onSelectionChange={setGlossTableSelection}
                >
                  <Table.Header>
                    <Table.Column isRowHeader>Имя</Table.Column>
                    <Table.Column>Роль</Table.Column>
                    <Table.Column>Статус</Table.Column>
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
                  {GLOSS_TABLE_ROWS.length} записей
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
            description="Стеклянная панель на всём блоке"
          >
            <Text as="p" variant="small" className="text-muted">
              Контент внутри gloss Expandable.
            </Text>
          </Expandable>
        </div>
      </div>

      <div className="flex flex-col gap-small">
        <Text as="h3" variant="base" className="font-medium">
          Индикаторы
        </Text>
        <div className="flex flex-wrap items-center gap-mid">
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
            checkIcon={<IoCheckmark aria-hidden />}
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
        <div className="flex flex-wrap items-center gap-mid">
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
            aria-label="Gloss switch с иконками"
          />
          <Text as="span" variant="small" className="text-muted">
            Switch: трек и кружок gloss, заливка primary
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
            Slider gloss: рельса original, кружок gloss — значение: {glossSlider}
          </Text>
        </div>
      </div>

      <div className="flex flex-col gap-small">
        <Text as="h3" variant="base" className="font-medium">
          Бейджи и алерты
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
          <Alert variant="gloss" status="info" title="Gloss alert" description="Стеклянная панель с hover-lift." />
          <Alert variant="gloss" status="danger" title="Ошибка" description="Статус — только цвет текста и иконки." />
        </div>
      </div>

      <div className="flex flex-col gap-small">
        <Text as="h3" variant="base" className="font-medium">
          Поверхности
        </Text>
        <div className="grid gap-mid lg:grid-cols-2">
          <Surface variant="gloss" padding="plus" radius="mid">
            <Text as="p" variant="base" className="font-medium">
              Surface gloss
            </Text>
            <Text as="p" variant="small" className="text-muted">
              Статическая стеклянная панель.
            </Text>
          </Surface>
          <Card variant="gloss" pressable onPress={() => setCardPressCount((n) => n + 1)}>
            <Card.Header>
              <Card.Title>Card gloss + pressable</Card.Title>
              <Card.Description>
                Нажатий: {cardPressCount}. Hover-lift и squeeze как у кнопки.
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
          Аватары
        </Text>
        <div className="flex flex-wrap items-center gap-mid">
          <Avatar variant="gloss" size="small" label="Ada" src={PIN_IMAGE1} alt="" loading="lazy" />
          <Avatar variant="gloss" size="base" label="Grace" src={PIN_IMAGE2} alt="" loading="lazy" />
          <Avatar variant="gloss" size="mid" label="Alan" src={PIN_IMAGE3} alt="" loading="lazy" />
          <Avatar variant="gloss" size="large" label="Burne" />
        </div>
      </div>

      <div className="flex flex-col gap-small">
        <Text as="h3" variant="base" className="font-medium">
          Модальные окна
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

      <Dialog open={glossDialogOpen} onOpenChange={setGlossDialogOpen} variant="gloss">
        <Dialog.Header>
          <Dialog.HeadingBlock>
            <Dialog.Title>Gloss Dialog</Dialog.Title>
            <Dialog.Description>Стеклянная модальная панель с gloss-полями.</Dialog.Description>
          </Dialog.HeadingBlock>
          <Dialog.Close />
        </Dialog.Header>
        <Dialog.Body className="flex flex-col gap-plus">
          <Input>
            <Input.Label>Имя</Input.Label>
            <Input.Control variant="gloss" name="name" placeholder="Иван" autoComplete="name" />
          </Input>
          <Input>
            <Input.Label>Email</Input.Label>
            <Input.Control variant="gloss" name="email" placeholder="you@example.com" autoComplete="email" />
          </Input>
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="gloss" onClick={() => setGlossDialogOpen(false)}>
            Отмена
          </Button>
          <Button variant="primary" onClick={() => setGlossDialogOpen(false)}>
            Сохранить
          </Button>
        </Dialog.Footer>
      </Dialog>

      <AlertDialog open={glossAlertOpen} onOpenChange={setGlossAlertOpen} variant="gloss" status="danger">
        <AlertDialog.Header>
          <AlertDialog.HeadingBlock>
            <AlertDialog.Title>Удалить проект?</AlertDialog.Title>
            <AlertDialog.Description>
              Gloss AlertDialog — подтверждение на стеклянной панели.
            </AlertDialog.Description>
          </AlertDialog.HeadingBlock>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <Button type="button" variant="gloss" onClick={() => setGlossAlertOpen(false)}>
            Отмена
          </Button>
          <Button
            type="button"
            variant={primaryButtonVariantForAlertTone("danger")}
            status="danger"
            onClick={() => setGlossAlertOpen(false)}
          >
            Удалить
          </Button>
        </AlertDialog.Footer>
      </AlertDialog>

      <Drawer open={glossDrawerOpen} onOpenChange={setGlossDrawerOpen} variant="gloss">
        <Drawer.Header>
          <Drawer.HeadingBlock>
            <Drawer.Title>Gloss Drawer</Drawer.Title>
            <Drawer.Description>Стеклянная боковая панель.</Drawer.Description>
          </Drawer.HeadingBlock>
          <Drawer.Close />
        </Drawer.Header>
        <Drawer.Body className="flex flex-col gap-plus">
          <Input>
            <Input.Label>Заметка</Input.Label>
            <Input.Control variant="gloss" placeholder="Текст…" />
          </Input>
        </Drawer.Body>
        <Drawer.Footer>
          <Button variant="gloss" onClick={() => setGlossDrawerOpen(false)}>
            Закрыть
          </Button>
        </Drawer.Footer>
      </Drawer>
    </div>
  );
}
