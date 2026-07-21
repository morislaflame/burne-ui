# ButtonGroup

Layout-обёртка для склеенных или раздельных сегментов: `Button`, `Input.Control`, `ComboBox`, `SearchInput`, `Dropdown`, `ButtonGroupText`. **Не compound API** — root + отдельный `ButtonGroupText`.

## Импорт

```tsx
import { ButtonGroup, ButtonGroupText, type ButtonGroupProps, type ButtonGroupTextProps, type ButtonGroupOrientation, type ButtonGroupSegment } from "burne-ui";
```

Style helpers (из модуля): `buttonGroupRoundingClasses`, `buttonGroupSegmentSurfaceClasses`, `buttonGroupTextFrameClass`.

## API

### Joined (fused) группа

```tsx
<ButtonGroup aria-label="Действия с документом" buttonSize="base" variant="default">
  <ButtonGroupText>Вид</ButtonGroupText>
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

Simple API и compound `ButtonGroup.Text` **нет** — только `ButtonGroupText`.

### Root props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `orientation` | `horizontal` | `horizontal` \| `vertical` |
| `segmented` | `false` | `true` — gap между сегментами, без glue |
| `buttonSize` | `base` | Каскад в сегменты: `small` \| `base` \| `mid` \| `large` |
| `variant` | `default` | `default` \| `outline` \| `secondary` \| `gloss` \| `primary` |
| `className` | — | На root `<div role="group">` |
| `children` | — | Сегменты |

`status` на группе нет — на дочерних `Button`.

### `ButtonGroupClassNames`

`root`, `separator`, `text`, `textLabel`.

`separator` — слот layout-разделителя (compound-части нет).

### `ButtonGroupText` props

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
| `SearchInput` | да |
| `Dropdown` | да (root) |
| `ButtonGroupText` | да |

Позиция: `first` \| `middle` \| `last` \| `only` — авто или `groupSegment` на child.

## variant / size / режимы

| Режим | Поведение |
|-------|-----------|
| joined (`segmented=false`) | Общая рамка, скругления по позиции, separators |
| segmented | `gap-xsmall`, каждый сегмент `rounded-base` |
| `variant="gloss"` | `gloss-panel`; separators скрыты |
| `orientation="vertical"` | `flex-col`, separators `border-b-token` |

| `buttonSize` | `ButtonGroupText` Text variant |
|--------------|-------------------------------|
| `small` | `small` |
| `base` | `base` |
| `mid` | `mid` |
| `large` | `mid` |

## Анимации

У `ButtonGroup` **нет** `*Animations.ts`. Motion делегирован сегментам.

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

### ButtonGroupText

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
| ButtonGroupText | — | — | static |

## Токены и CSS

`buttonGroupStyles.ts`:

| Функция / константа | Назначение |
|---------------------|------------|
| `buttonGroupRootClass` | `inline-flex w-fit`, orientation, gloss border |
| `buttonGroupSeparatorClass` | `border-r-token` / `border-b-token` |
| `buttonGroupRoundingClasses` | Скругления по `segment.position` |
| `buttonGroupOverlapBorderClasses` | `border-l-0` на стыках |
| `buttonGroupSegmentSurfaceClasses` | `!border-0 !shadow-none`, z-index focus |
| `buttonGroupTextFrameClass` | Высота из `CONTROL_SIZE_LAYOUT` |
| `BUTTON_GROUP_TEXT_LABEL_CLASS` | `truncate font-medium` |

Gloss: `glossInteractive.css` на root.

## Стилизация и кастомизация

### Один уровень — `className`

| Часть | Кастомизация |
|-------|--------------|
| root | `ButtonGroup className` |
| `ButtonGroupText` | `className` |
| сегменты | `Button className`, `groupSegment` override |

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
- `groupSegment` на внутреннем `Button` при `Dropdown` как child.
- `SearchInput` в одной строке с группой — см. story `ToolbarWithSearchInputRow`.
- Separators: `aria-hidden`.
- Focus: `focus-visible:z-[2]` на сегментах.

## Интеграции

| Компонент | Поведение |
|-----------|-----------|
| `Button` | `groupSegment` из context |
| `Input.Control` | Fused shell, `flex-1` horizontal |
| `ComboBox` / `Select` / `SearchInput` | Glue shell |
| `Dropdown` | Segment slot; trigger Button с `groupSegment` |
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
