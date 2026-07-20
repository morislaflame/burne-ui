# Начальная настройка Burne UI

Полное руководство по первой интеграции `burne-ui` в приложение: зависимости, стили, Tailwind CSS v4, тема, анимации, провайдеры и типичные проблемы (в том числе SSR в Next.js).

Краткий обзор API и токенов — в [README.md](../README.md).

**Быстрый старт (scaffold):** CLI `create-burne-app` — Next или Vite уже с `BurneUIProvider`:

```bash
npm create burne-app@latest my-app
# pnpm create burne-app my-app
# bunx create-burne-app my-app
```

В существующий проект:

```bash
npx burne-ui@latest init
# pnpm dlx burne-ui init
# bunx burne-ui init
```

---

## 1. Установка

```bash
npm install burne-ui react-icons
# или: pnpm / yarn / bun
```

### Peer-зависимости

В приложении должны быть установлены совместимые версии:

| Пакет | Версия |
|-------|--------|
| `react`, `react-dom` | `^18.0.0 \|\| ^19.0.0` |
| `react-icons` | `^5.0.0` |

GSAP и `@gsap/react` уже входят в `burne-ui` — отдельно ставить их не нужно.

---

## 2. Подключение стилей

Импортируйте собранный CSS **один раз** в глобальной точке входа (корневой layout, `main.tsx`, `_app`):

```ts
import "burne-ui/styles.css";
```

Файл `burne-ui/styles.css` (артефакт сборки `dist/ui.css`) содержит:

- **дизайн-токены** — `--color-*`, `--space`, `--size`, `--radius`, `--text-scale-*`, шрифты, тени;
- **мост Tailwind** (`@theme inline`) — утилиты `bg-background`, `text-muted`, `gap-mid`, `rounded-base` и т.д.;
- **кастомные утилиты** — `border-token`, `text-header-1`, `shadow-token-sm` и др.

Полный перечень имён токенов — экспорт **`designTokenNames`** из `burne-ui`. Исходные значения по умолчанию — `src/tokens/styles.css` в репозитории.

---

## 3. Tailwind CSS v4 в приложении-потребителе

Компоненты используют классы Tailwind, привязанные к токенам пакета. Чтобы **ваши** классы в `className` попали в итоговый CSS, Tailwind должен сканировать исходники приложения.

### Рекомендуемый `globals.css`

```css
@import "tailwindcss";

/* Сканируем только код приложения — классы из burne-ui уже в ui.css */
@source "../app/**/*.{tsx,ts}";
@source "../components/**/*.{tsx,ts}";
@source "../lib/**/*.{tsx,ts}";

@import "burne-ui/styles.css";
```

### Зачем не сканировать весь `node_modules/burne-ui/dist`

`burne-ui/styles.css` уже включает prebuilt-утилиты для всех классов библиотеки. Повторный `@source` на весь `dist/` (сотни файлов):

- **не обязателен** для корректного отображения компонентов;
- **заметно нагружает CPU** в dev (Tailwind пересканирует bundle при каждом HMR).

Добавляйте `@source "../node_modules/burne-ui/dist"` только если используете классы из `dist/*.js`, которых **нет** в prebuilt `ui.css`, и они не попадают в scan вашего кода.

### Порядок слоёв

Правила приложения подключайте **после** `@import "burne-ui/styles.css"`, иначе утилиты из `ui.css` (например `.grid-cols-1`) могут перекрыть ваши responsive-классы при одинаковой специфичности.

---

## 4. Базовый layout (Next.js App Router)

```tsx
// app/layout.tsx
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="min-h-[100dvh] antialiased" suppressHydrationWarning>
      <body className="min-h-[100dvh] bg-background text-foreground">{children}</body>
    </html>
  );
}
```

`suppressHydrationWarning` на `<html>` полезен, если тема (`data-theme`) задаётся на клиенте до гидрации.

Первый компонент:

```tsx
"use client";

import { Button } from "burne-ui";

export function Demo() {
  return <Button variant="primary">Нажми меня</Button>;
}
```

---

## 5. Рекомендуемая структура провайдеров

```text
app/
  globals.css
  layout.tsx
  burne-theme.ts          # стартовый конфиг (scaffold / init) или Copy config с сайта
components/
  providers/
    app-providers.tsx
```

