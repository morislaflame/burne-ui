# CloseButton

Круглая кнопка закрытия с иконкой `IoClose` (react-icons/io5). Разделяет визуальную систему variant с `Button`, поддерживает GSAP hover/press и опциональный converge-ripple.

## Импорт

```tsx
import { CloseButton } from "burne-ui";
import type {
  CloseButtonProps,
  CloseButtonVariant,
  CloseButtonSize,
  CloseButtonClassNames,
  CloseButtonMotion,
  CloseButtonPartMotion,
} from "burne-ui";
```

## API

Компонент — **simple API** (один `<button>` без children). Compound-подчастей нет.

### Props

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `variant` | `default` \| `primary` \| `outline` \| `secondary` \| `ghost` \| `gloss` | `default` | Визуальный стиль (общий с Button) |
| `size` | `small` \| `base` \| `mid` \| `large` | `base` | Размер квадратной области и иконки |
| `ripple` | `boolean` | `false` | Converge-ripple при нажатии |
| `disabled` | `boolean` | `false` | `opacity-50`, `cursor-not-allowed` |
| `aria-label` | `string` | `"Close"` (из `BurneLabels`, см. ниже) | Доступное имя; без пропа — дефолт из `BurneUIProvider` `labels` |
| `className` | `string` | — | Классы на корневой `<button>` |
| `classNames` | `CloseButtonClassNames` | — | Слоты: `root`, `icon`, `ripple` |
| `type` | `button` \| `submit` \| `reset` | `button` | Нативный type |
| … | `ButtonHTMLAttributes` (без `children`) | — | `onClick`, `onPointer*`, и т.д. |

### `CloseButtonClassNames`

```tsx
type CloseButtonClassNames = {
  root?: string;    // корневой <button>
  icon?: string;    // IoClose
  ripple?: string;  // обёртка <Ripple />
};
```

### Примеры

```tsx
// Базовая
<CloseButton onClick={onClose} />

// В шапке диалога
<CloseButton
  variant="ghost"
  size="small"
  aria-label="Закрыть диалог"
  onClick={onClose}
/>

// С ripple
<CloseButton variant="outline" ripple aria-label="Закрыть" />

// Кастомизация слотов
<CloseButton
  variant="outline"
  classNames={{
    root: "border-primary/50 bg-primary/5 shadow-token-md hover:bg-primary/10",
    icon: "text-primary",
  }}
  aria-label="Закрыть панель"
/>
```

## variant

Используется общая карта поверхностей `INTERACTIVE_VARIANT_ROOT` из `buttonStyles.ts`:

| variant | Поверхность | Hover shadow | Ripple tone |
|---------|-------------|--------------|-------------|
| `default` | `bg-surface`, `border-token` | да | `converge-ripple-neutral` |
| `primary` | `bg-primary` | да | `converge-ripple-primary-fill` |
| `outline` | прозрачный + `border-token-outline` | да | neutral; hover `bg-transparent-hover` |
| `secondary` | `bg-secondary` | да | neutral |
| `ghost` | прозрачный | да | neutral; hover `bg-transparent-hover` |
| `gloss` | `gloss-btn` | нет (gloss-motion) | neutral |

У CloseButton **нет** prop `status` — только variant.

## Размеры

| size | Корень | Иконка |
|------|--------|--------|
| `small` | `h-control-xsmall w-control-xsmall` | `icon-small` |
| `base` | `h-control-small w-control-small` | `icon-base` |
| `mid` | `h-control-base w-control-base` | `icon-mid` |
| `large` | `h-control-mid w-control-mid` | `icon-large` |

Форма всегда `rounded-full`.

## Анимации

Публичный slot motion. Свой scope: Root — Provider с defaults + params + `useCloseButtonAnimations`. Ripple остаётся kit-internal.

### Slot motion

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `root` | `hoverIn` / `hoverOut` / `pressIn` / `pressOut` | first-level lift + squeeze; gloss → `hoverLiftGloss` / `pressSqueezeGloss` (`pressOut: false`) |
| `icon` | hover/press | нет |

`false` на фазе — skip без kill.

**Где в коде:** типы — `closeButtonTypes.ts`; scope — `closeButtonContext.tsx`; defaults + host — `closeButtonAnimations.ts`; слот `icon` — `closeButtonParts.tsx`; Provider — `CloseButton.tsx`.

