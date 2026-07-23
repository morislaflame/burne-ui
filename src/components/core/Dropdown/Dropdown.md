# Dropdown

Меню действий и выбора значений. Построен поверх `Popover` (portal, squeeze на open). Compound API: trigger, popover, groups, items, submenus, selection indicators.

## Импорт

```tsx
import { Dropdown, type DropdownProps, type DropdownClassNames, type DropdownItemProps, type DropdownItemVariant } from "burne-ui";
```

## API

### Базовое меню

```tsx
<Dropdown>
  <Dropdown.Trigger asChild>
    <Button variant="outline">Действия</Button>
  </Dropdown.Trigger>
  <Dropdown.Popover>
    <Dropdown.Item onClick={handleEdit}>Редактировать</Dropdown.Item>
    <Dropdown.Separator />
    <Dropdown.Item status="danger">Удалить</Dropdown.Item>
  </Dropdown.Popover>
</Dropdown>
```

### Selection (single / multiple)

```tsx
<Dropdown
  selectionIndicator
  defaultValue="ru"
  onValueChange={setLang}
>
  <Dropdown.Trigger asChild>
    <Button variant="outline">Язык</Button>
  </Dropdown.Trigger>
  <Dropdown.Popover>
    <Dropdown.Group>
      <Dropdown.Label>Выберите язык</Dropdown.Label>
      <Dropdown.Item value="ru">
        <Dropdown.ItemIndicator />
        <Dropdown.ItemLabel>Русский</Dropdown.ItemLabel>
      </Dropdown.Item>
      <Dropdown.Item value="en">
        <Dropdown.ItemIndicator />
        <Dropdown.ItemLabel>English</Dropdown.ItemLabel>
      </Dropdown.Item>
    </Dropdown.Group>
  </Dropdown.Popover>
</Dropdown>
```

### Submenu

```tsx
<Dropdown.Popover>
  <Dropdown.Sub>
    <Dropdown.SubTrigger>Ещё</Dropdown.SubTrigger>
    <Dropdown.SubContent>
      <Dropdown.Item>Экспорт</Dropdown.Item>
    </Dropdown.SubContent>
  </Dropdown.Sub>
</Dropdown.Popover>
```

### Root props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `open` / `defaultOpen` | `false` | Controlled / uncontrolled |
| `onOpenChange` | — | Колбэк open state |
| `multiple` | `false` | Multi-select |
| `value` / `defaultValue` | — | `string` или `string[]` |
| `onValueChange` | — | Колбэк выбора |
| `selectionIndicator` | `false` | Показывать radio/check indicators |
| `closeOnSelect` | `!multiple` | Закрывать после выбора |
| `popoverVariant` | `default` | `default` \| `gloss` для panel |
| `classNames` | — | Слоты |

### `DropdownClassNames`

`root`, `trigger`, `popover`, `popoverBody`, `group`, `label`, `separator`, `item`, `itemLabel`, `itemHint`, `itemIcon`, `itemIndicator`, `itemIndicatorShell`, `itemIndicatorFill`, `itemIndicatorMark`, `sub`, `subTrigger`, `subTriggerLabelWrap`, `subTriggerChevron`, `subContent`, `subContentGlossPanel`, `subContentGlossContent`.

### Compound-подчасти

| Часть | Назначение |
|-------|------------|
| `Dropdown.Trigger` | Toggle; `asChild` для `Button` |
| `Dropdown.Popover` | Обёртка над `Popover` (меню-хост; не `Popover.Content`) |
| `Dropdown.Group` | `role="group"` + optional indicators |
| `Dropdown.Label` | Заголовок группы |
| `Dropdown.Separator` | Разделитель (`Separator`) |
| `Dropdown.Item` | Пункт меню / selection row |
| `Dropdown.ItemLabel` / `Hint` / `Icon` | Слоты строки |
| `Dropdown.ItemIndicator` | `SelectionIndicator` compound |
| `Dropdown.Sub` | Вложенное подменю |
| `Dropdown.SubTrigger` / `SubContent` | Hover/flyout submenu |

### `Dropdown.Item` props

| Prop | Описание |
|------|----------|
| `value` | Значение для selection |
| `href` | Link item (закрывает меню) |
| `disabled` | Блокировка |
| `selection` | `false` — action item без indicator |
| `variant` | `default` \| `danger` \| `warning` \| `info` \| `success` |

