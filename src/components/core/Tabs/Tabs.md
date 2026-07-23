# Tabs

Вкладки с compound API: `List`, `Tab`, `Panel`. Sliding indicator (GSAP), hover/press на тексте неактивных табов. Поддерживает horizontal/vertical, `variant`, `size`. Simple API нет — только compound children.

## Импорт

```tsx
import { Tabs, useTabsContext, type TabsProps, type TabsListProps, type TabsTabProps, type TabsPanelProps, type TabsSize, type TabsOrientation, type TabsVariant, type TabsClassNames } from "burne-ui";
```

## API

### Compound API

```tsx
<Tabs defaultValue="profile" variant="outline" size="base">
  <Tabs.List>
    <Tabs.Tab value="profile">Профиль</Tabs.Tab>
    <Tabs.Tab value="settings">Настройки</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="profile">Контент профиля</Tabs.Panel>
  <Tabs.Panel value="settings">Контент настроек</Tabs.Panel>
</Tabs>
```

### Controlled

```tsx
const [tab, setTab] = useState("profile");

<Tabs value={tab} onValueChange={setTab}>
  <Tabs.List>...</Tabs.List>
  <Tabs.Panel value="profile">...</Tabs.Panel>
</Tabs>
```

### Root props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `value` | — | Контролируемое значение вкладки |
| `defaultValue` | — | Начальное (uncontrolled) |
| `onValueChange` | — | `(value: string) => void` |
| `orientation` | `horizontal` | `horizontal` \| `vertical` |
| `size` | `base` | `small` \| `base` \| `mid` \| `large` |
| `variant` | `default` | `default` \| `outline` \| `secondary` \| `gloss` |
| `disabled` | `false` | Отключает всю группу |
| `className` | — | На root `<div>` |
| `classNames` | — | Слоты |

### Compound-подчасти

| Часть | Назначение |
|-------|------------|
| `Tabs.List` | `role="tablist"`, indicator, keyboard nav |
| `Tabs.Tab` | Кнопка вкладки; `value`, `asChild`, `disabled` |
| `Tabs.Panel` | `role="tabpanel"`, `value` |

### `TabsClassNames`

`root`, `list`, `indicator`, `tab`, `tabText`, `panel`.

## variant и размеры

| variant | List surface | Indicator |
|---------|--------------|-----------|
| `default` | border-bottom/left line | `bg-primary` линия 2px |
| `outline` | `bg-transparent border-token rounded-mid` | bbox таба, `bg-secondary` |
| `secondary` | `bg-secondary border-token rounded-mid` | bbox, `bg-tertiary` |
| `gloss` | `gloss-panel rounded-mid` | bbox, `bg-tertiary` |

`status` нет — только `variant` + `size`.

| size | Высота таба | Text variant |
|------|-------------|--------------|
| `small` | `CONTROL_SIZE_LAYOUT.small` | `small` |
| `base` | `CONTROL_SIZE_LAYOUT.base` | `base` |
| `mid` | `CONTROL_SIZE_LAYOUT.mid` | `mid` |
| `large` | `CONTROL_SIZE_LAYOUT.large` | `large` |

## Анимации

`tabsAnimations.ts` + `useSlidingTabIndicator.ts` + gloss на `Tabs.List`.

**DOM:**

```
<div class=root>
  <div role=tablist class=list ref=listRef>
    <span class=indicator />              ← GSAP left/top/width/height
    <button role=tab>
      <Text ref=motionRef class=tabText>  ← hover squeeze (не selected)
  <div role=tabpanel hidden=...>
```

### 1. Sliding indicator (`useSlidingTabIndicator`)

При смене `value` / resize:

1. Находит selected tab в list
2. Считает metrics (bbox или линия 2px для `default`)
3. GSAP `fromTo(indicator, metrics, { ...motionInteractive() })`
4. `ResizeObserver` на list + tabs → пересчёт

**First layout / reduced motion:** мгновенное позиционирование без tween.