```tsx
// components/providers/app-providers.tsx
"use client";

import { BurneUIProvider } from "burne-ui";
import burneTheme from "@/burne-theme";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <BurneUIProvider config={burneTheme} defaultTheme="system" toast>
      {children}
    </BurneUIProvider>
  );
}
```

`BurneUIProvider` объединяет:

- **ThemeProvider** — `data-theme` (`light` | `dark` | `system`), опционально `localStorage`
- **токены** — shared `config.tokens` + цвета `config.colors.light` / `colors.dark` (или проп `tokens`)
- **motion** — `configureMotion` из `config.motion`
- **Toast.Provider** — по умолчанию включён (`toast={false}` чтобы отключить)

Только тема без тостов/токенов:

```tsx
import { ThemeProvider, useBurneTheme } from "burne-ui";

<ThemeProvider defaultTheme="dark" storageKey="burne-ui-theme">
  {children}
</ThemeProvider>
```

```tsx
// app/layout.tsx
import { AppProviders } from "@/components/providers/app-providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
```

### Конфиг с playground сайта

1. Настройте тему в theme builder на сайте (пресеты цветов/шрифтов живут **на сайте**, не в npm-пакете).
2. **Copy config** — в буфер попадёт файл `burne-theme.ts` (`tokens` + `colors.light` / `colors.dark` + `motion`).
3. Сохраните его в проект (замените стартовый) и передайте в провайдер:

```tsx
import { BurneUIProvider } from "burne-ui";
import burneTheme from "./burne-theme";

<BurneUIProvider config={burneTheme}>{children}</BurneUIProvider>
```

### Можно ли править «стандартную» тему?

Да. Стартовый `burne-theme.ts` — это **ваш** снимок дефолтных light/dark палитр + shared tokens. Меняйте любые ключи в `colors.dark` / `colors.light` (включая `primary`, `border`, hover, status foregrounds) и поля в `tokens` / `motion`. Частичный объект тоже ок: незаданные ключи берутся из дефолтов кита.

Альтернатива: **Copy CSS** → `burne-theme-overrides.css` (без JS runtime), см. §7.

### Проектные переменные и автоматические контролы

`customTokens` позволяет хранить CSS-переменные приложения рядом с темой. Ключ всегда начинается
с `--`. Простые значения получают контрол автоматически; объект добавляет подпись, диапазон,
единицу измерения или отдельные light/dark-значения:

```ts
import type { BurneThemeConfig } from "burne-ui";

const burneTheme = {
  theme: "dark",
  customTokens: {
    "--app-brand": "#38bdf8",
    "--app-compact-navigation": false,
    "--app-sidebar-width": {
      value: 320,
      unit: "px",
      label: "Sidebar width",
      group: "Application",
      control: "slider",
      min: 240,
      max: 480,
      step: 4,
    },
    "--app-hero-glow": {
      values: {
        dark: "oklch(72% 0.16 230)",
        light: "oklch(58% 0.18 240)",
      },
      label: "Hero glow",
      control: "color",
    },
  },
} satisfies BurneThemeConfig;

export default burneTheme;
```

`BurneUIProvider` применяет эти значения в production. `burne-ui-devtools` читает тот же конфиг и
автоматически добавляет соответствующие поля в секцию Custom tokens.

### Devtools темы

Установите редактор как dev dependency:

```bash
npm install -D burne-ui-devtools
```

Компонент должен находиться внутри `BurneUIProvider`: он использует runtime preview Provider,
поэтому не записывает токены параллельно с ним.

Vite:

```tsx
import { lazy, Suspense } from "react";

const ThemeDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("burne-ui-devtools").then(({ BurneThemeDevtools }) => ({
        default: BurneThemeDevtools,
      })),
    )
  : null;

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <BurneUIProvider config={burneTheme}>
      {children}
      {ThemeDevtools ? (
        <Suspense fallback={null}>
          <ThemeDevtools />
        </Suspense>
      ) : null}
    </BurneUIProvider>
  );
}
```

Next.js App Router (`components/providers/app-providers.tsx`, обязательно client component):

```tsx
"use client";

import dynamic from "next/dynamic";

const ThemeDevtools =
  process.env.NODE_ENV === "development"
    ? dynamic(
        () => import("burne-ui-devtools").then((module) => module.BurneThemeDevtools),
        { ssr: false },
      )
    : () => null;

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <BurneUIProvider config={burneTheme}>
      {children}
      <ThemeDevtools />
    </BurneUIProvider>
  );
}
```