## variant (item) и popover

| `Dropdown.Item` variant | Стили |
|-------------------------|-------|
| `default` | `text-foreground` + `hoverVariant()` |
| `danger` | `text-danger` + `hoverVariant("danger")` |
| `warning` | `text-warning` + semantic hover |
| `info` | `text-info` + semantic hover |
| `success` | `text-success` + semantic hover |

`popoverVariant` на root (`default` \| `gloss`) передаётся в `Popover` и в submenu portal.

Строка item — grid из `optionListItemGridClass` (indicator | icon | label/hint), как у `ListBox` / `Select`.

## Анимации

Motion разбит: `dropdownAnimations.ts` (keyboard, submenu portal) + `Popover` (main panel) + `runOpenAfterSqueeze` (trigger).

**DOM (open menu):**

```
<div class=root>                         ← inline-flex wrapper
  <button|asChild> Trigger               ← squeeze target
  <Popover.Content unstyled>             ← portal, motionTooltip
    <Popover.Body role=menu>             ← scrollable list
      <Dropdown.Group>
        <Dropdown.Item>                  ← press squeeze on pointerdown
          <ItemIndicator /> <ItemLabel />
      <Dropdown.Sub>
        <SubTrigger>                     ← hover open, CSS hoverVariant
        <SubContent portal z-110>        ← separate portal motion
```

Нет hover-lift на root wrapper. Item/sub row — CSS `hoverVariant`, не GSAP shadow.

### 1. Trigger open — press squeeze

`Dropdown.Trigger` на `pointerdown` (если меню закрыто):

1. `e.preventDefault()` — блокирует собственный squeeze дочернего `Button`
2. `runOpenAfterSqueeze({ triggerRef, openingRef, setOpen: true })` — squeeze trigger, затем open

**Close:** `click` при `open=true` → `setOpen(false)` сразу, без squeeze.

`asChild`: handlers merge на child; порядок — trigger `pointerdown` первым.

