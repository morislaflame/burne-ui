# Header

Полоса экрана, элемент `<header>`. `sticky` прижимает её к верху прокрутки. Это не поверхность: в покое тени нет, при наведении тень не появляется.

## Импорт

```tsx
import { Header } from "burne-ui";
```

## API

`sticky` — доменный флаг, не `variant` и не `size`. По умолчанию `false`.

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `sticky` | `false` | `sticky top-0` |
| `classNames` | — | Слот `root` |
| `motion` | — | Карта слота `root` |
| `motionController` | — | Handle на Provider, не на `<header>` |
| `motionState` | — | Режим `motion.states` |
| `motionPayload` | — | Снимок для фабрики (`ctx.payload`) |
| `playInitialState` | `false` | Играть режим на маунте |

Остальные атрибуты `<header>` проходят на корень. `className` идёт после `classNames.root`.

### `HeaderClassNames`

`root`.

## Анимации

### Slot motion

Слот `root`. Фазы `enter`, `leave`, `hoverIn`, `hoverOut`, `pressIn`, `pressOut` — opt-in. Дефолт пустой.

## MotionController

Ручка на корне. `play()` играет слот `root`. `motionState`, `motionPayload` и `playInitialState` не попадают на DOM. Смена `motionState` играет `motion.states[имя]`; то же имя ещё раз — тишина.

```tsx
const bar = useMotionControllerHandle();

<Header sticky motionController={bar}>Burne</Header>
```

## Доступность

Имя полосы — видимый текст внутри или `aria-label` на корне. Компонент не подставляет роль поверх `<header>`.

## Структура файлов

```
Header/
├── Header.tsx
├── index.ts
├── headerTypes.ts
├── headerStyles.ts
├── headerAnimations.ts
├── headerContext.tsx
└── Header.stories.tsx
```
