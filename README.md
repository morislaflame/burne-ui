# Burne UI

React-компоненты с Tailwind CSS v4, анимациями на **GSAP** и тёмной/светлой темой. Иконки рассчитаны на **react-icons** (Io5).

## Установка

```bash
npm install burne-ui react-icons gsap
# или: pnpm / yarn / bun
```

**Полная пошаговая настройка** (Tailwind v4, Next.js, тема, motion, SSR, troubleshooting): **[docs/SETUP.md](./docs/SETUP.md)**.

**Готовый проект одной командой** (npm / pnpm / bun):

```bash
npm create burne-app@latest my-app
# pnpm create burne-app my-app
# bunx create-burne-app my-app
```

В существующий проект:

```bash
npx burne-ui@latest init
```

### Peer-зависимости

Убедитесь, что в приложении установлены совместимые версии:

- `react`, `react-dom` (18 или 19)
- `react-icons` (^5)
- `gsap` (^3.12)

## Стили

Стили **не** идут вместе с JS-импортом. Подключите CSS пакета **один раз** в точке входа (или в корневом layout):

```ts
import "burne-ui/styles.css";
```

В нём:

- **Дизайн-токены** как CSS-переменные: `--color-*`, `--space` / `--space-*`, `--size` / `--size-*`, `--radius`, `--text-scale-*`, и др. Полный перечень имён — экспорт **`designTokenNames`** из `burne-ui`; исходные значения по умолчанию смотрите в репозитории в `src/tokens/styles.css`.
- **Мост Tailwind** (`@theme inline`): цвета в утилитах вида `bg-background`, `text-foreground`, `border-border`, отступы `gap-large`, `p-mid`, радиусы `rounded-base` и т.д.
- **Кастомные утилиты** (`@utility`): например `border-token`, `border-t-token`, `text-header-1`, `text-mid`, `max-w-component-base`, `min-w-button-base`.

Имена переменных **не** с префиксом `brn-`; это обычные `--color-background`, `--space-large` и т.п.

### Слои имён токенов

| Домен | Knob | Шаги (design) | Мост Tailwind | Утилиты |
|-------|------|---------------|---------------|---------|
| Spacing | `--space` | `--space-*` (`xsmall`…`3xlarge`) | `--spacing-*` | `gap-*`, `p-*`, `m-*` |
| Radius | `--radius` | `--radius-*` | `--radius-*` (identity) | `rounded-*` |
| Control | — | `--control-height-*` / `--control-size-*` (= height) | — | `h-control-*`, `w-control-*` |
| Icons | `--size` | `--size-scale-*` → `--icon-size-*` (1:1) | — | `icon-xsmall` … `icon-3xlarge` |

`--space-*` и `--spacing-*` — разные имена **намеренно**: у Tailwind namespace отступов — `spacing`.

Шкала spacing: `xsmall` 0.5 · `small` 0.75 · `base` 1 · `mid` 1.5 · `large` 2 · `xlarge` 2.5 · `2xlarge` 3 · `3xlarge` 3.875 (× `--space`).

### Типографика

Примитивы `--text-scale-*` и UI-роли/`text-*` утилиты совпадают по имени:

| Шаг / утилита | rem |
|---------------|-----|
| `xsmall` / `text-xsmall` | 0.6875 |
| `small` / `text-small` | 0.75 |
| `base` / `text-base` | 0.875 |
| `mid` / `text-mid` | 1 |
| `large` / `text-large` | 1.25 |
| `xlarge` → `text-header-2` | 1.5 |
| `2xlarge` → `text-header-1` | 1.875 |
| `3xlarge` → `text-accent-header` | 2.25 |

Чтобы увеличить «обычный» текст в компонентах, переопределяйте `--text-scale-base`.

## Кастомизация темы

### BurneUIProvider (рекомендуется)

Entry `burne-ui` поставляется с `"use client";` (Next.js App Router). Client-файл провайдера нужен, если рядом вызываете хуки / `configureMotion`:

