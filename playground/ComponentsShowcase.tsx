import { useCallback, useState, type FormEvent, type MouseEvent, type ReactNode } from "react";
import {
  IoAdd,
  IoArrowForward,
  IoBookmarkOutline,
  IoCheckmark,
  IoEllipsisHorizontal,
  IoGlobeOutline,
  IoGridOutline,
  IoHeartOutline,
  IoInformationCircleOutline,
  IoListOutline,
  IoLockClosedOutline,
  IoNotificationsOutline,
  IoPerson,
  IoRocketOutline,
  IoTimeOutline,
} from "react-icons/io5";

import { Accordion } from "@/components/composite/Accordion";
import {
  AlertDialog,
  primaryButtonVariantForAlertTone,
} from "@/components/composite/AlertDialog";
import { ButtonGroup, ButtonGroupText } from "@/components/composite/ButtonGroup";
import { CheckboxGroup } from "@/components/composite/CheckboxGroup";
import { Form } from "@/components/composite/Form";
import { RadioGroup } from "@/components/composite/RadioGroup";
import { ToggleButtonGroup } from "@/components/composite/ToggleButtonGroup";
import { Alert } from "@/components/core/Alert";
import { Avatar, AvatarGroup } from "@/components/core/Avatar";
import { Badge } from "@/components/core/Badge";
import { Breadcrumbs } from "@/components/core/Breadcrumbs";
import { Button } from "@/components/core/Button";
import { Calendar, type CalendarRangeValue } from "@/components/core/Calendar";
import { Card } from "@/components/core/Card";
import { Checkbox } from "@/components/core/Checkbox";
import { CloseButton } from "@/components/core/CloseButton";
import {
  ColorPicker,
  ColorSlider,
  ColorSwatch,
  hsvaToHex,
  type HSVA,
} from "@/components/core/ColorPicker";
import { ComboBox } from "@/components/core/ComboBox";
import { Dialog } from "@/components/core/Dialog";
import { Disclosure, DisclosureGroup } from "@/components/core/Disclosure";
import { Drawer } from "@/components/core/Drawer";
import { Expandable } from "@/components/core/Expandable";
import { Field } from "@/components/core/Field";
import { Dropdown } from "@/components/core/Dropdown";
import { GlassSurface } from "@/components/core/GlassSurface";
import { Input } from "@/components/core/Input";
import { Label } from "@/components/core/Label";
import { LiquidGlass } from "@/components/core/LiquidGlass";
import { ListBox } from "@/components/core/ListBox";
import { Link } from "@/components/core/Link";
import { Loading } from "@/components/core/Loading";
import { Meter } from "@/components/core/Meter";
import { Pagination } from "@/components/core/Pagination";
import { Popover } from "@/components/core/Popover";
import { ProgressBar } from "@/components/core/ProgressBar";
import { Radio } from "@/components/core/Radio";
import { Ripple } from "@/components/core/Ripple";
import { SearchInput } from "@/components/core/SearchInput";
import { SelectionIndicator } from "@/components/core/SelectionIndicator";
import { SelectionThumb, SelectionThumbIcon } from "@/components/core/SelectionThumb";
import { Separator } from "@/components/core/Separator";
import { Skeleton } from "@/components/core/Skeleton";
import { Surface } from "@/components/core/Surface";
import { Slider } from "@/components/core/Slider";
import { Switch } from "@/components/core/Switch";
import { Table, type Selection } from "@/components/core/Table";
import { Tabs } from "@/components/core/Tabs";
import { Text } from "@/components/core/Text";
import { TextArea } from "@/components/core/TextArea";
import { TimeField } from "@/components/core/TimeField";
import { Toast, useToast } from "@/components/core/Toast";
import { ToggleButton } from "@/components/core/ToggleButton";
import { Tooltip } from "@/components/core/Tooltip";
import { cn } from "@/utils/cn";
import { PIN_IMAGE1, PIN_IMAGE2, PIN_IMAGE3, PIN_IMAGE4 } from "@/utils/mockImages";

const GLASS_GRADIENT =
  "radial-gradient(ellipse 120% 80% at 20% 30%, rgb(110 231 183 / 0.35), transparent), radial-gradient(circle at 80% 70%, rgb(99 102 241 / 0.45), transparent), linear-gradient(160deg, #0c0d10, #1a1530 55%, #0f172a)";

const EXPANDABLE_INFO_ICON = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className="size-full"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

const COMBO_OPTIONS = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

type TableRow = {
  id: number;
  name: string;
  role: string;
  status: "Active" | "On Leave";
};

const TABLE_ROWS: TableRow[] = [
  { id: 1, name: "Kate Moore", role: "CEO", status: "Active" },
  { id: 2, name: "John Smith", role: "CTO", status: "Active" },
  { id: 3, name: "Sara Johnson", role: "CMO", status: "On Leave" },
];

const STATUS_BADGE: Record<TableRow["status"], "success" | "warning"> = {
  Active: "success",
  "On Leave": "warning",
};

const preventNav = (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
  e.preventDefault();
};