#### Кастомизация squeeze

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  interactiveDuration: 280,
  pressSqueezeScale: [1, 0.98, 1],
  enablePressSqueeze: true,
});
```

**Reduced motion:** squeeze пропускается внутри `animateInteractivePressSqueeze` / `prefersReducedInteractiveHoverLift`.

### 2. Main popover portal

`Dropdown.Popover` — thin wrapper над `Popover`:

- `side` — `top` | `right` | `bottom` | `left` (по умолчанию `bottom`)
- `matchAnchorWidth` — ширина panel = trigger
- `align` — `start` | `center` | `end` (по умолчанию `start` при match width); для trailing «⋯» в ButtonGroup удобен `align="end"`
- `offset` — отступ от триггера в px
- `unstyled` — surface задаётся `popoverBody`
- `contentRole={undefined}` — dialog semantics отключены; `role="menu"` на `Popover.Body`
- `shouldDismiss` — игнорирует клики внутри `subPanelRootsRef`

Enter/exit: `animatePortalOpen` / `animatePortalClose` + `motionTooltip()` (scale 0.97→1, fade).

Persistent shadow на default panel — из `Popover` (`usePersistentElShadow`).

#### Кастомизация portal

```ts
configureMotion({
  tooltipDuration: 200,        // → motionTooltip duration
  interactiveEase: "power2.out",
});
```

**Reduced motion:** `applyReducedPortalMotion` / instant unmount.

### 3. Item press squeeze

`Dropdown.Item` на `pointerdown` (если не `disabled`):

```ts
animateInteractivePressSqueeze(el);
```

Только row element (`<button>` / `<a>`), не indicator fill. Selection state меняется без GSAP — через `SelectionIndicator`.

### 4. Submenu flyout portal

`useDropdownSubContentPortal` (`SubContent`):

**Open:** `pointerenter` / `click` / `Enter|Space` на `SubTrigger` → `setOpen(true)`.

**Position:** fixed `left/top`, gap 6px справа от trigger; flip влево если не влезает; clamp по viewport height.

**Motion:** отдельный portal `z-[110]` с тем же `animatePortalOpen`/`Close` + `motionTooltip()`.

**Dismiss coordination:** `subPanelRootsRef` регистрирует submenu roots — main popover не закрывается при клике внутри submenu.

**Close delay:** `scheduleClose` на `pointerleave` sub row (hover bridge).

Gloss submenu: `subContentGlossPanel` + `subContentGlossContent` вместо `bg-surface shadow-mid`.

### 5. Keyboard navigation

`useDropdownPopoverMenu` на open:

| Key | Действие |
|-----|----------|
| `ArrowDown` / `ArrowUp` | Следующий/предыдущий focusable item |
| `Home` / `End` | Первый/последний item |
| `ArrowRight` / `Enter` / `Space` на `SubTrigger` | Открыть submenu + фокус на первый пункт |
| `ArrowLeft` / `Escape` в submenu | Закрыть submenu + фокус на `SubTrigger` |
| `Escape` в main menu | Close + focus trigger |

При open — autofocus на первый focusable item в panel.

### Чего нет

- Hover lift / second-level shadow на items (только CSS tint)
- Ripple на items
- FLIP-анимация списка при смене selection

### Сводка: что настраивается где

| Анимация | Утилита | Ключи `configureMotion` | Локальный prop |
|----------|---------|---------------------------|----------------|
| Trigger squeeze | `runOpenAfterSqueeze` | `pressSqueezeScale`, `interactiveDuration`, `enablePressSqueeze` | — |
| Main panel portal | `Popover` + `motionTooltip` | `tooltipDuration`, `interactiveEase` | `popoverVariant` |
| Item squeeze | `animateInteractivePressSqueeze` | `pressSqueezeScale` | `disabled` |
| Submenu portal | `useDropdownSubContentPortal` | `tooltipDuration` | `popoverVariant` |
| Item hover tint | `hoverVariant()` CSS | — | `variant` на Item |

## Токены и CSS

| Класс / токен | Назначение |
|---------------|------------|
| `DROPDOWN_POPOVER_BODY_CLASS` | `max-h-[min(24rem,70vh)]`, `p-base`, scroll |
| `DROPDOWN_ITEM_BASE_CLASS` | `rounded-mid px-base py-small` row |
| `hoverVariant()` | Semantic hover background на item/sub |
| `optionListItemGridClass` | Grid: indicator, icon, label, hint |
| `shadow-token-md` | Submenu default surface |
| `gloss-panel gloss-deep` | Gloss popover/submenu |
| `z-[100]` / `z-[110]` | Main menu / submenu stacking |

## Стилизация и кастомизация

### Два уровня

1. **`className` на root `Dropdown`** — мерж с `classNames.root` на wrapper `relative inline-flex`.
2. **`classNames` на root** — все слоты через `DropdownClassNamesProvider`.

Подчасти (`Dropdown.Item`, `Dropdown.SubTrigger`, …) принимают **`className`** поверх слота.

`bodyClassName` на `Dropdown.Popover` — доп. классы на `Popover.Body` (`role="menu"`).

### Слоты `DropdownClassNames`

| Слот | DOM / элемент | Когда использовать |
|------|---------------|-------------------|
| `root` | Wrapper div | Внешний layout trigger+popover |
| `trigger` | Trigger button / asChild | Доп. классы на кнопке (с `asChild` merge на child) |
| `popover` | `Popover.Content` shell | z-index, outer ring |
| `popoverBody` | `Popover.Body` | Padding, border, max-height scroll area |
| `group` | `Dropdown.Group` | Gap между items |
| `label` | `Dropdown.Label` | Заголовок секции muted |
| `separator` | `Dropdown.Separator` | Отступы разделителя |
| `item` | Item row | Radius, padding всей строки |
| `itemLabel` | Label span | Typography пункта |
| `itemHint` | Hint span | Secondary text под label |
| `itemIcon` | Leading icon slot | Размер/цвет иконки |
| `itemIndicator` | Indicator wrapper | Позиция radio/check |
| `itemIndicatorShell` / `Fill` / `Mark` | `SelectionIndicator` parts | Кастом mark/fill |
| `sub` | `Dropdown.Sub` wrapper | Submenu container |
| `subTrigger` | Sub trigger row | Hover row стили |
| `subTriggerLabelWrap` | Label flex area | Truncate длинных label |
| `subTriggerChevron` | `IoChevronForward` | Muted chevron |
| `subContent` | Submenu portal panel | Flyout surface |
| `subContentGlossPanel` / `GlossContent` | Gloss submenu layers | Gloss variant |

### Simple-подобный selection menu

```tsx
<Dropdown
  selectionIndicator
  defaultValue="ru"
  popoverVariant="default"
  classNames={{
    popoverBody: "border border-primary/20 bg-surface",
    label: "text-primary font-medium",
    item: "rounded-lg",
    itemLabel: "font-medium",
  }}
