# ButtonGroup

Layout-обёртка для склеенных или раздельных сегментов: `Button`, `Input.Control`, `ComboBox`, `Select`, `SearchInput`, `Dropdown`, `ButtonGroup.Text`. Compound API: `ButtonGroup` + `ButtonGroup.Text`.

## Импорт

```tsx
import { ButtonGroup, type ButtonGroupProps, type ButtonGroupTextProps, type ButtonGroupOrientation, type ButtonGroupSegment } from "burne-ui";
```

Style helpers (из модуля): `buttonGroupRoundingClasses`, `buttonGroupSegmentSurfaceClasses`, `buttonGroupTextFrameClass`.

## API

### Joined (fused) группа

```tsx
<ButtonGroup aria-label="Действия с документом" buttonSize="base" variant="default">
  <ButtonGroup.Text>Вид</ButtonGroup.Text>
  <Button variant="secondary">Список</Button>
  <Button variant="primary">Сетка</Button>
  <Dropdown>
    <Dropdown.Trigger asChild>
      <Button
        variant="outline"
        iconOnly
        aria-label="Ещё"
        groupSegment={{ orientation: "horizontal", position: "last" }}
      >
        <IoEllipsisHorizontal aria-hidden />
      </Button>
    </Dropdown.Trigger>
    <Dropdown.Popover>...</Dropdown.Popover>
  </Dropdown>
</ButtonGroup>
```

### Segmented (с зазорами)

```tsx
<ButtonGroup segmented aria-label="Действия" buttonSize="base">
  <Button variant="outline">Отмена</Button>
  <Button variant="outline">Черновик</Button>
  <Button variant="primary">Сохранить</Button>
</ButtonGroup>
```

Compound part: `ButtonGroup.Text`.

### Root props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `orientation` | `horizontal` | `horizontal` \| `vertical` |
| `segmented` | `false` | `true` — gap между сегментами, без glue |
| `buttonSize` | `base` | Каскад в сегменты: `small` \| `base` \| `mid` \| `large` |
| `variant` | `default` | `default` \| `outline` \| `secondary` \| `gloss` \| `primary` |
| `className` | — | На root `<div role="group">` |
| `classNames` | — | Слоты: `root`, `separator`, `text`, `textLabel` |
| `children` | — | Сегменты |

`status` на группе нет — на дочерних `Button`.

### `ButtonGroupClassNames`

`root`, `separator`, `text`, `textLabel`.

`separator` — слот layout-разделителя (compound-части нет).

Joined-рамка рисуется через `::after`: цвет — `border-color` root (`border-border` по умолчанию), скругление — `border-radius` root (`rounded-base`). Поэтому на `classNames.root` достаточно `rounded-*` и `border-primary` (только цвет, без ширины `border` — иначе будет двойная рамка).

### `ButtonGroup.Text` props

| Prop | Описание |
|------|----------|
| `buttonSize` | Высота frame (из context или prop) |
| `groupSegment` | Override позиции сегмента |
| `className` | На span-оболочку |
| `children` | Текст (через `Text`) |

### Auto-detect сегментов

`buttonGroupAPI.isGroupSegmentSlot` распознаёт:

| Child | Glue в joined mode |
|-------|-------------------|
| `Button` | да |
| `Input.Control` | да |
| `ComboBox` | да |
| `Select` | да |
| `SearchInput` | да |
| `Dropdown` | да (root) |
| `ButtonGroup.Text` | да |

Позиция: `first` \| `middle` \| `last` \| `only` — авто или `groupSegment` на child.

## variant / size / режимы

| Режим | Поведение |
|-------|-----------|
| joined (`segmented=false`) | Общая рамка, скругления по позиции, separators |
| segmented | `gap-xsmall`, каждый сегмент `rounded-base` |
| `variant="gloss"` | `gloss-panel`; separators скрыты |
| `orientation="vertical"` | `flex-col`, separators `border-b-token` |

| `buttonSize` | `ButtonGroup.Text` Text variant |
|--------------|-------------------------------|
| `small` | `small` |
| `base` | `base` |
| `mid` | `mid` |
| `large` | `mid` |

## Анимации

### Slot motion

| Слоты | Фазы | Дефолт |
|-------|------|--------|
| `root`, `text` | `enter` (opt-in) | empty |

Не оборачивает хосты item Button. Separator не слот.

`false` на фазе — skip без kill и без смены визуала. Не анимируйте layout (`width` / `height` / `top` / `left` / `margin`) в публичных MotionVars. Кастомный `motion` — opt-in: без пропа дефолтный вид не меняется.


`buttonGroupAnimations.ts` играет opt-in `enter` на `root` / `text`. Motion сегментов по-прежнему на детях.

**DOM (joined horizontal):**

```
<div role=group>
  <ButtonGroupSegmentProvider segment=first>
    <Button groupSegment>          ← squeeze на contentMotionRef
  <span separator aria-hidden>
  <ButtonGroupSegmentProvider segment=last>
    <Input.Control groupSegment>   ← shell hover off when glued
```

### Button в группе

`useFirstLevelInteractiveMotion` с `useContentRef: !!groupSegment` — squeeze/lift на inner content, не на glue-корне. `SHADOW_LIFT_MOTION_CLASS` на корне отключается.