#### Кастомизация

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  interactiveDuration: 280,
  interactiveEase: "power2.out",
});
```

### 2. Tab text hover/press (`useTabPointerMotion`)

Только **неактивные** табы (`!isSelected`):

- **Hover:** `animateInteractiveHoverLift` на `tabText` span
- **Press:** `animateInteractivePressSqueeze`

Selected tab — без motion (статичный primary text).

`asChild` — motion не применяется (нет внутреннего `Text` ref).

### 3. Gloss list (`variant="gloss"`)

`useMergedGlossPanelRef` на `Tabs.List` — gloss box-shadow/lift панели списка.

### Чего нет

- Press squeeze на selected tab
- Portal motion
- Ripple
- `status` semantic colors

### Сводка: что настраивается где

| Анимация | Утилита | Ключи `configureMotion` | Локальный prop |
|----------|---------|---------------------------|----------------|
| Indicator slide | `useSlidingTabIndicator` | `interactiveDuration`, `interactiveEase` | `variant`, `orientation` |
| Tab text hover/squeeze | `useTabPointerMotion` | `hoverLiftScale`, `pressSqueezeScale` | `disabled`, selected |
| Gloss list | gloss utils | gloss tokens | `variant="gloss"` |

## Токены и CSS

| Класс / токен | Назначение |
|---------------|------------|
| `tabsRootClass` | `flex gap-mid`, orientation row/col |
| `LIST_VARIANT_CLASS` | Surface per variant |
| `INDICATOR_VARIANT_CLASS` | Indicator color/shape |
| `CONTROL_SIZE_LAYOUT` | Tab height/padding per size |
| `TEXT_COLOR_TRANSITION` | Muted → primary hover |
| `focus-ring-inset` | Keyboard focus на tab/panel |

## Стилизация и кастомизация

### Два уровня

1. **`className` на `Tabs`** — root layout.
2. **`classNames` на root** — list, indicator, tab, panel.

`Tabs.Tab` / `Tabs.Panel` — **`className`** поверх слота `tab` / `panel`.

### Слоты `TabsClassNames`

| Слот | DOM | Когда использовать |
|------|-----|-------------------|
| `root` | Root wrapper | Max-width, outer border |
| `list` | `tablist` | Background ring, padding |
| `indicator` | Sliding span | Custom indicator color/shape |
| `tab` | Tab button | Font, padding override |
| `tabText` | Inner Text span | Gap icons, typography |
| `panel` | `tabpanel` | Content area bg/padding |

### Пример кастомизации

```tsx
<Tabs
  defaultValue="a"
  classNames={{
    root: "max-w-xl rounded-mid border border-info/25 p-base",
    list: "bg-info/5 ring-1 ring-info/15",
    indicator: "bg-info/30",
    tab: "font-medium",
    tabText: "gap-small",
    panel: "rounded-small bg-info/5 p-mid",
  }}
>
  <Tabs.List>
    <Tabs.Tab value="a">Вкладка A</Tabs.Tab>
    <Tabs.Tab value="b">Вкладка B</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="a">Контент A</Tabs.Panel>
  <Tabs.Panel value="b">Контент B</Tabs.Panel>
</Tabs>
```

### `asChild` на Tab

```tsx
<Tabs.Tab value="custom" asChild>
  <Button variant="ghost" type="button">Кастомный таб</Button>
</Tabs.Tab>
```

Handlers и ARIA merge на child; text motion отключён.

### Практические заметки

- Каждый `Tabs.Tab` и `Tabs.Panel` должен иметь уникальный `value`.
- `disabled` на root блокирует все табы; per-tab — `disabled` на `Tabs.Tab`.
- Vertical: `orientation="vertical"` + keyboard `ArrowUp`/`ArrowDown`.
- **Не задавайте `transform` на `indicator`** — GSAP анимирует position/size.
- **Порядок мержа:** variant/size → `classNames.slot` → `className` tab/panel.

## Интеграции

| Компонент | Сценарий |
|-----------|----------|
| `Button` | `asChild` trigger tab |
| `Badge` | Счётчик на tab label |
| `Card` | Panel content layout |

## Доступность

- Tab: `role="tab"`, `aria-selected`, `aria-controls`, roving `tabIndex` (одна tab-остановка на выбранном табе)
- Panel: `role="tabpanel"`, `aria-labelledby`, `hidden` когда не selected
- List: `role="tablist"`, `aria-orientation`, keyboard `Home`/`End`/arrows (без собственного `tabIndex`)
- Indicator: `aria-hidden`
- IDs: `{baseId}-tab-{value}`, `{baseId}-panel-{value}`

## Структура файлов

```
Tabs/
├── Tabs.tsx
├── index.ts
├── tabsTypes.ts
├── tabsStyles.ts
├── tabsAnimations.ts
├── tabsParts.tsx
├── useTabsRootState.ts
├── useSlidingTabIndicator.ts
├── tabsContext.tsx
├── tabsA11y.ts
└── Tabs.stories.tsx
```

## Storybook

`Core Components/Tabs` — default, vertical, variants, sizes, controlled, disabled, `CustomClassNames`.
