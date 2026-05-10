# Burne UI

React-компоненты с Tailwind CSS v4, анимациями на **anime.js** и тёмной/светлой темой. Иконки рассчитаны на **react-icons** (Io5).

## Установка

```bash
npm install burne-ui
# или: pnpm / yarn / bun
```

### Peer-зависимости

Убедитесь, что в приложении установлены совместимые версии:

- `react`, `react-dom` (18 или 19)
- `react-icons` (^5)

## Стили

Подключите собранный CSS пакета **один раз** в точке входа (или в корневом layout):

```ts
import "burne-ui/styles.css";
```

В нём уже есть токены (`--brn-*`), утилиты раскладки (`brn-inset-*`, `brn-title-subtitle-stack*`) и мост Tailwind (`text-brn-text`, `bg-brn-surface` и т.д.).

## Tailwind в приложении-потребителе

Компоненты используют утилиты вида `text-brn-*`, `border-brn-*` и классы из вашего `@theme`. Чтобы **свои** классы в `className` (и классы из библиотеки в JS-бандле) попадали в сборку Tailwind, добавьте пакет в `content` (пример для Tailwind v4 / Vite):

```ts
// tailwind config или @source в CSS — см. документацию Tailwind v4 для вашего стека
// Нужно сканировать как минимум:
// - ваши `**/*.{tsx,jsx}`,
// - `node_modules/burne-ui/dist/**/*.{js,mjs}`
```

Если не добавить путь к библиотеке, стили из переданных вами утилит могут не попасть в итоговый CSS.

## Светлая тема

На корне (например `<html>`) или на обёртке портала:

```html
<html data-brn-theme="light">
```

В коде проверка: `document.documentElement.dataset.brnTheme === "light"`.

## Экспорт `cn`

Для предсказуемого слияния классов (в т.ч. переопределение дефолтов компонентов через `className`) используется **clsx** + **tailwind-merge**:

```ts
import { cn } from "burne-ui";

<div className={cn("flex gap-2", className)} />
```

Функция реэкспортируется из корня пакета; зависимости уже входят в `burne-ui`, отдельно ставить их не обязательно.

## Сборка и разработка репозитория

```bash
bun install
bun run build    # dist: JS/CJS + ui.css + типы
bun run lint
bun run storybook
```

## Лицензия

Укажите лицензию в `package.json` при публикации в npm.
