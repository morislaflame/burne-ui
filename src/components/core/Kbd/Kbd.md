# Kbd

Отображение клавиш клавиатуры (`<kbd>`). Поддерживает `variant`, размеры, `Kbd.Group` с разделителем и hover-lift второго уровня (как у `Badge`).

## Импорт

```tsx
import { Kbd, type KbdProps, type KbdVariant, type KbdSize, type KbdClassNames, type KbdGroupProps } from "burne-ui";
```

## API

### Базовое использование

```tsx
<Kbd>⌘</Kbd>
<Kbd variant="outline" size="base">Enter</Kbd>
```

### Группа клавиш

```tsx
<Kbd.Group separator="+">
  <Kbd>Ctrl</Kbd>
  <Kbd>K</Kbd>
</Kbd.Group>

<Kbd.Group separator={null}>
  <Kbd>⌘</Kbd>
  <Kbd>⇧</Kbd>
  <Kbd>P</Kbd>
</Kbd.Group>
```

Compound API только через `Kbd.Group` — root leaf-компонент.

### Props (`Kbd`)

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `variant` | `default` | `default` \| `primary` \| `outline` \| `secondary` \| `gloss` |
| `size` | `base` | `small` \| `base` \| `mid` \| `large` |
| `hoverLift` | `true` | Hover shadow/lift (2nd level) |
| `className` | — | На `<kbd>` |
| `classNames` | — | `root`, `text`, `group`, `separator` |

### `Kbd.Group` props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `separator` | `"+"` | Между keys; `null` — скрыть |
| `classNames` | — | `group`, `separator` (override) |

### `KbdClassNames`

`root`, `text`, `group`, `separator`.

`separator` — слот для prop `separator` в `Kbd.Group` (compound-части `Separator` нет).

## variant

| variant | Стили корня |
|---------|-------------|
| `default` | `bg-surface border-token text-foreground` |
| `primary` | `bg-primary border-transparent text-primary-foreground` |
| `outline` | `bg-transparent border-token` |
| `secondary` | `bg-secondary border-token text-secondary-foreground` |
| `gloss` | `gloss-panel gloss-deep border-0` |

Компонент **2-го уровня** при `hoverLift={true}` (как `Badge`, `Alert`): тень в покое + усиление при hover.

## Размеры

| size | layout (`KBD_LAYOUT`) | Text variant |
|------|------------------------|--------------|
| `small` | `min-h-4 px-xsmall py-0.5` | `xsmall` |
| `base` | `min-h-4 px-small py-xsmall` | `xsmall` |
| `mid` | `min-h-5 px-base py-xsmall` | `small` |
| `large` | `min-h-5 px-base py-xsmall` | `small` |

Общий shell: `rounded-small font-mono inline-flex items-center justify-center`.

## Анимации

`kbdAnimations.ts` → `useKbdAnimations`. Только hover motion — **нет** press squeeze и portal.

**DOM:**

```
<kbd ref=rootRef>              ← motion target, pointer handlers
  <Text inheritColor>Esc</Text>
</kbd>
```

### 1. Hover lift — default / primary / outline / secondary

`useSecondLevelShadow(rootRef, hoverLift && !isGloss)`:

**Init (mount):** `initElementShadow(el, shadowSm())` — покой `--el-shadow: var(--shadow-sm)`.

**Pointer enter:**

1. `animateInteractiveHoverLift(el, true, …, secondLevelShadow())`
2. Scale ~`hoverLiftScale`, тень `sm` → `md`

**Pointer leave:** scale `1`, тень обратно `sm`.

Класс: `SHADOW_LIFT_MOTION_CLASS` (`animate-shadow will-change-transform`).

**Локально:** `hoverLift={false}` — без handlers и `motionClass`.

**Reduced motion / touch:** `shouldSkipInteractiveHoverLift()` — тень остаётся `sm`, без scale.

