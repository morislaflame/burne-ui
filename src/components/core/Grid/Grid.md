# Grid

Сетка с числом колонок или `auto-fit`. Промежуток — шкала `--space-*`. Раскладка, не поверхность: тени нет.

## Импорт

```tsx
import { Grid, type GridProps, type GridColumns } from "burne-ui";
```

## API

### Базовое использование

```tsx
<Grid columns={3} gap="mid">
  <Surface padding="mid">A</Surface>
  <Surface padding="mid">B</Surface>
  <Surface padding="mid">C</Surface>
</Grid>
```

Compound API нет. Один DOM-узел — `root`.

### Props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `columns` | `1` | Домен: `1` \| `2` \| `3` \| `4` \| `6` \| `12` \| `auto`. Не `variant` |
| `minTrack` | `mid` | При `columns="auto"`: минимум дорожки `--max-component-*` |
| `gap` | `base` | Домен: шкала `space` (`xsmall` … `3xlarge`), не `ComponentSize` |
| `align` | `stretch` | `start` \| `center` \| `end` \| `stretch` \| `baseline` |
| `className` | — | На корне, после `classNames.root` |
| `classNames` | — | Слот `root` |
| `motion` | — | Слот `root`. Рядом — `events` и `states` |
| `motionController` | — | Handle на Provider, не на DOM |
| `motionState` | — | Имя режима из `motion.states` |
| `motionPayload` | — | Снимок для фабрики (`ctx.payload`) |
| `playInitialState` | — | Сыграть начальный `motionState` при монтировании |

## Анимации

### Slot motion

| Слоты | Фазы | Дефолт |
|-------|------|--------|
| `root` | `enter` / hover / press (opt-in) | empty |

`false` на фазе — skip. Число колонок не твинится.

Проп `motionController` и ключ `events` на `motion` — команды вроде `grid:nudge`, не фазы. Галерея — playground / Storybook **MotionController** и **Slot motion**.

## Стилизация и кастомизация

### `GridClassNames`

`root`.

`className` побеждает слот.

## Доступность

Корень — `<div>` без роли. Это не `role="grid"`: ячейки не являются gridcell.

## Структура файлов

```
Grid/
├── Grid.tsx
├── index.ts
├── gridTypes.ts
├── gridStyles.ts
├── gridAnimations.ts
├── gridContext.tsx
└── Grid.stories.tsx
```
