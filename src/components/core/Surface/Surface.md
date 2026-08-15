# Surface

Базовая панель с токенами темы: заливка, optional shadow, padding, radius. Примитив для секций и меню — без compound API `Card`. `variant="gloss"` — стеклянная CSS-панель (`gloss-panel`).

## Импорт

```tsx
import { Surface, type SurfaceProps, type SurfaceVariant, type SurfaceShadow, type SurfacePadding, type SurfaceRadius } from "burne-ui";
```

## API

### Базовое использование

```tsx
<Surface variant="default" shadow="mid" padding="mid" radius="mid">
  <Text variant="base">Контент панели</Text>
</Surface>

<Surface variant="gloss" padding="mid" radius="large" className="w-56">
  <Text variant="base" className="font-medium">Gloss panel</Text>
</Surface>
```

Compound API нет.

### Props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `variant` | `default` | `default` \| `secondary` \| `tertiary` \| `gloss` |
| `shadow` | `none` | `none` \| `small` \| `base` \| `mid` \| `large` |
| `padding` | `none` | `none` \| `small` \| `base` \| `mid` \| `large` |
| `radius` | `mid` | `base` \| `mid` \| `large` |
| `className` | — | Дополнительные классы |
| HTML props | — | На root `<div>` |

## Variant / токены

### Variant (fill)

| Variant | CSS |
|---------|-----|
| `default` | `bg-surface` |
| `secondary` | `bg-secondary` |
| `tertiary` | `bg-tertiary` |
| `gloss` | `gloss-panel` + inner `gloss-content` |

Без border по умолчанию (в отличие от `Card`).

### Shadow

`shadow-token-small` / `base` / `mid` / `large` или пусто при `none`.

### Padding

`p-small`, `p-base`, `p-mid`, `p-large`.

### Radius

`rounded-base`, `rounded-mid`, `rounded-large`.

### Сравнение с `Card`

| | `Surface` | `Card` |
|---|-----------|--------|
| Border | нет по умолчанию | `border-token` |
| Header/Body/Footer | нет | compound слоты |
| Shadow hover | нет | pressable lift |
| `classNames` | да (`root`, `glossContent`) | да |
| Pressable | нет | `pressable` prop |

## Анимации

### Slot motion

| Слоты | Фазы | Дефолт |
|-------|------|--------|
| `root` | `enter` / hover / press (opt-in) | empty |

`glossContent` не публичный слот.

`false` на фазе — skip без kill и без смены визуала. Не анимируйте layout (`width` / `height` / `top` / `left` / `margin`) в публичных MotionVars. Кастомный `motion` — opt-in: без пропа дефолтный вид не меняется.


Без пропа `motion` hover/press GSAP не играет — пассивный layout primitive плюс opt-in slot motion.

**DOM (default):**

```
<div class="bg-surface shadow-token-md p-mid rounded-mid">
  children
</div>
```

**DOM (gloss):**

```
<div class="gloss-panel" ref=glossRef>
  <div class="gloss-content">
    children
  </div>
</div>
```

### 1. Gloss ref binding

`variant="gloss"` → `useMergedGlossPanelRef(ref, true)`:

- Подготавливает gloss panel DOM ref для потенциальных gloss utilities
- **Без** встроенных `onPointerOver` / squeeze handlers
- Пассивная стеклянная панель — depth только из CSS (`gloss-panel`, conic border)

### 2. Shadow / padding / radius

Чистый CSS через props — **не анимируются** при смене prop (instant re-render).

`shadow="small"|"base"|"mid"|"large"` → `shadow-token-*` классы.

### Чего нет

- Hover lift / press squeeze
- Portal motion
- Ripple
- `classNames` API (`root`, `glossContent`)
- Persistent shadow animation (`--el-shadow` GSAP)

Для интерактивного gloss hover: `Card pressable`, `Button`, `Popover`, `Kbd`.

### Сводка: что настраивается где

