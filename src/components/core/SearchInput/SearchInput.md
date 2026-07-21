# SearchInput

Компактное поле поиска с **раскрытием** из круглой кнопки в расширенную строку. Atomic-компонент (один файл) — для форм с label/hint используйте `Input`. Поддержка `gloss`, `ripple`, `ButtonGroup`.

## Импорт

```tsx
import {
  SearchInput,
  type SearchInputProps,
  type SearchInputSize,
  type SearchInputVariant,
  type SearchInputClassNames,
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
| `classNames` | — | Слоты `root` / `icon` / `input` / `clear` |
| `aria-label` | — | **Рекомендуется** — collapsed trigger + input |

## Состояния UI

| Состояние | Вид | Поведение |
|-----------|-----|-----------|
| Collapsed | Круглая кнопка с иконкой | `role="button"`, click/Enter/Space → expand |
| Expanded | Прямоугольное поле | `role="search"`, input focus, clear button |
| С query | Expanded + clear | Кнопка `IoClose` |
| Empty blur | Collapse | Если `collapseOnBlur` и пустое значение |

## Анимации

Вся motion в `SearchInput.tsx` (GSAP + field shell utils).

**DOM:**

```
<div ref=rootRef shell>              ← width, borderRadius, shadow
  [Ripple?]
  <span ref=iconRef> IoSearch         ← left position animated
  <input type=search tabIndex=0|-1>
  [button clear]
</div>
```

### 1. Expand / collapse (`runExpandMotion`)

**Expand:**

- Timeline parallel: shell `width` collapsed→targetW, `borderRadius` circle→expanded
- Icon `left`: center → `padX`
- vars: `motionInteractive()`

**Collapse:**

- shell → `collapsedDim` px width, full border-radius
- icon → centered
- onComplete: remove inline width/radius

**Reduced motion:** `applyShellMetrics` instant.

### 2. Shell hover shadow

Collapsed: `shadowNone()`; expanded: `shadowSm()`.

`useSecondLevelShadow` — idle shadow sync по `expanded` key; hover sm→md когда expanded.

Gloss: `useGlossFieldShellMotion` вместо standard hover.

### 3. Press squeeze (collapsed)

`pointerdown` на shell (если !expanded):

- `animateInteractivePressSqueeze` или `animateGlossInteractivePressSqueeze`
- Promise в `squeezePromiseRef` — expand ждёт завершения squeeze

### 4. Icon slide

Синхронно с expand timeline — отдельный tween `iconEl.left`.

### Кастомизация

```ts
configureMotion({
  interactiveDuration: 280,
  interactiveEase: "power2.out",
  hoverLiftScale: 1.025,
  pressSqueezeScale: [1, 0.98, 1],
});
```

Размеры expand width — hardcode `SEARCH_DEFAULT_EXPANDED_WIDTH` per size (не в configureMotion).

### Сводка

| Анимация | `configureMotion` | Hardcode |
|----------|-------------------|----------|
| Expand width/radius | `interactiveDuration` | `expandedWidth` prop |
| Icon slide | interactive | padX per size |
| Hover shadow | `enableHoverLift` | shadow tokens |
| Squeeze | `pressSqueezeScale` | — |
| Ripple | — | `ripple` prop |

## Стилизация и кастомизация

`classNames` — слоты `root` / `icon` / `input` / `clear`. Merge: база компонента → слот `classNames.*` → `className` (только для `root`).

### Слоты `classNames`

| Слот | DOM-элемент |
|------|-------------|
| `root` | Корневой `<div>` shell (то же, что и `className`) |
| `icon` | `<span>`-обёртка иконки `IoSearch` |
| `input` | `<input type="search">` |
| `clear` | Кнопка очистки (`IoClose`) |

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
| Collapsed | `button`, `aria-expanded=false` | Enter/Space → open |
| Expanded | `search`, `aria-expanded=true` | input focus; Esc collapse if empty |
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
├── SearchInput.tsx      # component + all motion
├── index.ts
└── SearchInput.stories.tsx
```

Утилиты: `readControlHeightPx`, `CONTROL_SIZE_LAYOUT`; радиус expanded — `readSearchExpandedRadiusPx` в `searchInputStyles`.

## Storybook

`Core Components/SearchInput` — collapsed/expanded, controlled, gloss, ripple, ButtonGroup, light theme, a11y, classNames.
