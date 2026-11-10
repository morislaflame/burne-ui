# AspectRatio

Прямоугольник с фиксированным отношением сторон. Содержимое заполняет его. Это не поверхность.

## Импорт

```tsx
import { AspectRatio } from "burne-ui";
```

## API

`ratio` — доменное отношение сторон, не `variant` и не `size`.

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `ratio` | `1` | Число (ширина / высота) или строка `"16/9"` |
| `classNames` | — | Слоты `root`, `content` |
| `motion` | — | Карта этих слотов |
| `motionController` | — | Handle на Provider, не на корневой `div` |
| `motionState` | — | Режим `motion.states` |
| `motionPayload` | — | Снимок для фабрики (`ctx.payload`) |
| `playInitialState` | `false` | Играть режим на маунте |

Дети рисуются в слоте `content`.

### `AspectRatioClassNames`

`root`, `content`.

## Анимации

### Slot motion

Слоты `root`, `content`. Фазы `enter`, `leave`, `hoverIn`, `hoverOut`, `pressIn`, `pressOut` — opt-in. Дефолт пустой.

## MotionController

Ручка на корне. `play()` играет `root`. Слой содержимого — `playSlot("content")`. `motionState`, `motionPayload` и `playInitialState` не попадают на DOM.

```tsx
const frame = useMotionControllerHandle();

<AspectRatio ratio="16/9" motionController={frame}>
  <img alt="Обложка" src="/cover.jpg" />
</AspectRatio>
```

## Доступность

Корень не задаёт роль. Имя несёт содержимое: у картинки — `alt`, у декоративного кадра — `aria-hidden` на содержимом.

## Структура файлов

```
AspectRatio/
├── AspectRatio.tsx
├── index.ts
├── aspectRatioTypes.ts
├── aspectRatioStyles.ts
├── aspectRatioAnimations.ts
├── aspectRatioContext.tsx
└── AspectRatio.stories.tsx
```
