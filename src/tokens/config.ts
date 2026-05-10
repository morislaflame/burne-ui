/**
 * Конфиг слоя токенов. Значения задаются в `./styles.css`;
 * здесь — метаданные для кода, доков и будущих генераторов.
 *
 * Раскладка: инсеты `--brn-inset-*`, зазор заголовок/подзаголовок `--brn-heading-stack-gap-*`,
 * утилиты `.brn-inset-{s,md,l,xl}`, `.brn-title-subtitle-stack{-s,-md,,-lg,-xl}`.
 */
export const tokensConfig = {
  /** Префикс CSS custom properties: `--${namespace}-*` */
  namespace: "brn" as const,
  /**
   * Соответствие utility-ключей Tailwind (`@theme` в `src/styles.css`)
   * и суффиксов переменных после `--brn-`.
   */
  tailwindBridge: {
    "font-sans": "font-sans",
    "font-mono": "font-mono",
    "color-brn-bg": "color-bg",
    "color-brn-surface": "color-surface",
    "color-brn-border": "color-border",
    "color-brn-text": "color-text",
    "color-brn-muted": "color-text-muted",
    "color-brn-accent": "color-accent",
    "color-brn-accent-fg": "color-accent-foreground",
    "color-brn-danger": "color-danger",
    "color-brn-danger-fg": "color-danger-foreground",
    "color-brn-success": "color-success",
    "color-brn-success-fg": "color-success-foreground",
    "color-brn-info": "color-info",
    "color-brn-info-fg": "color-info-foreground",
    "color-brn-warning": "color-warning",
    "color-brn-warning-fg": "color-warning-foreground",
    "color-brn-surface-tint-danger": "surface-tint-danger",
    "color-brn-surface-tint-success": "surface-tint-success",
    "color-brn-surface-tint-info": "surface-tint-info",
    "color-brn-surface-tint-warning": "surface-tint-warning",
    "color-brn-surface-tint-accent": "surface-tint-accent",
    "color-brn-surface-tint-danger-strong": "surface-tint-danger-strong",
    "color-brn-surface-tint-success-strong": "surface-tint-success-strong",
    "color-brn-surface-tint-warning-strong": "surface-tint-warning-strong",
    "radius-brn-sm": "radius-sm",
    "radius-brn-md": "radius-md",
  },
} as const;

export type TokensConfig = typeof tokensConfig;