function formatDate(d: Date | null | undefined) {
  if (!d) return "—";
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

function AsyncSaveButton() {
  return (
    <Button
      ripple
      onAsyncClick={() =>
        new Promise<boolean>((resolve) => {
          window.setTimeout(() => resolve(true), 1400);
        })
      }
      className="cursor-progress w-fit"
    >
      Async сохранение
    </Button>
  );
}

function ColorSlidersDemo() {
  const [hsva, setHsva] = useState<HSVA>({ h: 220, s: 80, v: 90, a: 100 });
  return (
    <div className="flex max-w-sm flex-col gap-mid">
      <ColorSlider
        channel="hue"
        color={hsva}
        label="Оттенок (Hue)"
        value={hsva.h}
        onValueChange={(h) => setHsva({ ...hsva, h })}
      />
      <ColorSlider
        channel="saturation"
        color={hsva}
        label="Насыщенность"
        value={hsva.s}
        onValueChange={(s) => setHsva({ ...hsva, s })}
      />
      <div className="flex items-center gap-small">
        <ColorSwatch color={hsvaToHex(hsva)} size="large" />
        <Text as="span" variant="small" className="font-mono text-muted">
          {hsvaToHex(hsva)}
        </Text>
      </div>
    </div>
  );
}

function TableSelectionDemo() {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set<number>());
  const selectedLabel =
    selectedKeys === "all"
      ? "Все"
      : (selectedKeys as Set<number>).size > 0
        ? Array.from(selectedKeys as Set<number>).join(", ")
        : "Нет";

  return (
    <div className="flex flex-col gap-mid">
      <Table>
        <Table.ScrollContainer>
          <Table.Content
            aria-label="Команда с выбором"
            className="min-w-[480px]"
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
          >
            <Table.Header>
              <Table.Column isRowHeader>Имя</Table.Column>
              <Table.Column>Роль</Table.Column>
              <Table.Column>Статус</Table.Column>
            </Table.Header>
            <Table.Body items={TABLE_ROWS}>
              {(row: TableRow) => (
                <Table.Row key={row.id} id={row.id}>
                  <Table.Cell>{row.name}</Table.Cell>
                  <Table.Cell>{row.role}</Table.Cell>
                  <Table.Cell>
                    <Badge color={STATUS_BADGE[row.status]}>{row.status}</Badge>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      <Text as="p" variant="small" className="text-muted">
        Выбранные id: <span className="font-medium text-foreground">{selectedLabel}</span>
      </Text>
    </div>
  );
}

function ShowcaseSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col gap-mid", className)}>
      <div>
        <Text as="h2" variant="header-2">
          {title}
        </Text>
        {description ? (
          <Text as="p" variant="small" className="mt-xsmall text-muted">
            {description}
          </Text>
        ) : null}
      </div>
      <div className="rounded-mid p-mid">{children}</div>
    </section>
  );
}

function ProfileFormDemo() {
  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }, []);

  return (
    <Form onSubmit={onSubmit} aria-label="Пример формы" className="max-w-md">
      <Input isRequired label="Имя" name="name" placeholder="Иван" autoComplete="name" />
      <Input
        isRequired
        label="Email"
        name="email"
        placeholder="you@example.com"
        autoComplete="email"
        hint="Для входа и уведомлений."
      />
      <CheckboxGroup>
        <CheckboxGroup.Legend>
          <CheckboxGroup.Label>Способ доставки</CheckboxGroup.Label>
          <CheckboxGroup.Hint>Можно выбрать несколько вариантов.</CheckboxGroup.Hint>
        </CheckboxGroup.Legend>
        <CheckboxGroup.List>
          <Checkbox name="ship" value="courier" label="Курьер" />
          <Checkbox name="ship" value="pickup" label="Самовывоз" />
        </CheckboxGroup.List>
      </CheckboxGroup>
      <div className="flex justify-end gap-small pt-small">
        <Button type="button" variant="outline">
          Отмена
        </Button>
        <Button type="submit">Сохранить</Button>
      </div>
    </Form>
  );
}

function ToastDemo() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-small">
      <Button variant="outline" onClick={() => toast.show({ title: "Сохранено", status: "success" })}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.show({ title: "Ошибка сети", status: "danger" })}>
        Danger
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.show({
            title: "Обновление",
            description: "Доступна новая версия библиотеки.",
            status: "info",
          })
        }
      >
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.show({
            title: "Лимит скоро",
            description: "Осталось 10% квоты.",
            status: "warning",
          })
        }
      >
        Warning
      </Button>
    </div>
  );
}

const SELECTION_INDICATOR_SIZES = ["small", "base", "mid", "large"] as const;

function SelectionIndicatorDemo() {
  const [selected, setSelected] = useState(true);

  return (
    <div className="flex flex-col gap-mid">
      <Checkbox
        checked={selected}
        onChange={(e) => setSelected(e.target.checked)}
        label="Выбрано (для всех индикаторов ниже)"
      />
      <div className="flex flex-wrap items-end gap-mid">
        {SELECTION_INDICATOR_SIZES.map((size) => (
          <div key={size} className="flex flex-col items-center gap-xsmall">
            <SelectionIndicator size={size} variant="base" selected={selected} />
            <Text as="span" variant="tools" className="text-muted">{size}</Text>
          </div>
        ))}
        <div className="flex flex-col items-center gap-xsmall">
          <SelectionIndicator size="base" variant="base" selected={selected} check />
          <Text as="span" variant="tools" className="text-muted">check</Text>
        </div>
        <div className="flex flex-col items-center gap-xsmall">
          <SelectionIndicator size="base" variant="outline" selected={selected} check />
          <Text as="span" variant="tools" className="text-muted">outline</Text>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-mid">
        <Text as="span" variant="small" className="text-muted">SelectionThumb:</Text>
        <div className="selection-indicator-base flex items-center justify-center">
          <SelectionThumb active={selected}>
            <SelectionThumbIcon size="base">
              <IoCheckmark aria-hidden />
            </SelectionThumbIcon>
          </SelectionThumb>
        </div>
        <div className="selection-indicator-mid flex items-center justify-center">
          <SelectionThumb active={!selected} />
        </div>
      </div>
    </div>
  );
}

