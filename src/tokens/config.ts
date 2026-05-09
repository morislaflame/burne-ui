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
    "color-b-destructive": "color-destructive",
    "color-b-destructive-fg": "color-destructive-foreground",
    "radius-b-sm": "radius-sm",
    "radius-b-md": "radius-md",
  },
} as const;

export type TokensConfig = typeof tokensConfig;