>
  <Dropdown.Trigger asChild>
    <Button variant="outline">Язык интерфейса</Button>
  </Dropdown.Trigger>
  <Dropdown.Popover>
    <Dropdown.Group>
      <Dropdown.Label>Выберите язык</Dropdown.Label>
      <Dropdown.Item value="ru">
        <Dropdown.ItemIndicator />
        <Dropdown.ItemLabel>Русский</Dropdown.ItemLabel>
      </Dropdown.Item>
      <Dropdown.Item value="en">
        <Dropdown.ItemIndicator />
        <Dropdown.ItemLabel>English</Dropdown.ItemLabel>
      </Dropdown.Item>
    </Dropdown.Group>
  </Dropdown.Popover>
</Dropdown>
```

### Compound с submenu и semantic items

```tsx
<Dropdown classNames={{ item: "rounded-mid", subContent: "shadow-token-lg" }}>
  <Dropdown.Trigger>Меню</Dropdown.Trigger>
  <Dropdown.Popover bodyClassName="p-small">
    <Dropdown.Item status="danger">
      <Dropdown.ItemLabel>Удалить</Dropdown.ItemLabel>
    </Dropdown.Item>
    <Dropdown.Separator />
    <Dropdown.Sub>
      <Dropdown.SubTrigger>Экспорт</Dropdown.SubTrigger>
      <Dropdown.SubContent>
        <Dropdown.Item>CSV</Dropdown.Item>
        <Dropdown.Item>PDF</Dropdown.Item>
      </Dropdown.SubContent>
    </Dropdown.Sub>
  </Dropdown.Popover>
</Dropdown>
```

`Dropdown.Group selectionIndicator={false}` — локально скрыть indicators в одной секции.

### Практические заметки

- **`Dropdown.Popover`** — плавающий host меню (Select/ComboBox тоже используют `Popover` для панели списка). Не путать с `Popover.Content` — там тело содержимого внутри Popover.
- **`asChild` на Trigger:** стили `trigger` merge на child; squeeze координируется через `preventDefault`.
- **Action items:** без `value` или `selection={false}` — закрывают меню без toggle selection.
- **Link items:** `href` → `<a>`, role `menuitem`, close on navigate.
- **Не задавайте `transform` на `popover` content** — конфликт с portal GSAP scale.
- **Gloss:** `popoverVariant="gloss"` на root влияет и на main panel (через Popover), и на submenu surface.
- **Порядок мержа:** базовые → `classNames.slot` → `className` подчасти.

## Интеграции

| Компонент | Использование |
|-----------|---------------|
| `Popover` | Portal + positioning |
| `SelectionIndicator` | Item selection marks |
| `Breadcrumbs` | Ellipsis hidden crumbs menu |
| `Button` | Typical trigger (`asChild`) |

## Доступность

- Trigger: `aria-expanded`, `aria-haspopup="menu"`, `aria-controls`
- Popover body: `role="menu"`
- Item: `menuitem` / `menuitemradio` / `menuitemcheckbox`
- Group: `role="group"` + `aria-labelledby`
- Keyboard navigation в открытом menu (включая submenu: ArrowRight открыть, ArrowLeft/Escape закрыть)
- Typeahead по первым буквам (буфер ~500ms) в menu и submenu
- Закрытие (Escape, выбор пункта, outside click) всегда возвращает focus на trigger

## Структура файлов

```
Dropdown/
├── Dropdown.tsx
├── index.ts
├── dropdownTypes.ts
├── dropdownStyles.ts
├── dropdownAnimations.ts
├── dropdownParts.tsx
├── useDropdownRootState.ts
├── useDropdownSubState.ts
├── dropdownContext.tsx
├── dropdownAPI.ts
├── dropdownA11y.ts
└── Dropdown.stories.tsx
```

## Storybook

`Core Components/Dropdown` — actions, selection, multiple, submenus, gloss, `classNames`.
