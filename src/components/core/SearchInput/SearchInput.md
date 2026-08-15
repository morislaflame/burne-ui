# SearchInput

Компактное поле поиска с **раскрытием** из круглой кнопки в расширенную строку. Atomic-компонент — для форм с label/hint используйте `Input`. Поддержка `gloss`, `ripple`, `ButtonGroup`.

## Импорт

```tsx
import {
  SearchInput,
  type SearchInputProps,
  type SearchInputSize,
  type SearchInputVariant,
  type SearchInputClassNames,
  type SearchInputMotion,
  type SearchInputPartMotion,
} from "burne-ui";
```

## API

### Базовое использование

```tsx
<SearchInput
  placeholder="Найти…"
  defaultExpanded
  onChange={(e) => setQuery(e.target.value)}
/>

<SearchInput
  expanded={open}
  onExpandedChange={setOpen}
  expandedWidth={320}
  collapseOnBlur
  ripple
  aria-label="Поиск по сайту"
/>
```

### Props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `size` | `base` | `small` \| `base` \| `mid` \| `large` |
| `variant` | `default` / gloss из ButtonGroup | `default` \| `gloss` |
| `expanded` / `defaultExpanded` | `false` | Controlled / uncontrolled expand |
| `onExpandedChange` | — | Колбэк раскрытия |
| `expandedWidth` | по size | Ширина в px (240–360) |
| `collapseOnBlur` | `true` | Свернуть при blur если пусто |
| `value` / `defaultValue` / `onChange` | — | Нативный input state (как у `Input`) |
| `ripple` | `false` | `<Ripple color="neutral" />` |
| `groupSegment` | — | Сегмент ButtonGroup |
| `disabled` / `readOnly` | — | Блокировка |
| `className` | — | Алиас `classNames.root` (доп. класс на shell) |
| `classNames` | — | Слоты `root` / `icon` / `input` / `clear` / `expandTrigger` |
| `motion` | — | Карта слотов; expand — `root` / `icon` `enter` / `leave` |
| `aria-label` | — | **Рекомендуется** — collapsed trigger + input |

## Состояния UI

| Состояние | Вид | Поведение |
|-----------|-----|-----------|
| Collapsed | Круглая оболочка с иконкой | shell `role="search"` + overlay `<button>` expand |
| Expanded | Прямоугольное поле | тот же `role="search"`, input focus, clear button |
| С query | Expanded + clear | Кнопка `IoClose` |
| Empty blur | Collapse | Если `collapseOnBlur` и пустое значение |

## Анимации

Публичный slot motion. Expand/collapse — рецепты `searchExpand` (width/radius, только в рецепте) и `searchIconShift` (`left` иконки). Gloss hover/press остаются на `useGlossFieldShellMotion`.

### Slot motion

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `root` | `hoverIn` / `hoverOut` / `pressIn` / `pressOut` / `enter` / `leave` | non-gloss: `hoverLiftSecondLevel`, collapsed `pressSqueeze` (`pressOut: false`); `enter`/`leave` → `searchExpand`. Gloss hover/press — `false` (field-shell) |
| `icon` | `enter` / `leave` | `searchIconShift` |
| `clear` / `input` / `expandTrigger` | hover/press | нет |

`false` на `root`/`icon` `enter`/`leave` — хост `applySearchExpandInstant`. Не анимируйте `width` в публичных MotionVars.

**Где в коде:** типы — `searchInputTypes.ts`; scope — `searchInputContext.tsx`; defaults + host — `searchInputAnimations.ts`; слоты — `searchInputParts.tsx`; Provider — `SearchInput.tsx`. Утилита expand — `core/utils/searchInputExpandMotion.ts`.

```tsx
<SearchInput
  aria-label="Search"
  motion={{
    root: { enter: false, leave: false },
    icon: { enter: false, leave: false },
  }}
/>
```

### Отключение

```ts
configureMotion({ enableHoverLift: false, enablePressSqueeze: false });
```

Expand width — `expandedWidth` / `SEARCH_DEFAULT_EXPANDED_WIDTH` per size (не в `configureMotion`).

