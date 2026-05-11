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

В нём:

- **Дизайн-токены** как CSS-переменные: `--color-*`, `--space-*`, `--font-family-*`, `--text-*-size` / `line-height` / `weight`, `--radius-value-*`, и др. Полный перечень имён — экспорт **`designTokenNames`** из `burne-ui`; исходные значения по умолчанию смотрите в репозитории в `src/tokens/styles.css`.
- **Мост Tailwind** (`@theme inline`): цвета в утилитах вида `bg-background`, `text-foreground`, `border-base`, `bg-accent`, отступы `gap-mid`, `p-plus`, радиусы `rounded-base` и т.д.
- **Кастомные утилиты** (`@utility`): например `text-header-1`, `text-mid`, `max-w-component-base`, `min-w-button-base`.

Имена переменных **не** с префиксом `brn-`; это обычные `--color-background`, `--space-mid` и т.п.

## Кастомизация темы

Чтобы поменять палитру, отступы, шрифты, шкалу типографики и прочее, переопределите те же переменные **после** импорта `burne-ui/styles.css`:

```ts
import "burne-ui/styles.css";
import "./burne-theme-overrides.css";
```

Пример `burne-theme-overrides.css`:

```css
:root {
  --color-accent: #6366f1;
  --space-mid: 1.125rem;
  --font-family-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --text-base-size: 0.9375rem;
}

/* Светлая тема: те же ветки, что и в пакете */
[data-brn-theme="light"],
[data-theme="light"] {
  --color-accent: #4f46e5;
}
```

Переменные наследуются по дереву DOM — при необходимости задайте их на обёртке виджета вместо `html`.

Из JS удобно сверять имена с массивом **`designTokenNames`**, а для цветов в `style` есть хелпер **`colorToken`** (оба экспортируются из `burne-ui`):

```ts
import { designTokenNames, colorToken } from "burne-ui";

const ripple = colorToken("converge-ripple-accent-soft"); // var(--color-converge-ripple-accent-soft)
```

## Tailwind в приложении-потребителе

Компоненты используют классы Tailwind, сопоставленные с токенами пакета (`bg-surface`, `text-muted`, `gap-plus`, …). Чтобы **ваши** классы в `className` и классы из prebuilt-бандла библиотеки попали в итоговый CSS, Tailwind должен сканировать артефакты пакета. Добавьте путь к сборке (пример для Tailwind v4 / Vite):

```ts
// @source в глобальном CSS приложения или content — см. документацию Tailwind v4
// Нужно сканировать как минимум:
// - ваши **/*.{tsx,jsx},
// - node_modules/burne-ui/dist/**/*.{js,mjs,cjs}
```

Без этого часть утилит из переданных вами классов может не попасть в CSS.

## Светлая тема

На корне (например `<html>`) или на обёртке портала:

```html
<html data-brn-theme="light">
```

Поддерживается также `data-theme="light"` (как в Storybook). В коде проверка: `document.documentElement.dataset.brnTheme === "light"`.

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
bun run build    # dist: JS/CJS + ui.css (как burne-ui/styles.css) + типы
bun run lint
bun run storybook
```

## Лицензия

Укажите лицензию в `package.json` при публикации в npm.