```tsx
"use client";

import { BurneUIProvider } from "burne-ui";
import burneTheme from "./burne-theme";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <BurneUIProvider config={burneTheme} defaultTheme="system" toast>
      {children}
    </BurneUIProvider>
  );
}
```

Для русской локали дефолтных aria-строк:

```tsx
import { BurneUIProvider, BURNE_LABELS_RU } from "burne-ui";

<BurneUIProvider config={burneTheme} labels={BURNE_LABELS_RU} defaultTheme="system">
  {children}
</BurneUIProvider>
```

Scaffold (`create-burne-app` / `burne-ui init`) уже кладёт `burne-theme.ts` с **`tokens`** (shared), **`colors.light` / `colors.dark`** и **`motion`**.

Проектные CSS-переменные можно описать в том же конфиге. Они применяются Provider и автоматически
появляются в `burne-ui-devtools`:

```ts
const burneTheme = {
  // tokens, colors, motion...
  customTokens: {
    "--app-brand": "#38bdf8",
    "--app-sidebar-width": {
      value: 320,
      unit: "px",
      label: "Sidebar width",
      control: "slider",
      min: 240,
      max: 480,
      step: 4,
    },
  },
} satisfies BurneThemeConfig;
```

### Devtools темы

Интерактивный редактор устанавливается отдельно и подключается только в development:

```bash
npm install -D burne-ui-devtools
```

Он показывает плавающую кнопку, позволяет менять токены и пресеты в браузере, а затем скопировать
или скачать готовый `burne-theme.ts`. Пресеты шрифтов подгружают Google Fonts лениво только в
devtools; в production выбранный face нужно подключить самим. Полная интеграция для Vite и Next.js —
в [`burne-ui-devtools`](https://www.npmjs.com/package/burne-ui-devtools) и
[docs/SETUP.md](./docs/SETUP.md).


Только переключение `data-theme`: `ThemeProvider` + `useBurneTheme()`. Для SSR без вспышки темы — `ThemeScript` (или `getThemeScript`) в root layout. Подробности — [docs/SETUP.md](./docs/SETUP.md).

### CSS-переопределения

Чтобы поменять палитру, отступы, шрифты, шкалу типографики и прочее, переопределите те же переменные **после** импорта `burne-ui/styles.css`:

```ts
import "burne-ui/styles.css";
import "./burne-theme-overrides.css";
```

Пример `burne-theme-overrides.css`:

```css
:root {
  --color-primary: #6366f1;
  --space: 0.5625rem;   /* fixed rem — без fluid; для fluid см. theme config ниже */
  --size: 1.0625rem;
  --radius: 0.625rem;
  --font-family-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --text-scale-base: 0.9375rem; /* UI-текст (роль text-base) */
}

/* Светлая тема: те же ветки, что и в пакете */
[data-theme="light"] {
  --color-primary: #4f46e5;
}
```

Theme config / playground (`tokens.space` и т.п.) через `applyThemeTokens` пишут scaled `clamp` и тени с `calc(… * var(--shadow-size))` — оверрайды не ломают fluid. Ручной fixed rem в CSS — да, отключает. Инлайн ставятся **только** токены ≠ дефолтам кита, поэтому CSS-файл оверрайдов может точечно править остальное.

Переменные наследуются по дереву DOM — при необходимости задайте их на обёртке виджета вместо `html`.

Из JS удобно сверять имена с массивом **`designTokenNames`**, а для цветов в `style` есть хелпер **`colorToken`** (оба экспортируются из `burne-ui`):

```ts
import { designTokenNames, colorToken } from "burne-ui";

const ripple = colorToken("converge-ripple-neutral"); // var(--color-converge-ripple-neutral)
```

## Tailwind в приложении-потребителе

Компоненты используют классы Tailwind, сопоставленные с токенами пакета (`bg-surface`, `text-muted`, `gap-mid`, …). Чтобы **ваши** классы в `className` и классы из prebuilt-бандла библиотеки попали в итоговый CSS, Tailwind должен сканировать артефакты пакета. Добавьте путь к сборке (пример для Tailwind v4 / Vite):

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
