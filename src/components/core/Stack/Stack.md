# Stack

Колонка или ряд с промежутком из шкалы `--space-*`. Раскладка, не поверхность: тени нет.

## Импорт

```tsx
import { Stack, type StackProps, type StackGap, type StackOrientation } from "burne-ui";
```

## API

### Базовое использование

```tsx
<Stack gap="mid">
  <Text>Первая строка</Text>
  <Text>Вторая строка</Text>
</Stack>
```

Compound API нет. Один DOM-узел — `root`.

### Props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `orientation` | `vertical` | `vertical` \| `horizontal`. На корне `data-orientation` |
| `gap` | `base` | Домен: шкала `space` (`xsmall` … `3xlarge`), не `ComponentSize` |
| `align` | `stretch` | `start` \| `center` \| `end` \| `stretch` \| `baseline` |
| `justify` | `start` | `start` \| `center` \| `end` \| `between` |
| `wrap` | `false` | Перенос на поперечной оси |
| `className` | — | На корне, после `classNames.root` |
| `classNames` | — | Слот `root` |
| `motion` | — | Слот `root`. Рядом — `events` и `states` |
| `motionController` | — | Handle на Provider, не на DOM |
| `motionState` | — | Имя режима из `motion.states` |
| `motionPayload` | — | Снимок для фабрики (`ctx.payload`) |
| `playInitialState` | — | Сыграть начальный `motionState` при монтировании |

`variant` нет. `gap` не размер контрола.

## Анимации

### Slot motion

| Слоты | Фазы | Дефолт |
|-------|------|--------|
| `root` | `enter` / hover / press (opt-in) | empty |

`false` на фазе — skip. Не анимируйте `gap`, `width` и `height` в публичных MotionVars.

Проп `motionController` и ключ `events` на `motion` — команды вроде `stack:nudge`, не фазы. Галерея — playground / Storybook **MotionController** и **Slot motion**.

## Стилизация и кастомизация

### `StackClassNames`

`root`.

`className` побеждает слот.

## Доступность

Корень — `<div>` без роли. Фокус и имя задаёт содержимое.

## Структура файлов

```
Stack/
├── Stack.tsx
├── index.ts
├── stackTypes.ts
├── stackStyles.ts
├── stackAnimations.ts
├── stackContext.tsx
└── Stack.stories.tsx
```