function ComponentsShowcaseBody({ embedded = false }: { embedded?: boolean }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerLeftOpen, setDrawerLeftOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertSuccessOpen, setAlertSuccessOpen] = useState(false);
  const [comboValue, setComboValue] = useState("react");
  const [radioValue, setRadioValue] = useState("email");
  const [checked, setChecked] = useState(true);
  const [enabled, setEnabled] = useState(true);
  const [tab, setTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [sliderValue, setSliderValue] = useState(40);
  const [timeValue, setTimeValue] = useState("09:30");
  const [calendarDate, setCalendarDate] = useState<Date | null>(null);
  const [color, setColor] = useState("#3b82f6");
  const [viewMode, setViewMode] = useState("list");
  const [page, setPage] = useState(1);
  const [calendarRange, setCalendarRange] = useState<CalendarRangeValue>({ start: null, end: null });
  const [listBoxValue, setListBoxValue] = useState("ru");
  const [listBoxMulti, setListBoxMulti] = useState<string[]>(["ru"]);
  const [liked, setLiked] = useState(false);
  const [calendarDates, setCalendarDates] = useState<Date[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([200, 750]);
  const [formats, setFormats] = useState<string[]>(["bold"]);
  const [pageNumbers, setPageNumbers] = useState(5);

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-col gap-xlarge px-mid py-xlarge",
        embedded ? "max-w-none" : "max-w-4xl",
      )}
    >
      {!embedded ? (
        <header className="flex flex-col gap-xsmall">
          <Text as="h1" variant="header-1">
            Burne UI
          </Text>
          <Text as="p" variant="base" className="text-muted">
            Локальный каталог компонентов из <code className="text-primary">src/</code> — то же API, что
            в Storybook.
          </Text>
        </header>
      ) : null}

      <ShowcaseSection title="Типографика">
        <div className="flex flex-col gap-small">
          <Text as="p" variant="accent-header">
            accent-header
          </Text>
          <Text as="p" variant="header-1">
            header-1
          </Text>
          <Text as="p" variant="header-2">
            header-2
          </Text>
          <Text as="p" variant="large">
            text-large
          </Text>
          <Text as="p" variant="base">
            text-base — основной текст
          </Text>
          <Text as="p" variant="small" className="text-muted">
            text-small muted
          </Text>
          <Text as="p" variant="tools" className="text-muted">
            text-tools
          </Text>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Кнопки">
        <div className="flex flex-col gap-mid">
          <div className="flex flex-wrap items-center gap-small">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="success">Success</Button>
            <Button variant="info">Info</Button>
            <Button variant="warning">Warning</Button>
            <Button disabled>Disabled</Button>
            <Button leftIcon={<IoAdd aria-hidden />}>С иконкой</Button>
            <Button iconOnly aria-label="Добавить">
              <IoAdd aria-hidden />
            </Button>
            <Button ripple variant="outline">
              С ripple
            </Button>
            <CloseButton aria-label="Закрыть" />
            <CloseButton aria-label="Закрыть outline" variant="outline" />
          </div>
          <div className="flex flex-wrap items-center gap-small">
            <ToggleButton
              pressed={liked}
              onPressedChange={setLiked}
              variant="outline"
              leftIcon={<IoHeartOutline aria-hidden />}
            >
              {liked ? "Нравится" : "Лайк"}
            </ToggleButton>
            <ToggleButton variant="ghost" defaultPressed leftIcon={<IoBookmarkOutline aria-hidden />}>
              Закладка
            </ToggleButton>
          </div>
          <ButtonGroup aria-label="Действия с документом">
            <ButtonGroupText>Вид</ButtonGroupText>
            <Button variant="outline">Список</Button>
            <Button variant="outline" groupSegment={{ orientation: "horizontal", position: "middle" }}>
              Сетка
            </Button>
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
                <Dropdown.Item value="del" variant="danger" selection={false}>
                  Удалить
                </Dropdown.Item>
              </Dropdown.Popover>
            </Dropdown>
          </ButtonGroup>
          <div className="relative inline-flex w-fit overflow-hidden rounded-mid">
            <Ripple color="accent" />
            <Button variant="secondary" className="relative z-[1]">
              Кастомный Ripple
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-small">
            <Button size="small">Small</Button>
            <Button size="base">Base</Button>
            <Button size="mid">Mid</Button>
            <Button size="large">Large</Button>
          </div>
          
          <AsyncSaveButton />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Бейджи и алерты">
        <div className="flex flex-col gap-mid">
          <div className="flex flex-wrap gap-small">
            <Badge>Default</Badge>
            <Badge color="secondary">Secondary</Badge>
            <Badge color="success" icon={<IoCheckmark aria-hidden />}>
              Success
            </Badge>
            <Badge color="danger">Danger</Badge>
            <Badge color="info">Info</Badge>
            <Badge color="warning">Warning</Badge>
            <Badge color="outline">Outline</Badge>
          </div>
          <Alert title="Подсказка" description="Компоненты импортируются из библиотеки через alias @." />
          <Alert title="Внимание" description="Playground не входит в npm-пакет dist/." />
          <Alert title="Готово" description="Все статусы Alert доступны из коробки." />
          <Alert status="info" title="Информация" description="Нейтральное системное сообщение." />
          <Alert status="danger" title="Ошибка" description="Критическая проблема с подключением." />
          <div className="flex flex-wrap items-center gap-mid">
            <Badge.Anchor>
              <Avatar size="large" label="Jordan Doe" src={PIN_IMAGE1} alt="" loading="lazy" />
              <Badge color="danger" size="small">
                5
              </Badge>
            </Badge.Anchor>
            <Badge.Anchor>
              <Avatar size="large" label="Casey Davis" src={PIN_IMAGE3} alt="" loading="lazy" />
              <Badge color="success" dot placement="bottom-right" size="small" aria-label="Онлайн" />
            </Badge.Anchor>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Форма" description="Form + CheckboxGroup + поля с Simple API.">
        <ProfileFormDemo />
      </ShowcaseSection>

      <ShowcaseSection title="Field" description="Низкоуровневые примитивы поля формы.">
        <div className="flex flex-col gap-mid">
          <Field className="max-w-sm">
            <Field.Label htmlFor="playground-email">Email</Field.Label>
            <Input.Control id="playground-email" placeholder="you@example.com" status="danger" />
            <Field.Hint>Мы не передаём адрес третьим лицам.</Field.Hint>
            <Field.Error>Введите корректный email.</Field.Error>
          </Field>
          <Field.Set className="max-w-md">
            <Field.Legend>
              <Field.LegendHeader>
                <Label>Контактные данные</Label>
                <Field.Hint as="span">Все поля обязательны</Field.Hint>
              </Field.LegendHeader>
            </Field.Legend>
            <Field.Group>
              <Input>
                <Input.Label>Телефон</Input.Label>
                <Input.Control placeholder="+7 …" />
              </Input>
              <Input status="danger">
                <Input.Label>Email</Input.Label>
                <Input.Control defaultValue="bad@" />
                <Input.Error>Некорректный адрес.</Input.Error>
              </Input>
            </Field.Group>
            <Field.Actions>
              <Button type="button" size="base">
                Сохранить
              </Button>
              <Button type="button" variant="ghost" size="base">
                Отмена
              </Button>
            </Field.Actions>
          </Field.Set>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Поля ввода" description="Simple API — label, hint и error на корне.">
        <div className="flex flex-col gap-mid">
          <Input label="Email" placeholder="you@example.com" hint="Мы не рассылаем спам." />
          <Input
            label="Outline"
            variant="outline"
            placeholder="variant outline"
            hint="Прозрачный фон с обводкой."
          />
          <Input
            label="Ошибка"
            status="danger"
            defaultValue="bad@"
            error="Некорректный email."
          />
          <Input label="Успех" status="success" defaultValue="verified@mail.ru" />
          <Input label="Предупреждение" status="warning" defaultValue="temp@…" hint="Проверьте домен." />
          <Input isRequired>
            <Input.Label>Телефон (compound)</Input.Label>
            <Input.Control placeholder="+7 900 000-00-00" />
            <Input.Hint>Для SMS-подтверждения.</Input.Hint>
          </Input>
          <TextArea
            label="Комментарий"
            placeholder="Текст сообщения…"
            rows={3}
            hint="До 500 символов."
          />
          <TextArea
            label="С ошибкой"
            status="danger"
            defaultValue="Слишком короткий текст"
            error="Минимум 20 символов."
            rows={2}
          />
          <ComboBox
            label="Фреймворк"
            options={COMBO_OPTIONS}
            value={comboValue}
            onValueChange={setComboValue}
            hint={`Выбрано: ${comboValue}`}
          />
          <SearchInput
            aria-label="Поиск"
            placeholder="Найти компонент…"
            value={search}
            onValueChange={setSearch}
          />
          <Slider
            label="Громкость"
            hint="Подсказка под шкалой"
            showValue
            value={sliderValue}
            onValueChange={setSliderValue}
            min={0}
            max={100}
            step={1}
            marks={[0, 25, 50, 75, 100]}
          />
          <Slider
            range
            label="Цена"
            showValue
            min={0}
            max={1000}
            step={10}
            value={priceRange}
            onValueChange={setPriceRange}
            formatValue={(v) => `${v} ₽`}
          />
          <Slider label="Disabled" value={30} min={0} max={100} disabled />
          <Slider
            orientation="vertical"
            label="Вертикальный"
            className="h-32"
            value={sliderValue}
            onValueChange={setSliderValue}
            min={0}
            max={100}
          />
          <TimeField
            label="Начало смены"
            hint="Формат: ЧЧ:ММ (24 часа)"
            value={timeValue}
            onValueChange={setTimeValue}
            prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
          />
          <TimeField status="default">
            <TimeField.Label>Конец смены (compound)</TimeField.Label>
            <TimeField.Control
              defaultValue="18:00"
              prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
            />
            <TimeField.Hint>24-часовой формат</TimeField.Hint>
          </TimeField>
          <TimeField
            label="Segmented"
            variant="segmented"
            defaultValue="14:30"
            hint="Сегментированный ввод"
          />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Выбор">
        <div className="flex flex-col gap-mid">
          <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} label="Согласен с условиями" />
          <div className="flex flex-wrap items-center gap-mid">
            <Checkbox size="small" defaultChecked label="Small" />
            <Checkbox size="base" defaultChecked label="Base" />
            <Checkbox size="mid" defaultChecked label="Mid" />
            <Checkbox size="large" defaultChecked label="Large" />
            <Checkbox disabled label="Disabled" />
          </div>
          <Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} label="Уведомления" />
          <Switch defaultChecked disabled label="Switch disabled" />
          <RadioGroup value={radioValue} onValueChange={(v) => v != null && setRadioValue(v)}>
            <RadioGroup.Legend>
              <RadioGroup.Label>Способ связи</RadioGroup.Label>
            </RadioGroup.Legend>
            <RadioGroup.List>
              <Radio value="email" label="Email" />
              <Radio value="phone" label="Телефон" />
              <Radio value="chat" label="Чат" />
            </RadioGroup.List>
          </RadioGroup>
          <ToggleButtonGroup
            type="single"
            aria-label="Вид списка"
            value={viewMode}
            onValueChange={(v) => setViewMode(v as string)}
          >
            <ToggleButton value="list" leftIcon={<IoListOutline aria-hidden />}>
              Список
            </ToggleButton>
            <ToggleButton value="grid" leftIcon={<IoGridOutline aria-hidden />}>
              Сетка
            </ToggleButton>
          </ToggleButtonGroup>
          <div className="flex flex-wrap items-center gap-mid">
            <ColorPicker value={color} onValueChange={setColor}>
              <ColorPicker.Trigger />
              <ColorPicker.Content />
            </ColorPicker>
            <ColorSwatch color={color} size="large" />
            <Text as="span" variant="small" className="font-mono text-muted">
              {color}
            </Text>
          </div>
          <ColorSlidersDemo />
          <ToggleButtonGroup
            type="multiple"
            aria-label="Форматирование"
            value={formats}
            onValueChange={(v) => setFormats(v as string[])}
          >
            <ToggleButton value="bold">Жирный</ToggleButton>
            <ToggleButton value="italic">Курсив</ToggleButton>
            <ToggleButton value="underline">Подчёркнутый</ToggleButton>
          </ToggleButtonGroup>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title="SelectionIndicator"
        description="Публичный примитив индикатора выбора (Radio, Checkbox, Slider thumb)."
      >
        <SelectionIndicatorDemo />
      </ShowcaseSection>

      <ShowcaseSection title="Separator">
        <div className="flex flex-col gap-mid max-w-md">
          <Text as="p" variant="small">Горизонтальный</Text>
          <Separator />
          <div className="flex h-16 items-stretch gap-mid">
            <Text as="span" variant="small" className="shrink-0 text-muted">Вертикальный</Text>
            <Separator orientation="vertical" />
            <Text as="p" variant="small" className="text-muted">Контент справа от разделителя.</Text>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Навигация">
        <div className="flex flex-col gap-mid">
          <Breadcrumbs>
            <Breadcrumbs.List>
              <Breadcrumbs.Item href="#" onClick={preventNav}>
                Главная
              </Breadcrumbs.Item>
              <Breadcrumbs.Item href="#" onClick={preventNav}>
                Компоненты
              </Breadcrumbs.Item>
              <Breadcrumbs.Item current>Playground</Breadcrumbs.Item>
            </Breadcrumbs.List>
          </Breadcrumbs>
          <Breadcrumbs>
            <Breadcrumbs.List>
              <Breadcrumbs.Item href="#" onClick={preventNav}>
                Главная
              </Breadcrumbs.Item>
              <Breadcrumbs.Item href="#" onClick={preventNav}>
                Раздел
              </Breadcrumbs.Item>
              <Breadcrumbs.Item href="#" onClick={preventNav}>
                Подраздел
              </Breadcrumbs.Item>
              <Breadcrumbs.Item href="#" onClick={preventNav}>
                Категория
              </Breadcrumbs.Item>
              <Breadcrumbs.Item current>Страница</Breadcrumbs.Item>
            </Breadcrumbs.List>
          </Breadcrumbs>
          <div className="flex flex-wrap gap-mid">
            <Link href="#" onClick={preventNav}>
              Внутренняя ссылка
            </Link>
            <Link href="https://github.com" target="_blank" rel="noreferrer" showDefaultIcon>
              Внешняя ссылка
            </Link>
            <Link href="#" onClick={preventNav} underline leftIcon={<IoRocketOutline aria-hidden />}>
              С иконкой
            </Link>
            <Link href="#" onClick={preventNav} underline showDefaultIcon>
              Подчёркнутая
            </Link>
          </div>
          <Pagination page={page} totalPages={10} onPageChange={setPage}>
            <Pagination.Summary>
              Страница {page} из 10
            </Pagination.Summary>
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous />
              </Pagination.Item>
              <Pagination.Item>
                <Pagination.Next />
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
          <Pagination page={pageNumbers} totalPages={20} onPageChange={setPageNumbers} className="justify-center">
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous />
              </Pagination.Item>
              <Pagination.Pages />
              <Pagination.Item>
                <Pagination.Next />
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Оверлеи" description="Tooltip, Popover и Dropdown.">
        <div className="flex flex-col gap-mid">
          <div className="flex flex-wrap items-center gap-mid">
            <Tooltip variant="default">
              <Tooltip.Trigger>
                <Button variant="outline" type="button">
                  Default
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>Подсказка по hover и focus</Tooltip.Content>
            </Tooltip>
            <Tooltip variant="success" side="top">
              <Tooltip.Trigger>
                <Button variant="outline" type="button">
                  Success
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>Операция выполнена</Tooltip.Content>
            </Tooltip>
            <Tooltip variant="danger" size="small">
              <Tooltip.Trigger>
                <Button variant="outline" type="button" size="small">
                  Danger
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>Действие необратимо</Tooltip.Content>
            </Tooltip>
            <Tooltip variant="info">
              <Tooltip.Trigger>
                <Button variant="outline" type="button">Info</Button>
              </Tooltip.Trigger>
              <Tooltip.Content>Дополнительная информация</Tooltip.Content>
            </Tooltip>
            <Tooltip variant="warning">
              <Tooltip.Trigger>
                <Button variant="outline" type="button">Warning</Button>
              </Tooltip.Trigger>
              <Tooltip.Content>Проверьте настройки</Tooltip.Content>
            </Tooltip>
          </div>
          <div className="flex flex-wrap items-center gap-mid">
          <Popover>
            <Popover.Trigger>
              <Button variant="outline" type="button">
                Popover
              </Button>
            </Popover.Trigger>
            <Popover.Content>
              <Popover.Body>
                <Text as="p" variant="small">
                  Панель по клику на триггер.
                </Text>
              </Popover.Body>
            </Popover.Content>
          </Popover>
          <Popover side="bottom">
            <Popover.Trigger>
              <Button variant="secondary" type="button">
                С header
              </Button>
            </Popover.Trigger>
            <Popover.Content showArrow>
              <Popover.Arrow />
              <Popover.Header>
                <Popover.Label>Экспорт</Popover.Label>
                <Popover.Hint>Выберите формат файла</Popover.Hint>
              </Popover.Header>
              <Popover.Body>
                <div className="flex flex-col gap-xsmall">
                  <Button variant="ghost" size="small" type="button">
                    PDF
                  </Button>
                  <Button variant="ghost" size="small" type="button">
                    CSV
                  </Button>
                </div>
              </Popover.Body>
            </Popover.Content>
          </Popover>
          <Dropdown selectionIndicator defaultValue="ru">
            <Dropdown.Trigger asChild>
              <Button variant="outline">Язык</Button>
            </Dropdown.Trigger>
            <Dropdown.Popover>
              <Dropdown.Group>
                <Dropdown.Label>Интерфейс</Dropdown.Label>
                <Dropdown.Item value="ru">
                  <Dropdown.ItemIndicator />
                  <Dropdown.ItemLabel>Русский</Dropdown.ItemLabel>
                </Dropdown.Item>
                <Dropdown.Item value="en">
                  <Dropdown.ItemIndicator />
                  <Dropdown.ItemLabel>English</Dropdown.ItemLabel>
                  <Dropdown.ItemIcon>
                    <IoGlobeOutline aria-hidden />
                  </Dropdown.ItemIcon>
                </Dropdown.Item>
              </Dropdown.Group>
            </Dropdown.Popover>
          </Dropdown>
          <Dropdown multiple defaultValue={["ru", "en"]}>
            <Dropdown.Trigger asChild>
              <Button variant="outline">Мультивыбор</Button>
            </Dropdown.Trigger>
            <Dropdown.Popover>
              <Dropdown.Item value="ru">
                <Dropdown.ItemIndicator />
                <Dropdown.ItemLabel>Русский</Dropdown.ItemLabel>
              </Dropdown.Item>
              <Dropdown.Item value="en">
                <Dropdown.ItemIndicator />
                <Dropdown.ItemLabel>English</Dropdown.ItemLabel>
              </Dropdown.Item>
              <Dropdown.Item value="de">
                <Dropdown.ItemIndicator />
                <Dropdown.ItemLabel>Deutsch</Dropdown.ItemLabel>
              </Dropdown.Item>
            </Dropdown.Popover>
          </Dropdown>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Календарь">
        <div className="flex flex-col gap-xlarge">
          <div className="flex flex-col items-start gap-mid">
            <Text as="span" variant="small" className="font-medium">
              Одна дата
            </Text>
            <Calendar mode="single" value={calendarDate} onValueChange={setCalendarDate} />
            <Text as="p" variant="small" className="text-muted">
              Выбрано: <span className="font-medium text-foreground">{formatDate(calendarDate)}</span>
            </Text>
          </div>
          <div className="flex flex-col items-start gap-mid">
            <Text as="span" variant="small" className="font-medium">
              Диапазон
            </Text>
            <Calendar mode="range" value={calendarRange} onValueChange={setCalendarRange} />
            <Text as="p" variant="small" className="text-muted">
              От <span className="font-medium text-foreground">{formatDate(calendarRange.start)}</span> до{" "}
              <span className="font-medium text-foreground">{formatDate(calendarRange.end)}</span>
            </Text>
          </div>
          <div className="flex flex-col items-start gap-mid">
            <Text as="span" variant="small" className="font-medium">
              Несколько дат
            </Text>
            <Calendar mode="multiple" value={calendarDates} onValueChange={setCalendarDates} />
            <Text as="p" variant="small" className="text-muted">
              Выбрано:{" "}
              <span className="font-medium text-foreground">
                {calendarDates.length > 0 ? calendarDates.map((d) => formatDate(d)).join(", ") : "—"}
              </span>
            </Text>
          </div>
          <div className="flex flex-col items-start gap-mid">
            <Text as="span" variant="small" className="font-medium">
              С футером
            </Text>
            <Calendar mode="single" value={calendarDate} onValueChange={setCalendarDate}>
              <Calendar.Header />
              <Calendar.Grid />
              <Calendar.Footer />
            </Calendar>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="ListBox">
        <div className="flex flex-col gap-mid">
          <Surface variant="default" padding="small" className="max-w-sm">
            <ListBox value={listBoxValue} onValueChange={(v) => setListBoxValue(v as string)}>
              <ListBox.Section>
                <ListBox.Header>Языки</ListBox.Header>
                <ListBox.Item value="ru">
                  <ListBox.ItemIndicator />
                  <ListBox.Label>Русский</ListBox.Label>
                  <ListBox.Hint>Локаль по умолчанию</ListBox.Hint>
                </ListBox.Item>
                <ListBox.Item value="en">
                  <ListBox.ItemIndicator />
                  <ListBox.Label>English</ListBox.Label>
                  <ListBox.Hint>Latin script</ListBox.Hint>
                  <ListBox.Icon>
                    <IoGlobeOutline aria-hidden />
                  </ListBox.Icon>
                </ListBox.Item>
              </ListBox.Section>
            </ListBox>
          </Surface>
          <Surface variant="default" padding="small" className="max-w-sm">
            <ListBox multiple value={listBoxMulti} onValueChange={(v) => setListBoxMulti(v as string[])}>
              <ListBox.Item value="ru" label="Русский" />
              <ListBox.Item value="en" label="English" />
              <ListBox.Item value="de" label="Deutsch" disabled hint="Скоро" />
            </ListBox>
          </Surface>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Карточка">
        <div className="grid gap-mid sm:grid-cols-2">
          <Card>
            <Card.Content>
              <Card.Title>Default</Card.Title>
              <Card.Description>Базовая карточка с заголовком и описанием.</Card.Description>
            </Card.Content>
          </Card>
          <Card variant="outline">
            <Card.Content>
              <Card.Title>Outline</Card.Title>
              <Card.Description>Только обводка, без заливки.</Card.Description>
            </Card.Content>
          </Card>
          <Card variant="secondary">
            <Card.Content>
              <Card.Title>Secondary</Card.Title>
              <Card.Description>Вторичная поверхность.</Card.Description>
            </Card.Content>
            <Card.Footer className="flex justify-end gap-small">
              <Button variant="ghost" size="small">
                Отмена
              </Button>
              <Button size="small" leftIcon={<IoArrowForward aria-hidden />}>
                Далее
              </Button>
            </Card.Footer>
          </Card>
          <Card pressable onPress={() => setDialogOpen(true)}>
            <Ripple color="accentSoft" />
            <div className="relative z-[1]">
              <Card.Content className="gap-small">
                <div
                  className="mb-small h-24 w-full overflow-hidden rounded-small bg-cover bg-center"
                  style={{ backgroundImage: `url(${PIN_IMAGE4})` }}
                />
                <Card.Title>Pressable</Card.Title>
                <Card.Description>Нажми — откроется Dialog.</Card.Description>
              </Card.Content>
            </div>
          </Card>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Вкладки">
        <div className="flex flex-col gap-mid">
          <Tabs value={tab} onValueChange={setTab}>
            <Tabs.List>
              <Tabs.Tab value="overview">Обзор</Tabs.Tab>
              <Tabs.Tab value="details">Детали</Tabs.Tab>
              <Tabs.Tab value="disabled" disabled>
                Скоро
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="overview" className="pt-mid">
              <Text as="p" variant="small" className="text-muted">
                Активная вкладка: {tab} (variant default)
              </Text>
            </Tabs.Panel>
            <Tabs.Panel value="details" className="pt-mid">
              <Text as="p" variant="small">
                Второй panel с другим содержимым.
              </Text>
            </Tabs.Panel>
          </Tabs>
          <Tabs defaultValue="a" variant="outline">
            <Tabs.List>
              <Tabs.Tab value="a">Outline A</Tabs.Tab>
              <Tabs.Tab value="b">Outline B</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="a" className="pt-mid">
              <Text as="p" variant="small" className="text-muted">variant outline</Text>
            </Tabs.Panel>
            <Tabs.Panel value="b" className="pt-mid">
              <Text as="p" variant="small" className="text-muted">primary-tint индикатора</Text>
            </Tabs.Panel>
          </Tabs>
          <Tabs defaultValue="x" variant="secondary">
            <Tabs.List>
              <Tabs.Tab value="x">Secondary X</Tabs.Tab>
              <Tabs.Tab value="y">Secondary Y</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="x" className="pt-mid">
              <Text as="p" variant="small" className="text-muted">variant secondary</Text>
            </Tabs.Panel>
            <Tabs.Panel value="y" className="pt-mid">
              <Text as="p" variant="small" className="text-muted">surface-secondary контейнер</Text>
            </Tabs.Panel>
          </Tabs>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Прогресс">
        <div className="flex flex-col gap-mid">
          <ProgressBar label="Загрузка" value={62} />
          <ProgressBar label="Неопределённый" indeterminate />
          <ProgressBar label="Успех" value={100} color="var(--color-success)" />
          <Meter label="Диск" value={78} min={0} max={100} showValue />
          <Meter label="Память" value={45} min={0} max={100} color="var(--color-warning)" showValue />
          <div className="flex flex-wrap items-end gap-mid">
            <ProgressBar orientation="vertical" label="CPU" showValue value={45} className="h-28" />
            <ProgressBar orientation="vertical" label="RAM" showValue value={72} color="var(--color-info)" className="h-28" />
            <Meter orientation="vertical" label="Disk" showValue value={88} color="var(--color-warning)" className="h-28" />
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Аватар и скелетон">
        <div className="flex flex-col gap-mid">
          <div className="flex flex-wrap items-center gap-mid">
            <Avatar size="small" label="S" />
            <Avatar size="base" label="B" />
            <Avatar size="mid" label="M" />
            <Avatar size="large" label="L" />
            <Avatar label="AB" />
            <Avatar label="Grace Hopper" src={PIN_IMAGE2} alt="" loading="lazy" nickname="grace_h" />
            <Avatar>
              <Avatar.Fallback>
                <IoPerson aria-hidden />
              </Avatar.Fallback>
            </Avatar>
            <Skeleton className="h-10 w-32" />
            <Skeleton.Circle className="size-10" />
          </div>
          <div className="flex max-w-sm flex-col gap-small">
            <Skeleton.Text lines={3} />
            <Skeleton.Block className="h-20" />
          </div>
          <div className="flex flex-wrap gap-mid">
            <Skeleton variant="pulse" className="h-8 w-24 rounded-small" />
            <Skeleton variant="wave" className="h-8 w-24 rounded-small" />
            <Skeleton variant="shimmer" className="h-8 w-24 rounded-small" />
          </div>
          <Skeleton.Block variant="shimmer" className="max-w-sm">
            <Skeleton.Text lines={2} variant="shimmer" />
          </Skeleton.Block>
          <AvatarGroup>
            <Avatar size="base" label="Один" src={PIN_IMAGE1} alt="" loading="lazy" />
            <Avatar size="base" label="Два" src={PIN_IMAGE2} alt="" loading="lazy" />
            <Avatar size="base" label="Три" src={PIN_IMAGE3} alt="" loading="lazy" />
            <Avatar size="base" label="Четыре" />
          </AvatarGroup>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Поверхности">
        <div className="flex flex-col gap-mid">
          <div className="flex flex-wrap gap-small">
            <Surface variant="default" padding="mid" className="min-w-[8rem]">
              <Text as="span" variant="small">
                default
              </Text>
            </Surface>
            <Surface variant="secondary" padding="mid" className="min-w-[8rem]">
              <Text as="span" variant="small">
                secondary
              </Text>
            </Surface>
            <Surface variant="tertiary" padding="mid" className="min-w-[8rem]">
              <Text as="span" variant="small">
                tertiary
              </Text>
            </Surface>
          </div>
          <div
            className="overflow-hidden rounded-mid p-mid"
            style={{
              background:
                "radial-gradient(ellipse 120% 80% at 20% 30%, rgb(110 231 183 / 0.35), transparent), radial-gradient(circle at 80% 70%, rgb(99 102 241 / 0.45), transparent), linear-gradient(160deg, #0c0d10, #1a1530 55%, #0f172a)",
            }}
          >
            <GlassSurface refractionIntensity={0} contentClassName="px-mid py-mid">
              <Text as="p" variant="small" className="text-muted">
                GlassSurface с CSS blur (<code className="text-foreground">refractionIntensity: 0</code>)
              </Text>
            </GlassSurface>
          </div>
          <div className="relative min-h-[12rem] overflow-hidden rounded-mid p-mid" style={{ background: GLASS_GRADIENT }}>
            <div className="pointer-events-none absolute inset-0 p-mid opacity-30">
              <Text as="p" variant="header-2" className="text-foreground/20">
                Liquid
              </Text>
            </div>
            <div className="relative z-10 flex justify-center py-mid">
              <LiquidGlass shape="rounded" style={{ width: 260, minHeight: 90, padding: 20 }}>
                <div className="text-center text-foreground">
                  <Text as="p" variant="base" className="font-medium">
                    LiquidGlass
                  </Text>
                  <Text as="p" variant="small" className="text-muted">
                    WebGL refraction + blur
                  </Text>
                </div>
              </LiquidGlass>
            </div>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Expandable">
        <div className="flex max-w-lg flex-col gap-mid">
          <Expandable
            title="Уведомления"
            icon={EXPANDABLE_INFO_ICON}
            description="Simple API"
          >
            <Text as="p" variant="small" className="text-muted">
              Контент панели Expandable — props title и icon на корне.
            </Text>
          </Expandable>
          <Expandable>
            <Expandable.Trigger>
              <Expandable.Message>
                <Expandable.Icon>{EXPANDABLE_INFO_ICON}</Expandable.Icon>
                <Expandable.Content>
                  <Expandable.Title>Compound API</Expandable.Title>
                  <Expandable.Description>Trigger + Message + Panel</Expandable.Description>
                </Expandable.Content>
              </Expandable.Message>
            </Expandable.Trigger>
            <Expandable.Panel>
              <Text as="p" variant="small" className="text-muted">
                Полный compound-вариант с иконкой и описанием в триггере.
              </Text>
            </Expandable.Panel>
          </Expandable>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Раскрытие (Disclosure)">
        <div className="flex flex-col gap-mid">
          <Disclosure className="max-w-lg" defaultOpen>
            <Disclosure.Trigger>Одиночный блок</Disclosure.Trigger>
            <Disclosure.Content>
              <Text as="p" variant="small" className="text-muted">
                Disclosure с анимацией высоты — альтернатива Accordion для одиночных блоков.
              </Text>
            </Disclosure.Content>
          </Disclosure>
          <DisclosureGroup variant="card" defaultValue="card-1" className="max-w-lg">
            {[
              { value: "card-1", title: "Card variant" },
              { value: "card-2", title: "Второй блок" },
            ].map(({ value, title }) => (
              <Disclosure key={value} value={value}>
                <Disclosure.Trigger>{title}</Disclosure.Trigger>
                <Disclosure.Content>
                  <Text as="p" variant="small" className="text-muted">
                    DisclosureGroup variant=&quot;card&quot; — общая карточка с разделителями.
                  </Text>
                </Disclosure.Content>
              </Disclosure>
            ))}
          </DisclosureGroup>
          <DisclosureGroup variant="outline" defaultValue="faq-1" className="max-w-lg">
            {[
              { value: "faq-1", title: "Что такое Burne UI?", icon: <IoInformationCircleOutline /> },
              { value: "faq-2", title: "Как подключить тему?", icon: <IoNotificationsOutline /> },
              { value: "faq-3", title: "Есть ли SSR?", icon: <IoLockClosedOutline /> },
            ].map(({ value, title, icon }) => (
              <Disclosure key={value} value={value}>
                <Disclosure.Trigger icon={icon}>{title}</Disclosure.Trigger>
                <Disclosure.Content>
                  <Text as="p" variant="small" className="text-muted">
                    Ответ на вопрос «{title}» — compound DisclosureGroup с аккордеон-поведением.
                  </Text>
                </Disclosure.Content>
              </Disclosure>
            ))}
          </DisclosureGroup>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Таблица">
        <div className="flex flex-col gap-xlarge">
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="Команда" className="min-w-[480px]">
                <Table.Header>
                  <Table.Column isRowHeader>Имя</Table.Column>
                  <Table.Column>Роль</Table.Column>
                  <Table.Column>Статус</Table.Column>
                </Table.Header>
                <Table.Body items={TABLE_ROWS}>
                  {(row: TableRow) => (
                    <Table.Row key={row.id} id={row.id}>
                      <Table.Cell>{row.name}</Table.Cell>
                      <Table.Cell>{row.role}</Table.Cell>
                      <Table.Cell>
                        <Badge color={STATUS_BADGE[row.status]}>{row.status}</Badge>
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
          <TableSelectionDemo />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Загрузка">
        <div className="flex flex-wrap items-center gap-mid">
          <Loading size="small" />
          <Loading size="base" color="accent" />
          <Loading size="mid" color="success" />
          <Loading size="large" color="muted" />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Аккордеон">
        <Accordion className="max-w-lg" defaultOpenIndex={0}>
          <Accordion.Item>
            <Accordion.Heading>
              <Accordion.Trigger>
                <Accordion.Message>
                  <Accordion.Content>
                    <Accordion.Title>Что такое Burne UI?</Accordion.Title>
                    <Accordion.Description>Набор React-компонентов с compound API.</Accordion.Description>
                  </Accordion.Content>
                </Accordion.Message>
                <Accordion.Indicator />
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body>Импортируйте из пакета или через alias в playground.</Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Heading>
              <Accordion.Trigger>
                <Accordion.Message>
                  <Accordion.Content>
                    <Accordion.Title>Как запустить Storybook?</Accordion.Title>
                    <Accordion.Description>Локальная документация компонентов.</Accordion.Description>
                  </Accordion.Content>
                </Accordion.Message>
                <Accordion.Indicator />
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body>
                <code className="text-primary">bun run storybook</code> — порт 6006.
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </ShowcaseSection>

      <ShowcaseSection title="Тосты">
        <ToastDemo />
      </ShowcaseSection>

      <ShowcaseSection title="Модальные окна">
        <div className="flex flex-wrap gap-small">
          <Button onClick={() => setDialogOpen(true)}>Dialog</Button>
          <Button variant="outline" onClick={() => setDrawerOpen(true)}>
            Drawer (right)
          </Button>
          <Button variant="outline" onClick={() => setDrawerLeftOpen(true)}>
            Drawer (left)
          </Button>
          <Button variant="danger" onClick={() => setAlertDialogOpen(true)}>
            AlertDialog danger
          </Button>
          <Button variant="success" onClick={() => setAlertSuccessOpen(true)}>
            AlertDialog success
          </Button>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <Dialog.Header>
            <Dialog.HeadingBlock>
              <Dialog.Title>Пример диалога</Dialog.Title>
              <Dialog.Description>Нативный &lt;dialog&gt; с анимацией из библиотеки.</Dialog.Description>
            </Dialog.HeadingBlock>
            <Dialog.Close />
          </Dialog.Header>
          <Dialog.Body>
            <Text as="p" variant="base">
              Контент модального окна. Закройте по Escape или кнопке.
            </Text>
          </Dialog.Body>
          <Dialog.Footer>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={() => setDialogOpen(false)}>Готово</Button>
          </Dialog.Footer>
        </Dialog>
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} placement="right">
          <Drawer.Header>
            <Drawer.HeadingBlock>
              <Drawer.Title>Настройки</Drawer.Title>
              <Drawer.Description>Выдвижная панель справа.</Drawer.Description>
            </Drawer.HeadingBlock>
            <Drawer.Close />
          </Drawer.Header>
          <Drawer.Body>
            <Text as="p" variant="small" className="text-muted">
              Произвольный контент внутри drawer.
            </Text>
          </Drawer.Body>
          <Drawer.Footer>
            <Button variant="ghost" onClick={() => setDrawerOpen(false)}>
              Отмена
            </Button>
            <Button onClick={() => setDrawerOpen(false)}>Сохранить</Button>
          </Drawer.Footer>
        </Drawer>
        <Drawer open={drawerLeftOpen} onOpenChange={setDrawerLeftOpen} placement="left" size="mid">
          <Drawer.Header>
            <Drawer.HeadingBlock>
              <Drawer.Title>Навигация</Drawer.Title>
              <Drawer.Description>Drawer слева, size small.</Drawer.Description>
            </Drawer.HeadingBlock>
            <Drawer.Close />
          </Drawer.Header>
          <Drawer.Body>
            <div className="flex flex-col gap-small">
              <Button variant="ghost" size="small">Профиль</Button>
              <Button variant="ghost" size="small">Настройки</Button>
            </div>
          </Drawer.Body>
        </Drawer>
        <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen} status="danger">
          <AlertDialog.Header>
            <AlertDialog.HeadingBlock>
              <AlertDialog.Title>Удалить элемент?</AlertDialog.Title>
              <AlertDialog.Description>
                Действие необратимо. Окно не закроется по клику вне панели.
              </AlertDialog.Description>
            </AlertDialog.HeadingBlock>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <Button type="button" variant="outline" onClick={() => setAlertDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              type="button"
              variant={primaryButtonVariantForAlertTone("danger")}
              onClick={() => setAlertDialogOpen(false)}
            >
              Удалить
            </Button>
          </AlertDialog.Footer>
        </AlertDialog>
        <AlertDialog open={alertSuccessOpen} onOpenChange={setAlertSuccessOpen} status="success">
          <AlertDialog.Header>
            <AlertDialog.HeadingBlock>
              <AlertDialog.Title>Изменения сохранены</AlertDialog.Title>
              <AlertDialog.Description>
                Настройки профиля обновлены успешно.
              </AlertDialog.Description>
            </AlertDialog.HeadingBlock>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <Button
              type="button"
              variant={primaryButtonVariantForAlertTone("success")}
              onClick={() => setAlertSuccessOpen(false)}
            >
              Отлично
            </Button>
          </AlertDialog.Footer>
        </AlertDialog>
      </ShowcaseSection>

      {!embedded ? (
        <>
          <Separator className="my-small" />
          <Text as="p" variant="small" className="text-center text-muted">
            Запуск: <code className="text-primary">bun run playground</code>
          </Text>
        </>
      ) : null}
    </div>
  );
}

export function ComponentsShowcase({ embedded = false }: { embedded?: boolean } = {}) {
  return (
    <Toast.Provider>
      <ComponentsShowcaseBody embedded={embedded} />
    </Toast.Provider>
  );
}
