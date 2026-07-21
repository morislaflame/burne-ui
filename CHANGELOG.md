# Changelog

## 1.5.9

### Breaking

- Boolean props: `isRequired` → `required`, Toast `isLoading` → `loading`, Pagination.Page `isActive` → `active` (ListBox keyboard `isActive` unchanged).
- Theme config: `modes.light` / `modes.dark` → flat **`colors.light` / `colors.dark`** (status foregrounds + hover tokens — обычные ключи палитры).
- Убран `borderCustomized` — `--color-border` всегда задаётся как остальные цвета.
- Из публичного API убраны named color presets (`OCEAN_*` и др.), `FONT_PRESETS` / `LAYOUT_PRESETS` / `COLOR_PRESET_*` — живут на docs site и в playground.
- Убраны публичные `PRIMARY_TINT` / `PRIMARY_TINT_STRONG`, `BORDER_COLOR_CSS_FORMULA`, `finalizePalette`, `ThemeColorSeed` — дефолтные палитры собираются внутри кита; named presets на site/playground — плоские `ThemeColors`.
- `DARK_COLORS` / `LIGHT_COLORS` — плоские снимки (без seed/`finalizePalette`).
- Удалён неиспользуемый токен `--color-surface-tint-primary`.
- В палитру / конфиг добавлены converge-ripple цвета (`convergeRipple*`).
- Убран editor chrome из публичного API (`*_LABELS`, `GSAP_EASE_OPTIONS`, `RIPPLE_EASE_CSS_OPTIONS`, …) — только site/playground `themeEditorChrome`.
- Удалён алиас `ThemeModePalette` (используйте `ThemeColors`).
- `resolveBurneTheme` / `resolveConfigTheme` → единый **`resolveTheme`**.
- `colorPreset` убран из `ThemeTokenState` — только в site/playground `ThemeEditorState`.
- `SCALE_DEFAULTS` разрезан: scale-only + **`MOTION_DEFAULTS`** (шрифты по-прежнему `DEFAULT_FONT*` / `FONT_WEIGHT_DEFAULTS`).
- Scaffold / `burne-ui init` пишут стартовый `burne-theme.ts` и провайдер с `config={burneTheme}`.

### Added

- `createDefaultBurneThemeConfig` / `exportDefaultBurneThemeConfigSource`.
- `DARK_COLORS` / `LIGHT_COLORS` (только дефолтная пара; named presets — плоские снимки на site/playground).
- Editable hover CSS vars в конфиге (`primaryHover`, `defaultHover`, surface-tint-*, fill-hover, …).
- Converge-ripple цвета в палитре / `BurneThemeConfig` (`convergeRipple*`).
- `resolveTheme`, `MOTION_DEFAULTS`.

### Migration

| Было | Стало |
|------|-------|
| `modes: { dark: { colors: {…} } }` | `colors: { dark: {…} }` |
| `import { OCEAN_DARK_COLORS } from "burne-ui"` | инлайн в `burne-theme.ts` или Copy config с сайта |
| отдельный `statusForegrounds` | ключи `dangerForeground` и т.д. внутри `colors.*` |

## 1.5.6

### Fixed

- `Form` + `Input`: form-bound controls no longer flip from uncontrolled → controlled when `getValue` is still `undefined` (coerce to `""`, same pattern as Select/ComboBox). Fixes React console warning on Card auth demos and any `<Input name>` inside `<Form>` without `defaultValues`.

## 1.5.5

### Fixed

- `Tooltip.Trigger` / `Popover.Trigger`: public `asChild` prop in types (merge onto child Button); default `asChild` stays on for a single element child.

## 1.5.4

### Fixed

- `RadioGroup` / `CheckboxGroup`: do not forward `onValueChange`, `value`, `defaultValue`, `required`, `hintId`, `errorId` (and `selection` for CheckboxGroup) to the native `<fieldset>`.
- `Pagination`: no horizontal overflow in narrow parents — `min-w-0` / wrap on root & content, drop `shrink-0` on the controls list, truncate summary.
- `Popover` / `Dropdown`: apply `matchAnchorWidth` minWidth **before** placement measure so viewport clamp keeps the panel on-screen (esp. trailing triggers on mobile). Drop the hardcoded `12rem` floor — width follows content (or `className` `min-w-*`).
- `Skeleton.Text`: unique keys per line (was keyed by width class `w-full`, which duplicated).

