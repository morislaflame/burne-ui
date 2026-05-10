/**
 * Конфиг слоя токенов. Значения задаются в `./styles.css`;
 * здесь — метаданные для кода, доков и будущих генераторов.
 */
export const tokensConfig = {
  /** Префикс CSS custom properties: `--${namespace}-*` */
  namespace: "b" as const,
  /**
   * Соответствие utility-ключей Tailwind (`@theme` в `src/styles.css`)
   * и суффиксов переменных после `--b-`.
   */
  tailwindBridge: {
    "font-sans": "font-sans",
    "font-mono": "font-mono",
    "color-b-bg": "color-bg",
    "color-b-surface": "color-surface",
    "color-b-border": "color-border",
    "color-b-text": "color-text",
    "color-b-muted": "color-text-muted",
    "color-b-accent": "color-accent",
    "color-b-accent-fg": "color-accent-foreground",
    "color-b-danger": "color-danger",
    "color-b-danger-fg": "color-danger-foreground",
    "color-b-success": "color-success",
    "color-b-success-fg": "color-success-foreground",
    "color-b-info": "color-info",
    "color-b-info-fg": "color-info-foreground",
    "color-b-warning": "color-warning",
    "color-b-warning-fg": "color-warning-foreground",
    "color-b-surface-tint-danger": "surface-tint-danger",
    "color-b-surface-tint-success": "surface-tint-success",
    "color-b-surface-tint-info": "surface-tint-info",
    "color-b-surface-tint-warning": "surface-tint-warning",
    "color-b-surface-tint-accent": "surface-tint-accent",
    "color-b-surface-tint-danger-strong": "surface-tint-danger-strong",
    "color-b-surface-tint-success-strong": "surface-tint-success-strong",
    "color-b-surface-tint-warning-strong": "surface-tint-warning-strong",
    "radius-b-sm": "radius-sm",
    "radius-b-md": "radius-md",
  },
} as const;

export type TokensConfig = typeof tokensConfig;
