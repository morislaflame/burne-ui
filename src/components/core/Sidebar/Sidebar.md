# Sidebar

Боковая колонка, элемент `<aside>`. Ширина из `--max-page-*` (`w-page-*`). Это не поверхность: в покое тени нет.

## Импорт

```tsx
import { Sidebar } from "burne-ui";
```

## API

`width` — доменная шкала страницы, не `ComponentSize` и не `--max-component-*`. `side` — край колонки, не `variant`.

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `width` | `small` | `xsmall` \| `small` \| `base` \| `mid` \| `large` \| `xlarge` \| `2xlarge` |
| `side` | `start` | `start` рисует `border-e-token`, `end` — `border-s-token` |
| `classNames` | — | Слот `root` |
| `motion` | — | Карта слота `root` |
| `motionController` | — | Handle на Provider, не на `<aside>` |
| `motionState` | — | Режим `motion.states` |
| `motionPayload` | — | Снимок для фабрики (`ctx.payload`) |
| `playInitialState` | `false` | Играть режим на маунте |

Каждая колонка задаёт свой `side`. В `AppShell` колонки с `side="end"` встают после `main`, остальные — до него.

### `SidebarClassNames`

`root`.

## data-*

`data-side` — `start` \| `end`. Атрибут ставится после `{...rest}`.

## Анимации

### Slot motion

Слот `root`. Фазы `enter`, `leave`, `hoverIn`, `hoverOut`, `pressIn`, `pressOut` — opt-in. Дефолт пустой.

## MotionController

Ручка на корне. `play()` играет слот `root`. `motionState`, `motionPayload` и `playInitialState` не попадают на DOM.

```tsx
const nav = useMotionControllerHandle();

<Sidebar width="small" side="start" motionController={nav} aria-label="Разделы" />
```

## Доступность

`<aside>` требует имя: `aria-label` или `aria-labelledby`. В development без одного из них Sidebar пишет ошибку в консоль.

## Структура файлов

```
Sidebar/
├── Sidebar.tsx
├── index.ts
├── sidebarTypes.ts
├── sidebarStyles.ts
├── sidebarAnimations.ts
├── sidebarContext.tsx
└── Sidebar.stories.tsx
```