В панели доступны live preview, light/dark, пресеты, Shuffle (рандомный цветовой пресет +
Scale + шрифты, без motion), Reset, Copy CSS, Copy config и Download `burne-theme.ts`.
Изменения сохраняются только в браузерном devtools storage; исходный файл автоматически не
перезаписывается.

Диапазоны слайдеров (min / max / step) задаются в пакете `burne-ui-devtools` в файле
`src/BurneThemeDevtools/burneThemeDevtoolsData.ts` (`SCALE_CONTROLS`, `SHADOW_CONTROLS`,
`MOTION_*`).

Подключите стили панели рядом с `burne-ui/styles.css`:

```css
@import "burne-ui/styles.css";
@import "burne-ui-devtools/styles.css";
```

#### Шрифты в пресетах

Пресеты sans/mono в редакторе задают только CSS-стек (`--font-family-sans` /
`--font-family-mono`). Файлы Google Fonts **подгружаются лениво** при выборе
пресета или при восстановлении снимка из localStorage (`ensureThemeFontLoaded`):
один stylesheet на семейство, плюс `preconnect` к Google Fonts. Системные
стеки сеть не трогают.

В production редактор обычно не монтируется — выбранный шрифт нужно подключить
самим (self-host, `next/font`, или один `<link>` на нужные семейства). Export
config копирует только строку `fontFamily`, не файлы шрифтов.

Для документации / layout можно взять готовые URL всех пресетов:

```ts
import {
  THEME_SANS_FONTS_URL,
  THEME_MONO_FONTS_URL,
  ensureThemeFontLoaded,
} from "burne-ui-devtools";
```

---

## 6. Светлая и тёмная тема

Светлая тема включается атрибутом на корне (это делает `ThemeProvider` / `BurneUIProvider`):

```html
<html data-theme="light">
```

Runtime-переключатель:

```tsx
"use client";

import { useBurneTheme } from "burne-ui";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useBurneTheme();
  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
    >
      {theme}
    </button>
  );
}
```

Портальные компоненты (`Dialog`, `AlertDialog`, `Drawer`, `Tooltip`, `Toast`, `Popover`, `Dropdown`) наследуют тему с якоря/триггера или с `<html>`.

---

## 7. Кастомизация дизайн-токенов

Переопределяйте CSS-переменные **после** импорта `burne-ui/styles.css`:

```css
/* app/burne-theme-overrides.css */
:root {
  --color-primary: #6366f1;
  --color-surface: #121212;
  --space: 0.5625rem;
  --size: 1.0625rem;
  --radius: 0.625rem;
  --font-family-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}

[data-theme="light"] {
  --color-primary: #4f46e5;
}
```

```css
/* globals.css */
@import "tailwindcss";
@source "../app/**/*.{tsx,ts}";
@source "../components/**/*.{tsx,ts}";

@import "burne-ui/styles.css";
@import "./burne-theme-overrides.css";
```

Из JS:

```ts
import { designTokenNames, colorToken } from "burne-ui";

const ripple = colorToken("converge-ripple-neutral"); // var(--color-converge-ripple-neutral)
```

Переменные наследуются по DOM — можно задать их на обёртке виджета вместо `html`.

---

## 8. Глобальная конфигурация анимаций (`configureMotion`)

Burne UI использует **GSAP**. Поведение hover-lift, press-squeeze, ripple, async-кнопок, Loading dots и др. настраивается через **`configureMotion()`** из `burne-ui`.

### Где вызывать

| Среда | Место |
|-------|--------|
| Vite / CRA | `main.tsx` до `createRoot(...).render(...)` |
| Next.js | Client-провайдер в `layout.tsx`; предпочтительно **`useLayoutEffect`**, не `useEffect` |

### Пример (Next.js)

```tsx
"use client";

import { configureMotion } from "burne-ui";
import { useLayoutEffect } from "react";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    configureMotion({
      interactiveDuration: 280,
      tooltipDuration: 200,
      expandDuration: 320,
      enableHoverLift: true,
      enablePressSqueeze: true,
      enableRipple: true,
      enableAsyncButtonCrossfade: true,
      enableProgressFill: true,
      enableLoadingDots: true,
    });
  }, []);

  return <>{children}</>;
}
```

### Основные группы `MotionConfig`