```tsx
<CloseButton aria-label="Close" motion={{ root: { hoverIn: false, hoverOut: false } }} />
```

## Токены и CSS-классы

### Цветовые токены (ripple)

| variant | Токен |
|---------|-------|
| `default`, `outline`, `secondary`, `ghost`, `gloss` | `converge-ripple-neutral` |
| `primary` | `converge-ripple-primary-fill` |

### Поверхность и motion

- База: `INTERACTIVE_VARIANT_ROOT[variant]` (из Button)
- Hover: `hoverVariant(CLOSE_BUTTON_HOVER_VARIANT[variant])`
- Focus: `focus-ring` (цвет `--color-focus-ring`, ширина/offset — `--focus-ring-width` / `--focus-ring-offset`)
- Disabled: `opacity-50`, `cursor-not-allowed`

### Размерные токены

`h-control-*`, `w-control-*` (квадрат), `icon-small` / `icon-base` / `icon-mid` / `icon-large`.

## Стилизация и кастомизация

CloseButton — leaf-компонент (без compound/simple split): один `<button>` с иконкой.

### Два уровня

1. **`className`** — доп. классы на root (мерж после базовых).
2. **`classNames`** — `root`, `icon`, `ripple` через `CloseButtonClassNamesProvider`.

### Слоты `CloseButtonClassNames`

| Слот | DOM / элемент | Когда использовать |
|------|---------------|-------------------|
| `root` | `<button>` | Фон, ring, размер hit-area (`rounded-full`) |
| `icon` | `IoClose` | Цвет, размер иконки |
| `ripple` | Ripple overlay | Opacity, clip shape |

```tsx
<CloseButton
  variant="ghost"
  size="mid"
  className="ring-2 ring-primary/20"
  classNames={{
    root: "bg-surface-elevated",
    icon: "text-muted",
    ripple: "opacity-80",
  }}
  aria-label="Закрыть диалог"
/>
```

`variant`, `size` — surface и `toggleBox` из токенов. В Dialog/Drawer слот `close` прокидывает стили в CloseButton.

### Отключение анимаций

```ts
configureMotion({ enableAnimations: false });
// или точечно:
configureMotion({ enableHoverLift: false, enablePressSqueeze: false });
```

Локального пропа `animated` нет.

### Практические заметки

- **aria-label:** без пропа — `"Close"` из `DEFAULT_BURNE_LABELS` (или `labels` на `BurneUIProvider`, напр. `BURNE_LABELS_RU`). Явный `aria-label` побеждает. В UI лучше уточнять контекст: «Закрыть диалог».
- **Порядок мержа:** `closeButtonRootClass` → `classNames.root` → `className`.

## Доступность

- Только иконка — **всегда** есть accessible name: дефолт из `BurneLabels.close` или ваш `aria-label`.
- Иконка `IoClose` — `aria-hidden`.
- Нативный `disabled` на `<button>`.
- Focus ring: `outline-none` + `focus-ring`.

## Отличия от Button

| | Button | CloseButton |
|---|--------|-------------|
| Children | текст / иконка | нет (`IoClose` внутри) |
| `status` | да | нет |
| Async states | да | нет |
| `icon` / `iconOnly` | да | нет (всегда icon-only) |
| `classNames` | нет | `root`, `icon`, `ripple` |
| Форма | `rounded-base` (или segment) | `rounded-full` |
| Размерная сетка | `minWButton`, padding | `toggleBox` (квадрат) |

## Структура файлов компонента

```
CloseButton/
├── CloseButton.tsx
├── index.ts
├── closeButtonTypes.ts
├── closeButtonStyles.ts
├── closeButtonA11y.ts         # resolve aria-label (+ BurneLabels.close)
├── closeButtonContext.tsx     # classNames provider
├── closeButtonParts.tsx       # Icon, Ripple
├── closeButtonAnimations.ts
├── useCloseButtonRootState.ts
└── CloseButton.stories.tsx
```

## Storybook

`Core Components/CloseButton` — размеры, варианты, матрица variant×size, ripple, кастомизация `classNames`, светлая/тёмная тема.
