# AppShell

Раскладывает прямых потомков `Header` и `Sidebar`. Остальное уходит в `<main>`. Это не поверхность.

## Импорт

```tsx
import { AppShell, Header, Sidebar } from "burne-ui";
```

## API

Части `AppShell.Header` нет: в оболочку кладутся сами `Header` и `Sidebar`. Сторону задаёт `Sidebar.side`.

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `classNames` | — | Слоты `root`, `body`, `main` |
| `motion` | — | Карта этих слотов |
| `motionController` | — | Handle на Provider, не на корневой `div` |
| `motionState` | — | Режим `motion.states` |
| `motionPayload` | — | Снимок для фабрики (`ctx.payload`) |
| `playInitialState` | `false` | Играть режим на маунте |

Прямой потомок с `displayName` `Header` встаёт над рядом. `Sidebar` с `side="end"` встаёт после `main`, остальные колонки — до `main`. Любой другой ребёнок попадает в `main`.

### `AppShellClassNames`

`root`, `body`, `main`.

`body` — ряд под шапкой.

## Анимации

### Slot motion

Слоты `root`, `body`, `main`. Фазы `enter`, `leave`, `hoverIn`, `hoverOut`, `pressIn`, `pressOut` — opt-in. Дефолт пустой.

## MotionController

Один handle на оболочку. `play()` играет `root`. `body` и `main` — `playSlot`. `motionState`, `motionPayload` и `playInitialState` не попадают на DOM.

```tsx
const shell = useMotionControllerHandle();

<AppShell motionController={shell}>
  <Header>Burne</Header>
  <Sidebar aria-label="Разделы" />
  <Sidebar side="end" aria-label="Свойства" />
  <p>Содержание</p>
</AppShell>
```

## Доступность

`<main>` не получает имя от оболочки. Имя шапки и колонок задают `Header` и `Sidebar`.

## Структура файлов

```
AppShell/
├── AppShell.tsx
├── index.ts
├── appShellTypes.ts
├── appShellStyles.ts
├── appShellAnimations.ts
├── appShellContext.tsx
└── AppShell.stories.tsx
```
