/**
 * Метаданные слоя токенов. Значения задаются в `./styles.css`,
 * утилиты Tailwind — в `src/styles.css` (`@theme`, `@utility`).
 *
 * Кастомизация:
 * - `--space` — отступы (gap, padding); ступени `gap-*`, `p-*` через множители.
 * - `--size` — размеры контролов (иконки, индикаторы, min-width кнопок, max-w модалок).
 * - `--radius` — базовый радиус; ступени `rounded-*` через множители.
 * - `--text-scale-*` — примитивная типографика; роли `text-base`, `text-large` — алиасы.
 */
export const tokensConfig = {
  /** Пространство имён для документации */
  namespace: "burne" as const,
  tailwindBridge: {
    "font-sans": "font-family-sans",
    "font-mono": "font-family-mono",
    "spacing-xsmall": "space-xsmall",
    "spacing-small": "space-small",
    "spacing-base": "space-base",
    "spacing-plus": "space-plus",
    "spacing-mid": "space-mid",
    "spacing-large": "space-large",
    "spacing-xlarge": "space-xlarge",
    "radius-xsmall": "radius-value-xsmall",
    "radius-small": "radius-value-small",
    "radius-base": "radius-value-base",
    "radius-mid": "radius-value-mid",
    "radius-large": "radius-value-large",
    "color-background": "color-background",
    "color-foreground": "color-foreground",
    "color-muted": "color-muted",
    "color-surface": "color-surface",
    "border-base": "color-border",
    "color-accent": "color-accent",
    "color-accent-foreground": "color-accent-foreground",
    "color-accent-fill-hover": "color-accent-fill-hover",
    "color-accent-solid-hover": "color-accent-solid-hover",
    "color-secondary-fill-hover": "color-secondary-fill-hover",
    "color-converge-ripple-accent-fill": "color-converge-ripple-accent-fill",
    "color-converge-ripple-accent-soft": "color-converge-ripple-accent-soft",
    "color-converge-ripple-accent-muted": "color-converge-ripple-accent-muted",
    "color-converge-ripple-danger": "color-converge-ripple-danger",
    "color-converge-ripple-info": "color-converge-ripple-info",
    "color-converge-ripple-success": "color-converge-ripple-success",
    "color-converge-ripple-secondary": "color-converge-ripple-secondary",
    "color-converge-ripple-warning": "color-converge-ripple-warning",
    "color-danger": "color-danger",
    "color-danger-foreground": "color-danger-foreground",
    "color-danger-fill-hover": "color-danger-fill-hover",
    "color-success": "color-success",
    "color-success-foreground": "color-success-foreground",
    "color-success-fill-hover": "color-success-fill-hover",
    "color-info": "color-info",
    "color-info-foreground": "color-info-foreground",
    "color-info-fill-hover": "color-info-fill-hover",
    "color-warning": "color-warning",
    "color-warning-foreground": "color-warning-foreground",
    "color-warning-fill-hover": "color-warning-fill-hover",
    "color-surface-tint-danger": "color-surface-tint-danger",
    "color-surface-tint-success": "color-surface-tint-success",
    "color-surface-tint-info": "color-surface-tint-info",
    "color-surface-tint-warning": "color-surface-tint-warning",
    "color-surface-tint-accent": "color-surface-tint-accent",
    "color-surface-tint-danger-strong": "color-surface-tint-danger-strong",
    "color-surface-tint-success-strong": "color-surface-tint-success-strong",
    "color-surface-tint-warning-strong": "color-surface-tint-warning-strong",
    "icon-xsmall": "icon-size-xsmall",
    "icon-small": "icon-size-small",
    "icon-base": "icon-size-base",
    "icon-mid": "icon-size-mid",
    "icon-large": "icon-size-large",
    "icon-xlarge": "icon-size-xlarge",
    "icon-2xlarge": "icon-size-2xlarge",
  },
} as const;

export type TokensConfig = typeof tokensConfig;
