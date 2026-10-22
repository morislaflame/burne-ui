# Container

Центрированная колонка страницы: `max-w-page-*` и горизонтальный padding из `--space-*`. Раскладка, не поверхность: тени нет.

## Импорт

```tsx
import { Container, type ContainerProps, type ContainerMaxWidth } from "burne-ui";
```

## API

### Базовое использование

```tsx
<Container maxWidth="large" padding="base">
  <Stack gap="mid">
    <Text textStyle="header-2">Экран</Text>
  </Stack>
</Container>
```

Compound API нет. Один DOM-узел — `root`.

### Props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `maxWidth` | `large` | Домен: `xsmall` … `2xlarge` → `max-w-page-*` (`--max-page-*`), не `ComponentSize` и не `--max-component-*` |
| `padding` | `base` | Домен: горизонтальный шаг `space` (`xsmall` … `3xlarge`) |
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

`false` на фазе — skip. Ширину контейнера не твиньте.

Проп `motionController` и ключ `events` на `motion` — команды вроде `container:nudge`, не фазы. Галерея — playground / Storybook **MotionController** и **Slot motion**.

## Стилизация и кастомизация

### `ContainerClassNames`

`root`.

`className` побеждает слот.

## Доступность

Корень — `<div>` без роли. Имя страницы задаёт заголовок внутри.

## Структура файлов

```
Container/
├── Container.tsx
├── index.ts
├── containerTypes.ts
├── containerStyles.ts
├── containerAnimations.ts
├── containerContext.tsx
└── Container.stories.tsx
```