| Группа | Ключи |
|--------|--------|
| Тайминги / easing | `interactiveDuration`, `tooltipDuration`, `expandDuration`, `progressFillDuration`, `loadingDotsDuration`, `*Ease` |
| Hover / press | `hoverLiftScale`, `pressSqueezeScale`, `badgeAnchorHoverLiftScale` |
| Ripple | `rippleDefaultDuration`, `rippleExpandableDuration`, `rippleEaseCss`, … |
| Feature flags | `enableHoverLift`, `enablePressSqueeze`, `enableRipple`, `enableAsyncButtonCrossfade`, `enableToggleButtonFill`, `enableExpandable`, `enableToastStack`, `enableContentFade`, `enableFeedbackExpand`, `enableProgressFill`, `enableLoadingDots` |

Библиотека учитывает **`prefers-reduced-motion: reduce`**.

### Важно при live-theme builder

Если `configureMotion()` вызывается при каждом движении слайдера темы, **дедуплируйте** вызовы с одинаковыми значениями: каждый вызов увеличивает revision и пересоздаёт GSAP-тween'ы у подписчиков (Loading dots и др.), что нагружает CPU.

---

## 9. Toast

Обёрните приложение в провайдер — иначе `useToast()` не работает:

```tsx
"use client";

import { Toast } from "burne-ui";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Toast.Provider defaultPlacement="bottom-center">
      {children}
    </Toast.Provider>
  );
}
```

```tsx
"use client";

import { Button, useToast } from "burne-ui";

export function SaveButton() {
  const { toast } = useToast();

  return (
    <Button
      onClick={() =>
        toast.success("Сохранено", {
          description: "Изменения успешно применены",
        })
      }
    >
      Сохранить
    </Button>
  );
}
```

API: `toast.show`, `toast.success`, `toast.danger`, `toast.warning`, `toast.info`, `toast.promise`, `toast.dismiss`.

---


## 11. Утилита `cn`

```ts
import { cn } from "burne-ui";

<div className={cn("flex gap-mid", className)} />
```

`clsx` + `tailwind-merge` уже в зависимостях пакета.

---

## 12. Частые проблемы

### Стили «сломаны», компонент без оформления

1. Подключён ли `import "burne-ui/styles.css"`?
2. Tailwind v4 сканирует ваш код (`@source` на `app/`, `components/`)?
3. Override-токены идут **после** импорта `burne-ui/styles.css`?

### `useToast()` падает или toast не показывается

- Нет `<Toast.Provider>` выше по дереву.

### Тема не переключается

- `data-theme="light"` должен быть на `<html>` (или на предке портала), не на вложенном `div` без наследования.

### На кнопке сразу видны loader, текст и крестик

- Типично для **SSR** со старым `burne-ui` без правил в `styles.css` (см. [§10](#10-ssr-и-nextjs-async-слои-button-и-selection-fill)) — обновите пакет.
- Проверьте, что `enableAsyncButtonCrossfade` не отключён без альтернативного скрытия слоёв.

### Анимации не меняются после `configureMotion`

- Вызов слишком поздно (`useEffect` после paint) — используйте `useLayoutEffect`.
- Вызов не в client boundary (`"use client"`).

### Высокая нагрузка CPU в dev (Next.js)

1. Уберите `@source` на весь `node_modules/burne-ui/dist`, если достаточно `burne-ui/styles.css`.
2. Не вызывайте `configureMotion` на каждый tick theme UI без дедупликации.
3. Изолируйте тяжёлые theme-панели: не подписывайте весь layout на context темы, если перерисовывается только sidebar.

---

## 13. Checklist первой настройки

- [ ] Установлены `burne-ui` и `react-icons`
- [ ] Подключён `burne-ui/styles.css`
- [ ] Tailwind v4: `@source` на код приложения
- [ ] `burne-ui` ≥ 1.5.3 (SSR + gloss blur CSS в `styles.css`); для тяжёлых demo можно `ssr: false`
- [ ] (Опционально) Override-токены в отдельном CSS после импорта пакета
- [ ] (Опционально) `configureMotion(...)` в client-провайдере через `useLayoutEffect`
- [ ] (Если нужны toast) `Toast.Provider` в корне

После этого библиотека готова к использованию; кастомизация — через CSS-токены на `:root` / `[data-theme="light"]` и `configureMotion()`.

---

## 14. Связанные материалы

- [README.md](../README.md) — обзор API, dual API полей, миграция `hint`
- [CHANGELOG.md](../CHANGELOG.md) — breaking changes между версиями
- `playground/` в репозитории — theme builder и каталог компонентов (Vite, client-only)
