# Kbd

Отображение клавиш клавиатуры (`<kbd>`). Поддерживает `variant`, размеры, `Kbd.Group` с разделителем и hover-lift второго уровня (как у `Badge`).

## Импорт

```tsx
import { Kbd, type KbdProps, type KbdVariant, type KbdSize, type KbdClassNames, type KbdGroupProps, type KbdMotion, type KbdPartMotion } from "burne-ui";
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
| `hoverLift` | `true` | Hover shadow/lift (2nd level). Shorthand for `motion.root.hoverIn/Out: false` |
| `motion` | — | Карта слотов `root` / `text` |
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
| `outline` | `bg-transparent border-token-outline` |
| `secondary` | `bg-secondary border-token text-secondary-foreground` |
| `gloss` | `gloss-panel gloss-deep border-0` |

Компонент **2-го уровня** при `hoverLift={true}` (как `Badge`, `Alert`): тень в покое + усиление при hover.

## Размеры

| size | Chip pad (`--chip-px/py-*`) | Text variant |
|------|----------------------------|--------------|
| `small` | `--chip-*-small` | `xsmall` |
| `base` | `--chip-*-base` | `small` |
| `mid` | `--chip-*-mid` | `base` |
| `large` | `--chip-*-large` | `mid` |

`--chip-*` — внутренние inset-токены (общие с `Badge`), не публичный API.

Текст ключа (`Kbd.Text`) и separator группы — `leading-none`; размеры текста совпадают с `Badge` (`xsmall` → `mid`).

Общий shell: `rounded-small font-mono inline-flex items-center justify-center`.

## Анимации

Публичный slot motion. Компонент 2-го уровня: rest-тень всегда, hover-lift на `root`. Press squeeze и portal нет.

### Slot motion

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `root` | `hoverIn` / `hoverOut` | `hoverLiftSecondLevel` или `hoverLiftGloss`; `false` при `hoverLift={false}` |
| `text` | `hoverIn` / `hoverOut` | нет |

`hoverLift={false}` = `motion.root.hoverIn/Out: false` (rest-тень остаётся). Явный `motion.root.hoverIn` важнее `hoverLift`.

**Где в коде:** типы — `kbdTypes.ts`; scope — `kbdContext.tsx`; defaults + host — `kbdAnimations.ts`; `Kbd.Text` — `kbdTextPart.tsx`; Provider — `Kbd.tsx`.

```tsx
<Kbd motion={{ root: { hoverIn: false, hoverOut: false } }}>Esc</Kbd>

<Kbd>
  <Kbd.Text size="base" motion={{ hoverIn: { scale: 1.18 }, hoverOut: { scale: 1 } }}>
    Shift
  </Kbd.Text>
</Kbd>
```

### Отключение

```ts
configureMotion({ enableHoverLift: false });
```

`Kbd.Group` wrapper не анимируется. Separator — static `Text` (`aria-hidden`).

## Токены и CSS

| Класс / токен | Назначение |
|---------------|------------|
| `KBD_ROOT_BASE_CLASS` | `rounded-small font-mono isolate` |
| `shadow-token-base` + `-hover` | Через `--el-shadow` (rest всегда; hover при lift) |
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
├── kbdAnimations.ts             # defaults + host play
├── kbdParts.tsx
├── kbdTextPart.tsx              # useMotionPart
├── useKbdRootState.ts
├── kbdContext.tsx               # createMotionScope
├── kbdAPI.ts
├── kbdA11y.ts
└── Kbd.stories.tsx
```

## Storybook

`Core Components/Kbd` — variants, sizes, group, gloss, `hoverLift={false}`, `classNames`, slot motion gallery.