## Стилизация и кастомизация

`classNames` — слоты `root` / `icon` / `input` / `clear`. Merge: база компонента → слот `classNames.*` → `className` (только для `root`).

### Слоты `classNames`

| Слот | DOM-элемент |
|------|-------------|
| `root` | Корневой `<div>` shell (то же, что и `className`) |
| `icon` | `<span>`-обёртка иконки `IoSearch` |
| `input` | `<input type="search">` |
| `clear` | Кнопка очистки (`IoClose`) |
| `expandTrigger` | Overlay-кнопка expand в collapsed |

### Что можно настроить

| Способ | Что меняет |
|--------|------------|
| `className` / `classNames.root` | Margin, max-width wrapper, external layout, border/ring |
| `classNames.icon` | Цвет/размер иконки поиска |
| `classNames.input` | Текст, placeholder внутри поля |
| `classNames.clear` | Цвет кнопки очистки |
| `size` | Высота, icon box, collapsed width, default expanded width |
| `variant="gloss"` | `gloss-control` surface |
| `expandedWidth` | Целевая ширина expand (px) |
| `ripple` | Press ripple overlay |

### Пример

```tsx
<SearchInput
  size="mid"
  variant="gloss"
  ripple
  expandedWidth={400}
  className="mx-auto"
  classNames={{
    root: "border-primary/40 ring-1 ring-primary/15",
    icon: "text-primary",
    input: "text-primary placeholder:text-primary/50",
    clear: "text-primary hover:text-primary/70",
  }}
  aria-label="Поиск товаров"
  placeholder="Найти товар…"
/>
```

### В ButtonGroup

```tsx
<ButtonGroup variant="gloss">
  <SearchInput groupSegment="start" />
  <Button groupSegment="end">Фильтр</Button>
</ButtonGroup>
```

При segment: group rounding/surface; shell hover отключён.

### Clear button

Базовые стили фиксированы (CSS `hoverVariant`, `focus-ring-inset`); доп. классы — через `classNames.clear`.

### Практические заметки

- **Для форм с label** — используйте `Input` + prefix icon, не SearchInput.
- **Controlled expand:** `expanded` + `onExpandedChange` для header toolbar integration.
- **Не override `width`/`borderRadius` в className** при expand — конфликт с GSAP inline styles.
- **`aria-label` обязателен** в collapsed mode (дефолт «Open search»).

## Доступность

| Состояние | role | Клавиатура |
|-----------|------|------------|
| Shell | всегда `role="search"` | не меняется при expand |
| Collapsed trigger | `<button>`, `aria-expanded=false`, `aria-controls` | Enter/Space → open |
| Expanded | input focus; Esc collapse if empty | роли shell не трогаем |
| Input | `type="search"` | Native search; `tabIndex` 0 only when expanded |

- Clear: `aria-label="Clear field"`
- Иконки: `aria-hidden`

## Интеграция

| Контекст | Поведение |
|----------|-----------|
| `ButtonGroup` | `groupSegment`, gloss variant |
| Card toolbar | `defaultExpanded`, custom `expandedWidth` |

## Структура файлов

```
SearchInput/
├── SearchInput.tsx              # thin orchestrator
├── index.ts
├── searchInputTypes.ts
├── searchInputStyles.ts         # classes + SIZE_LAYOUT / resolveSearchLayout / radius
├── searchInputA11y.ts
├── searchInputAnimations.ts     # defaults + host play (expand / hover / press)
├── searchInputContext.tsx       # createMotionScope
├── useSearchInputRootState.ts
├── searchInputParts.tsx         # icon, control, clear, expandTrigger, ripple
├── SearchInput.stories.tsx
└── SearchInput.md
```

Утилиты: `readControlHeightPx`, `CONTROL_SIZE_LAYOUT`; радиус expanded — `readSearchExpandedRadiusPx` в `searchInputStyles`.

## Storybook

`Core Components/SearchInput` — collapsed/expanded, controlled, gloss, ripple, ButtonGroup, light theme, a11y, classNames, slot motion gallery.