### Input / ComboBox / SearchInput

При `groupSegment`: отключается standalone shell hover; применяются `buttonGroupRoundingClasses` + `buttonGroupSegmentSurfaceClasses`.

### ButtonGroup.Text

Статичный span — **без** GSAP.

#### Кастомизация

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  pressSqueezeScale: [1, 0.96, 1],
  interactiveDuration: 220,
});
```

### Чего нет

- Group-level enter/exit
- Собственные GSAP-хуки в composite

### Сводка: что настраивается где

| Анимация | Утилита | Ключи `configureMotion` | Локальный prop |
|----------|---------|---------------------------|----------------|
| Button squeeze | `useFirstLevelInteractiveMotion` | `pressSqueezeScale` | `groupSegment` |
| Input shell | field shell utils | hover tokens | `groupSegment` |
| ButtonGroup.Text | — | — | static |

## Токены и CSS

`buttonGroupStyles.ts`:

| Функция / константа | Назначение |
|---------------------|------------|
| `buttonGroupRootClass` | `inline-flex w-fit`, orientation; joined frame via `::after` (`rounded-[inherit]`, `border-inherit`) |
| `buttonGroupSeparatorClass` | `border-r-token` / `border-b-token` |
| `buttonGroupRoundingClasses` | Скругления сегмента через `rounded-[inherit]` от root |
| `buttonGroupOverlapBorderClasses` | `border-l-0` на стыках |
| `buttonGroupSegmentSurfaceClasses` | `!border-0 !shadow-none`, z-index focus (без rounding — его даёт `buttonGroupRoundingClasses`) |
| `buttonGroupTextFrameClass` | Высота из `CONTROL_SIZE_LAYOUT` |
| `BUTTON_GROUP_TEXT_LABEL_CLASS` | `truncate font-medium` |

Gloss: `glossInteractive.css` на root.

## Стилизация и кастомизация

### `className` и `classNames`

| Часть | Кастомизация |
|-------|--------------|
| root | `className` / `classNames.root` |
| separator | `classNames.separator` |
| `ButtonGroup.Text` | `className` / `classNames.text` / `classNames.textLabel` |
| сегменты | `Button className`, `groupSegment` override |

```tsx
<ButtonGroup
  aria-label="Custom"
  classNames={{
    root: "rounded-mid border-primary/25 p-xsmall",
    separator: "border-primary/40",
    text: "bg-primary/5",
    textLabel: "text-primary font-w-mid",
  }}
>
  <ButtonGroup.Text>Label</ButtonGroup.Text>
  <Button variant="outline">One</Button>
  <Button variant="outline">Two</Button>
</ButtonGroup>
```

На joined-root: `rounded-*` и `border-*` (цвет) перекрашивают/скругляют видимую рамку. Не задавайте ширину `border` на root — она на `::after`.

### Toolbar с Input

```tsx
<ButtonGroup aria-label="Поиск и фильтры" buttonSize="base" className="w-full max-w-md">
  <Input.Control name="q" placeholder="Поиск…" />
  <Button variant="outline" iconOnly aria-label="Фильтр">
    <IoFilter aria-hidden />
  </Button>
</ButtonGroup>
```

### Vertical + danger

```tsx
<ButtonGroup orientation="vertical" aria-label="Действия" className="w-48">
  <Button variant="outline">Редактировать</Button>
  <Button variant="outline" status="danger">Удалить</Button>
</ButtonGroup>
```

### Практические заметки

- **Обязателен** `aria-label` или `aria-labelledby` на группе.
- `segmented` — когда нужны независимые тени/hover на кнопках.
- `groupSegment` на внутреннем `Button` при `Dropdown` как child (корень `Dropdown` сам прокидывает `rounded-[inherit]` из группы).
- `SearchInput` в одной строке с группой — см. story `ToolbarWithSearchInputRow`.
- Separators: `aria-hidden`.
- Focus: `focus-visible:z-[2]` на сегментах.

## Интеграции

| Компонент | Поведение |
|-----------|-----------|
| `Button` | `groupSegment` из context |
| `Input.Control` | Fused shell, `flex-1` horizontal |
| `ComboBox` / `Select` / `SearchInput` | Glue shell; ComboBox/Select — radius bridge на `Field` |
| `Dropdown` | Segment slot; root → radius bridge; trigger Button с `groupSegment` |
| `ToggleButtonGroup` | Переиспользует `buttonGroupStyles` |
| `Ripple` | На Button внутри группы |

Context: `ButtonGroupLayoutProvider` (`segmented`), `ButtonGroupSegmentProvider`.

## Доступность

- Root: `role="group"`
- Separators: `aria-hidden`
- Клавиатура — нативная у Button/Input внутри
- Требуется accessible name на группе

## Структура файлов

```
ButtonGroup/
├── ButtonGroup.tsx
├── index.ts
├── buttonGroupTypes.ts
├── buttonGroupStyles.ts
├── buttonGroupAPI.ts
├── buttonGroupParts.tsx
├── buttonGroupContext.tsx
├── useButtonGroupRootState.ts
└── ButtonGroup.stories.tsx
```

## Storybook

`Composite Components/ButtonGroup` — horizontal, segmented, click interaction, vertical, fused input, search row, multiple groups.
