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
| `outline` | прозрачный + `border-token` | да | neutral |
| `secondary` | `bg-secondary` | да | neutral |
| `ghost` | прозрачный | да | neutral |
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

Все motion — **GSAP**. Тонкая обёртка: `closeButtonAnimations.ts` → `useFirstLevelInteractiveMotion` (тот же хук, что у `Button`).

**DOM-структура:**

```
<button>                    ← motion target (всегда корень, не contentRef)
  <Ripple />                ← опционально, rounded-full clip
  <IoClose />               ← z-[1], иконка
```

У CloseButton **нет** async-слоёв, expand ring и `groupSegment`.

### 1. Hover lift + press squeeze

Идентичная модель Button (1-й уровень), но `useContentRef: false` всегда.

**Pointer enter:**

- `animateInteractiveHoverLift` на корне `<button>`
- Тень при variant ∈ `CLOSE_BUTTON_HAS_HOVER_SHADOW` (все кроме gloss): `firstLevelHoverShadow()` — hover `--shadow-sm`
- Адаптивный scale от размера квадрата (`hoverLiftScale` cap)

**Pointer down:**

- `animateInteractivePressSqueeze` — adaptive squeeze ~2.4px, cap `pressSqueezeScale[1]`
- Release → restore hover, если pointer inside

**Pointer leave:** scale `1`, сброс `--el-shadow`.

**Gloss:** `animateGlossInteractiveHoverLift` / `PressSqueeze`, без shadow lift.

#### Кастомизация

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  interactiveDuration: 280,
  hoverLiftScale: 1.025,
  hoverLiftEase: "sine.inOut",
  pressSqueezeScale: [1, 0.98, 1],
  enableHoverLift: true,
  enablePressSqueeze: true,
});
```

**Глобально:** `enableAnimations: false`.

**Reduced motion / touch:** `shouldSkipInteractiveHoverLift()` — без lift и squeeze.

### 2. Converge ripple (`ripple={true}`)

`<CloseButtonRipple>` → `<Ripple color={convergeBg} className="rounded-full" />`.

**Анимация:** см. Ripple.md — `ConvergeRippleDot`, default `direction="out"`.

| variant | Тон |
|---------|-----|
| `primary` | `converge-ripple-primary-fill` |
| остальные | `converge-ripple-neutral` |

```ts
configureMotion({
  rippleDefaultDuration: 700,
  rippleDefaultOpacityFrom: 0.42,
  enableRipple: true,
});
```

Проп `duration` на Ripple переопределяет глобальную длительность. Отключено при `disabled`.

### Сводка: что настраивается где

| Анимация | Утилита | Ключи `configureMotion` | Локальный prop |
|----------|---------|---------------------------|----------------|
| Hover lift | `useFirstLevelInteractiveMotion` | `hoverLiftScale`, `enableHoverLift` | — |
| Press squeeze | `animateInteractivePressSqueeze` | `pressSqueezeScale`, `enablePressSqueeze` | — |
| Ripple | `<Ripple />` | `rippleDefaultDuration`, `enableRipple` | `ripple` |
| Gloss | `glossInteractiveMotion` | interactive-токены | `variant="gloss"` |

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
