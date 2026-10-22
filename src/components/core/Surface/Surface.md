# Surface

Базовая панель с токенами темы: заливка, optional shadow, padding, radius. Примитив для секций и меню — без compound API `Card`.

Стекло — пакет `burne-ui-skin-gloss`, не вариант кита. Подключение и классы — [docs/SKINS.md](../../../../docs/SKINS.md).

## Импорт

```tsx
import { Surface, type SurfaceProps, type SurfaceVariant, type SurfaceShadow, type SurfacePadding, type SurfaceRadius } from "burne-ui";
```

## API

### Базовое использование

```tsx
<Surface variant="default" shadow="mid" padding="mid" radius="mid">
  <Text textStyle="base">Контент панели</Text>
</Surface>
```

Compound API нет.

### Props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `variant` | `default` | `default` \| `secondary` \| `tertiary` |
| `shadow` | `none` | `none` \| `small` \| `base` \| `mid` \| `large` |
| `padding` | `none` | `none` \| `small` \| `base` \| `mid` \| `large` |
| `radius` | `mid` | `base` \| `mid` \| `large` |
| `className` | — | Дополнительные классы |
| `motion` | — | Карта слота `root`. Ключ `events` — app-команды для `MotionController` |
| `motionController` | — | Handle: `play` / `playSlot` / `playAll` / `set` / `cancel` |
| HTML props | — | На root `<div>` |

## Variant / токены

### Variant (fill)

| Variant | CSS |
|---------|-----|
| `default` | `bg-surface` |
| `secondary` | `bg-secondary` |
| `tertiary` | `bg-tertiary` |

`tertiary` — **доменное исключение** `variant`: третий уровень поверхности (`bg-tertiary`), не канонический fill `default | outline | secondary`.

Слой скина для `surface.root` монтирует `SkinShell` на корне (`wrapper` / `before` / `content`). `variant="default"` слои не рисует.

Без border по умолчанию (в отличие от `Card`).

### Shadow

`shadow-token-small` / `base` / `mid` / `large` или пусто при `none`.

### Padding

`p-small`, `p-base`, `p-mid`, `p-large`.

### Radius

`rounded-base`, `rounded-large`, `rounded-large`.

### Сравнение с `Card`

| | `Surface` | `Card` |
|---|-----------|--------|
| Border | нет по умолчанию | `border-token` |
| Header/Body/Footer | нет | compound слоты |
| Shadow hover | нет | pressable lift |
| `classNames` | да (`root`) | да |
| Pressable | нет | `pressable` prop |

## Анимации

### Slot motion

| Слоты | Фазы | Дефолт |
|-------|------|--------|
| `root` | `enter` / hover / press (opt-in) | empty |

Spotlight через CSS-переменные `--spot-x` / `--spot-y` (`quickTo`, не tween `background`) — слайд **Spotlight** в галерее Slot motion.

`false` на фазе — skip без kill и без смены визуала. Не анимируйте layout (`width` / `height` / `top` / `left` / `margin`) в публичных MotionVars. Кастомный `motion` — opt-in: без пропа дефолтный вид не меняется.

Проп `motionController` + ключ `events` на `motion` — app-команды (`panel:ping`), не фазы. `createMotionEvents`. `play` / `playAll` принимают `MotionPlayEvent`. См. [Motion](/docs/motion-events).

```tsx
import { Surface, Button, createMotionEvents, useMotionControllerHandle } from "burne-ui";

const events = createMotionEvents({
  "panel:ping": { y: -8, duration: 0.16, yoyo: true, repeat: 1 },
});

function Ping() {
  const controller = useMotionControllerHandle();
  return (
    <Surface padding="mid" motionController={controller} motion={{ events }}>
      Panel
    </Surface>
  );
}
```

Сложенный `ctx.timeline()` (lift → scale → rest), `waitForComplete` bounce и `cancel()` лупа — playground / Storybook **MotionController**.

Тройка на корне, тот же scope. `motionState`, `motionPayload` и `playInitialState` не попадают на DOM. Смена `motionState` играет `motion.states[имя]`; то же имя ещё раз — тишина. `motionPayload` — снимок для фабрики (`ctx.payload`, `createMotionFactory`); без смены режима не переигрывает. `playInitialState` по умолчанию выключен: на маунте режим не играет.

Без пропа `motion` hover/press GSAP не играет — пассивный layout primitive плюс opt-in slot motion.

**DOM (default):**

```
<div class="bg-surface shadow-token-md p-mid rounded-large">
  children
</div>
```

### 2. Shadow / padding / radius

Чистый CSS через props — **не анимируются** при смене prop (instant re-render).

`shadow="small"|"base"|"mid"|"large"` → `shadow-token-*` классы.

### Чего нет

- Дефолтный hover lift / press squeeze (opt-in `motion.root`)
- Portal motion
- Ripple
- Persistent shadow animation (`--el-shadow` GSAP)

### Сводка: что настраивается где

| Поведение | Механизм | Ключи `configureMotion` | Локальный prop |
|-----------|----------|---------------------------|----------------|
| Fill / radius / padding | CSS props | — | `variant`, `padding`, `radius` |
| Static shadow | CSS class | — | `shadow` |
| Interactive rows | manual `hoverVariant()` на children | — | pattern в stories |

## Токены и CSS

| Prop / класс | CSS |
|--------------|-----|
| `variant="default"` | `bg-surface` |
| `variant="secondary"` | `bg-secondary` |
| `variant="tertiary"` | `bg-tertiary` |
| `shadow="small"` | `shadow-token-small` |
| `padding="mid"` | `p-mid` |
| `padding="large"` | `p-large` |
| `radius="mid"` | `rounded-large` |
| `hoverVariant()` | Для интерактивных children (не на Surface root) |

## Стилизация и кастомизация

### Один уровень

Только **`className`** + props `variant` / `shadow` / `padding` / `radius`.

### `SurfaceClassNames`

`root`.

`className` мержится в `root`.

### Базовые панели

```tsx
<Surface variant="default" shadow="mid" padding="mid" radius="mid" className="w-full max-w-sm">
  <Text textStyle="base">Контент панели</Text>
</Surface>
```

### Вложенные surface (nested panels)

```tsx
<Surface padding="mid" shadow="small" className="max-w-sm">
  <Text textStyle="base" className="font-medium">Outer</Text>
  <Surface variant="tertiary" padding="small" radius="base" className="mt-small">
    <Text textStyle="small" className="text-muted">Inner panel</Text>
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
- `padding="none"` + свой spacing в children для плотных меню.
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

`Core Components/Surface` — variants, shadows, padding/radius, nested panels, light theme, interactive list pattern.
