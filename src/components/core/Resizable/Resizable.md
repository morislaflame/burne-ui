# Resizable

Две или больше панелей и разделитель. Жест и клавиатура меняют долю. Это не поверхность.

## Импорт

```tsx
import { Resizable } from "burne-ui";
```

## API

`orientation` — ось деления, не `variant`. Доля панели — процент раскладки, не MotionVar.

### Корень

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `orientation` | `horizontal` | `horizontal` \| `vertical` |
| `classNames` | — | Слоты `root`, `panel`, `handle` |
| `motion` | — | Карта этих слотов |
| `motionController` | — | Handle на Provider, не на корневой `div` |
| `motionState` | — | Режим `motion.states` |
| `motionPayload` | — | Снимок для фабрики (`ctx.payload`) |
| `playInitialState` | `false` | Играть режим на маунте |

### `Resizable.Panel`

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `defaultSize` | — | Стартовая доля в процентах. Панель без неё делит остаток, пока её не потянули |
| `minSize` | `8` | Нижняя доля в процентах. Смена минимума не затирает размер, который уже выбрал пользователь |
| `motion` | — | Фазы слота `panel` |

Повторный `defaultSize` для того же id не переписывает долю. `flex-basis` считает процент от длины без ручек: `calc` вычитает число ручек, умноженное на `--space-small`.

### `Resizable.Handle`

Стоит между двумя панелями. `motion` — фазы слота `handle`.

### `ResizableClassNames`

`root`, `panel`, `handle`.

## Клавиатура

Ручка в tab sequence (`tabIndex={0}`).

| Клавиша | Горизонталь | Вертикаль |
|---------|-------------|-----------|
| Стрелка вперёд | ArrowRight, в RTL ArrowLeft | ArrowDown |
| Стрелка назад | ArrowLeft, в RTL ArrowRight | ArrowUp |
| Home | Левая панель к своему `minSize` | Верхняя панель к своему `minSize` |
| End | Левая панель к `100 − minSize` правой | Верхняя панель к `100 − minSize` нижней |

Шаг стрелки — 2 процента. Жест мыши и касания пишет ту же долю. `pointercancel` и потеря захвата заканчивают жест.

## data-*

На корне `data-orientation` — `horizontal` \| `vertical`. На панели `data-value` — проп `id`. Если `id` не задан, кит ставит свой идентификатор без двоеточий `useId`. Ручка находит соседей по этому значению. Атрибуты кита стоят после `{...rest}`.

## Анимации

### Slot motion

Слоты `root`, `panel`, `handle`. Фазы `enter`, `leave`, `hoverIn`, `hoverOut`, `pressIn`, `pressOut` — opt-in. Дефолт пустой. Изменение доли не идёт через GSAP.

## MotionController

Ручка на корне. `play()` играет `root`. Панели и ручки — повторные слоты: `playSlot("panel")` и `ctx.getTargets("panel")`. `motionState`, `motionPayload` и `playInitialState` не попадают на DOM.

```tsx
const split = useMotionControllerHandle();

<Resizable orientation="horizontal" motionController={split}>
  <Resizable.Panel defaultSize={30} minSize={12} />
  <Resizable.Handle />
  <Resizable.Panel />
</Resizable>
```

## Доступность

Ручка — `role="separator"`. `aria-orientation` перпендикулярен оси деления: горизонтальный ряд получает `vertical`. `aria-valuemin` и `aria-valuemax` берутся из минимумов соседних панелей, `aria-valuenow` — текущая доля, `aria-controls` перечисляет id панелей. Имя — `BurneLabels.resizePanels` («Изменить размер панелей» / «Resize panels»).

## Структура файлов

```
Resizable/
├── Resizable.tsx
├── index.ts
├── resizableTypes.ts
├── resizableStyles.ts
├── resizableAnimations.ts
├── resizableContext.tsx
├── resizableParts.tsx
└── Resizable.stories.tsx
```