| Поведение | Механизм | Ключи `configureMotion` | Локальный prop |
|-----------|----------|---------------------------|----------------|
| Fill / radius / padding | CSS props | — | `variant`, `padding`, `radius` |
| Static shadow | CSS class | — | `shadow` |
| Gloss ref init | `useMergedGlossPanelRef` | — | `variant="gloss"` |
| Interactive rows | manual `hoverVariant()` на children | — | pattern в stories |

## Токены и CSS

| Prop / класс | CSS |
|--------------|-----|
| `variant="default"` | `bg-surface` |
| `variant="secondary"` | `bg-secondary` |
| `variant="tertiary"` | `bg-tertiary` |
| `variant="gloss"` | `gloss-panel` + inner `gloss-content` |
| `shadow="small"` | `shadow-token-small` |
| `padding="mid"` | `p-mid` |
| `padding="large"` | `p-large` |
| `radius="mid"` | `rounded-mid` |
| `hoverVariant()` | Для интерактивных children (не на Surface root) |

## Стилизация и кастомизация

### Один уровень

Только **`className`** + props `variant` / `shadow` / `padding` / `radius`.

### `SurfaceClassNames`

`root`, `glossContent`.

`className` мержится в `root`. При `variant="gloss"` внутренний wrapper — слот `glossContent`.

### Базовые панели

```tsx
<Surface variant="default" shadow="mid" padding="mid" radius="mid" className="w-full max-w-sm">
  <Text variant="base">Контент панели</Text>
</Surface>

<Surface variant="gloss" padding="mid" radius="large" className="w-56">
  <Text variant="base" className="font-medium">Gloss panel</Text>
</Surface>
```

### Вложенные surface (nested panels)

```tsx
<Surface padding="mid" shadow="small" className="max-w-sm">
  <Text variant="base" className="font-medium">Outer</Text>
  <Surface variant="tertiary" padding="small" radius="base" className="mt-small">
    <Text variant="small" className="text-muted">Inner panel</Text>
  </Surface>
</Surface>
```

### Интерактивный список (паттерн из stories)

Hover на **children**, не на Surface root:

```tsx
<Surface variant="default" shadow="mid" padding="small" className="w-64">
  <ul className="m-0 flex list-none flex-col gap-xsmall p-0">
    {items.map((item) => (
      <li key={item.id}>
        <button
          type="button"
          className={cn(
            "w-full rounded-base px-small py-xsmall text-left",
            hoverVariant(),
          )}
        >
          {item.label}
        </button>
      </li>
    ))}
  </ul>
</Surface>
```

Для press squeeze на строках — оберните в `Button` или добавьте `usePressableElementTextMotion`.

### Когда `Surface` vs `Card`

- **`Surface`** — нейтральный контейнер, sidebar chunk, menu backdrop, nested panel.
- **`Card`** — карточка с заголовком, footer, optional pressable + ripple.

### Практические заметки

- `shadow` не усиливается на hover — для lift используйте `Card pressable` или `Button`.
- Gloss — проверяйте на light/dark theme (conic border + blur).
- `padding="none"` + свой spacing в children для плотных меню.
- `className` на gloss попадает на внешний `gloss-panel`.
- **Не ожидайте motion от смены `shadow` prop** — это static CSS class.

## Интеграции

| Компонент | Отличие |
|-----------|---------|
| `Card` | Border, header/body/footer, pressable, static shadow |
| `Popover` / `Dropdown` | Floating portal panels |
| `Badge` | Статус поверх surface/card |

## Доступность

Компонент не добавляет ARIA. Используйте семантические children (`nav`, `button`, headings). Для чисто декоративных панелей role не требуется.

## Структура файлов

```
Surface/
├── Surface.tsx
├── index.ts
└── Surface.stories.tsx
```

## Storybook

`Core Components/Surface` — variants, shadows, padding/radius, nested panels, gloss, light theme, interactive list pattern.