#### Кастомизация

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  hoverLiftScale: 1.025,
  hoverLiftEase: "sine.inOut",
  interactiveDuration: 280,
  enableHoverLift: true,
});
```

### 2. Gloss variant (`variant="gloss"`)

Вместо shadow lift:

- `createGlossInteractiveRefCallback(rootRef, hoverLift && isGloss)`
- `useGlossInteractiveHandlers` на `onPointerOver` / `onPointerOut`
- Класс: `GLOSS_INTERACTIVE_MOTION_CLASS` + `glossInteractive.css`

Gloss lift — отдельная кривая, не sm→md shadow tokens.

### 3. `Kbd.Group`

Group wrapper **не** анимируется. Separator — static `Text` (`aria-hidden`).

### Чего нет

- Press squeeze (Kbd не pressable)
- Ripple
- Selection/fill animations

### Сводка: что настраивается где

| Анимация | Утилита | Ключи `configureMotion` | Локальный prop |
|----------|---------|---------------------------|----------------|
| Shadow sm→md + lift | `useSecondLevelShadow` | `hoverLiftScale`, `enableHoverLift`, `interactiveDuration` | `hoverLift` |
| Gloss hover | `useGlossInteractiveHandlers` | interactive-токены | `variant="gloss"` |
| Постоянная тень покоя | `initElementShadow` + `shadowSm()` | — | `hoverLift={true}` |

## Токены и CSS

| Класс / токен | Назначение |
|---------------|------------|
| `KBD_ROOT_BASE_CLASS` | `rounded-small font-mono isolate` |
| `shadow-token-sm` / `md` | Через `--el-shadow` при hover lift |
| `gloss-panel gloss-deep` | Gloss keycap surface |
| `KBD_GROUP_SEPARATOR_CLASS` | `text-muted text-xsmall` |
| `motion-reduce:transition-none` | На root |

## Стилизация и кастомизация

### Два уровня

1. **`className` на `Kbd`** — мерж в root (`kbdRootClass` + surface + size).
2. **`classNames.root`** — слот поверх variant surface.

`Kbd.Group`: `className` на group span + `classNames.group` / `separator`.
`Kbd.Text`: слот `text` (и `className` на части).

### Слоты `KbdClassNames`

| Слот | DOM | Когда использовать |
|------|-----|-------------------|
| `root` | `<kbd>` | Surface / padding |
| `text` | `Kbd.Text` | Typography label inside key |
| `group` | `Kbd.Group` span | Gap, alignment shortcut row |
| `separator` | Prop `separator` in Group | Color/size between keys (без compound-части) |

`variant`, `size` — surface и padding из токенов. `hoverLift={false}` отключает только motion.

### Одиночная клавиша

```tsx
<Kbd
  variant="outline"
  size="base"
  classNames={{
    root: "border-primary/40 bg-primary/5 shadow-none",
  }}
>
  /
</Kbd>
```

### Shortcut row (compound group)

```tsx
<Kbd.Group
  separator="+"
  classNames={{
    group: "gap-small",
    separator: "text-primary/60",
  }}
>
  <Kbd variant="default" classNames={{ root: "min-w-[2rem]" }}>
    ⌘
  </Kbd>
  <Kbd variant="default">K</Kbd>
</Kbd.Group>
```

Рядом с action:

```tsx
<Button size="base">
  Сохранить <Kbd hoverLift={false} size="small" className="ml-small">⌘S</Kbd>
</Button>
```

### Практические заметки

- **`hoverLift={false}`** — для kbd внутри кнопок/статичных подсказок (не конкурирует с hover кнопки).
- **Не задавайте `transform` на root при `hoverLift`** — конфликт с GSAP lift.
- **Gloss:** не переопределяйте `gloss-deep` без нужды — depth от CSS.
- **Separator `null`:** плотные shortcut chips без `+`.
- **Порядок мержа:** `KBD_ROOT_BASE_CLASS` → variant surface → size → motionClass → `classNames.root` → `className`.

## Интеграции

| Контекст | Пример |
|----------|--------|
| Tooltips / docs | Shortcut hints |
| `Button` labels | «Save ⌘S» рядом с action |

## Доступность

- Семантический `<kbd>` для клавиш
- Group separator: `aria-hidden`
- Не полагайтесь только на символы — дублируйте текстом при необходимости

## Структура файлов

```
Kbd/
├── Kbd.tsx
├── index.ts
├── kbdTypes.ts
├── kbdStyles.ts
├── kbdAnimations.ts
├── kbdParts.tsx
├── useKbdRootState.ts
├── kbdContext.tsx
├── kbdAPI.ts
├── kbdA11y.ts
└── Kbd.stories.tsx
```

## Storybook

`Core Components/Kbd` — variants, sizes, group, gloss, `hoverLift={false}`, `classNames`.
