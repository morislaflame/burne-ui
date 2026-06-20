# Burne UI

React-компоненты с Tailwind CSS v4, анимациями на **GSAP** и тёмной/светлой темой. Иконки рассчитаны на **react-icons** (Io5).

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

- **Дизайн-токены** как CSS-переменные: `--color-*`, `--space` / `--space-*`, `--size` / `--size-*`, `--radius`, `--text-scale-*`, и др. Полный перечень имён — экспорт **`designTokenNames`** из `burne-ui`; исходные значения по умолчанию смотрите в репозитории в `src/tokens/styles.css`.
- **Мост Tailwind** (`@theme inline`): цвета в утилитах вида `bg-background`, `text-foreground`, `border-border`, отступы `gap-mid`, `p-plus`, радиусы `rounded-base` и т.д.
- **Кастомные утилиты** (`@utility`): например `border-token`, `border-t-token`, `text-header-1`, `text-mid`, `max-w-component-base`, `min-w-button-base`.

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
  --color-primary: #6366f1;
  --space: 0.5625rem;   /* плотнее/просторнее отступы */
  --size: 1.0625rem;    /* крупнее иконки, индикаторы, кнопки */
  --radius: 0.625rem;   /* мягче скругления */
  --font-family-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --text-scale-sm: 0.9375rem; /* UI-текст (роль text-base) */
}

/* Светлая тема: те же ветки, что и в пакете */
[data-theme="light"] {
  --color-primary: #4f46e5;
}
```

Переменные наследуются по дереву DOM — при необходимости задайте их на обёртке виджета вместо `html`.

Из JS удобно сверять имена с массивом **`designTokenNames`**, а для цветов в `style` есть хелпер **`colorToken`** (оба экспортируются из `burne-ui`):

```ts
import { designTokenNames, colorToken } from "burne-ui";

const ripple = colorToken("converge-ripple-neutral"); // var(--color-converge-ripple-neutral)
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
<html data-theme="light">
```

Атрибут `data-theme="light"` на `<html>` или на обёртке включает светлые токены. Портальные компоненты (`Dialog`, `AlertDialog`, `Drawer`, `Tooltip`, …) наследуют тему с триггера/якоря или с корня документа; overlay модалок обновляется при смене атрибута.

## Экспорт `cn`

Для предсказуемого слияния классов (в т.ч. переопределение дефолтов компонентов через `className`) используется **clsx** + **tailwind-merge**:

```ts
import { cn } from "burne-ui";

<div className={cn("flex gap-2", className)} />
```

Функция реэкспортируется из корня пакета; зависимости уже входят в `burne-ui`, отдельно ставить их не обязательно.

## Поля формы: `Field`, `Hint`, dual API

### Примитив `Field`

Общая оболочка для кастомных полей и внутренних компонентов:

```tsx
import { Field, Label } from "burne-ui";

<Field>
  <Label htmlFor="custom-id">Подпись</Label>
  <input id="custom-id" />
  <Field.Hint status="danger">Сообщение об ошибке</Field.Hint>
</Field>
```

`Field.Hint` — единый компонент подсказки для всех field-like компонентов. По умолчанию `as="p"` (под полем); для inline-подписи внутри label/grid — `as="span"`.

### Dual API (simple + compound)

У **Input**, **Selector**, **Switch**, **Meter**, **ProgressBar**, **Slider**, **Avatar**:

| Режим | Когда | Пример |
|-------|-------|--------|
| **Simple** | Без `children` | `<Input label="Email" hint="…" placeholder="…" />`, `<Avatar label="Ada" src="…" />` |
| **Compound** | С `children` | `<Input><Input.Label>…</Input.Label><Input.Control … /></Input>`, `<Avatar><Avatar.Image … /><Avatar.Fallback /></Avatar>` |

В compound-режиме props layout (`label`, `hint`, `showValue`, `src` …) на root **игнорируются**.

**Checkbox** / **Radio** — **Simple** (`label`, `hint`) и **Compound** (`*.Control`, `*.Indicator`, `*.Content`, `*.Label`, `*.Hint`). **CheckboxGroup** / **RadioGroup** — compound с `Legend`, `Label`, `Hint`, `List`; у **RadioGroup** также **`Error`** для сообщения валидации на fieldset.

**Badge** — simple-only для контента (`children`, prop `icon`); иконки в разметке — `data-icon="inline-start" | "inline-end"` на child; для наложения на якорь — **`Badge.Anchor`**.

### SearchInput

`SearchInput` — отдельный atomic-компонент для строки поиска (иконка, ripple, clear, раскрытие). Для полей формы используйте `Input` (simple или compound) или `Input.Control` с `prefix`. Задавайте **`aria-label`** — placeholder не заменяет подпись для AT.

### Миграция

См. [CHANGELOG.md](./CHANGELOG.md): `description` → `hint`, `*.Description` → `*.Hint`, `descriptionId` → `hintId`.

## Сборка и разработка репозитория

```bash
bun install
bun run build    # dist: JS/CJS + ui.css (как burne-ui/styles.css) + типы
bun run lint
bun run storybook
```

## Лицензия

Укажите лицензию в `package.json` при публикации в npm.