## 1.5.3

### Fixed

- Gloss blur OOTB: `-webkit-backdrop-filter` before `backdrop-filter` (Lightning CSS drops the unprefixed property when webkit is second) + reinforce at end of `styles.css`. No app `globals.css` fallback needed.

## Unreleased

### Added

- `BurneThemeConfig.customTokens` для проектных CSS-переменных, mode-specific значений и metadata автоматических контролов.
- Theme runtime preview API (`useBurneThemeRuntime`) для отдельного пакета `burne-ui-devtools`.
- Публичный примитив **`Field`** (`Field`, `Field.Hint`, `Field.Label`).
- **Dual API** (simple + compound) для `Input`, `Selector`, `Switch`, `Meter`, `ProgressBar`, `Slider`, **`Avatar`** (`src` + `label` без children; compound — `Avatar.Image` / `Avatar.Fallback`).
- **`Badge`**: inline-иконки в `children` через `data-icon="inline-start" | "inline-end"`; prop `icon` игнорируется при наличии таких children.
- **`Breadcrumbs`**: при сжатии кнопка «…» открывает **`Dropdown`** со скрытыми разделами.
- **`Dropdown.Item`**: опциональный **`href`** — link-пункт (`<a role="menuitem">`); клавиатура ↑↓ / Home / End / Escape в `Dropdown.Popover`.
- **`Checkbox`**: dual API — compound `Checkbox.Control` / `Checkbox.Indicator` / `Checkbox.Content` / `Checkbox.Label` / `Checkbox.Hint`.
- Общие части шкал: `scaleFieldParts` (`ScaleFieldHeader`, `ScaleFieldValue`, `renderScaleSimpleLayout`).

### Changed

- Единое имя подсказки поля: **`Hint`** вместо `Description` / `description` в field API.
- `Switch.Description` → `Switch.Hint`.
- `CheckboxGroup.Description` / `RadioGroup.Description` → `*.Hint`.
- `description` prop у `Checkbox` / `Radio` → **`hint`**.
- `descriptionId` у групп опций → **`hintId`**.

### Removed

- Внутренний `fieldShell.tsx` (заменён на `@/components/core/Field`).

### Migration

| Было | Стало |
|------|-------|
| `<Switch.Description>…</Switch.Description>` | `<Switch.Hint>…</Switch.Hint>` или prop `hint` на `<Switch>` |
| `<CheckboxGroup.Description>…</CheckboxGroup.Description>` | `<CheckboxGroup.Hint>…</CheckboxGroup.Hint>` |
| `<RadioGroup.Description>…</RadioGroup.Description>` | `<RadioGroup.Hint>…</RadioGroup.Hint>` |
| `<Checkbox description="…" />` | `<Checkbox hint="…" />` |
| `<Radio description="…" />` | `<Radio hint="…" />` |
| `descriptionId` на `CheckboxGroup` / `RadioGroup` | `hintId` |

**Не менялось:** `Dialog.Description`, `Card.Description`, `Alert.Description`, `Dropdown.Item description` — это контент UI, не field hint.

### Simple mode examples

```tsx
// Input
<Input label="Email" hint="Обязательно" placeholder="you@example.com" />

// Selector
<Selector label="Язык" hint="…" options={…} value={v} onValueChange={setV} />

// Switch
<Switch label="Уведомления" hint="Push" defaultChecked />

// Meter / ProgressBar / Slider
<Meter label="CPU" showValue value={65} />
<ProgressBar label="Загрузка" showValue value={42} />
<Slider label="Громкость" showValue defaultValue={50} />

// Avatar
<Avatar label="Grace Hopper" src="/photo.jpg" nickname="grace_h" />

// Badge (inline icon)
<Badge variant="secondary">
  <CheckIcon data-icon="inline-start" />
  Verified
</Badge>
```
