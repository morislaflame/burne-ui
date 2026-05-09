export { tokensConfig, type TokensConfig } from "./config";

/** Имена токенов для типобезопасного доступа в коде и документации */
export const bTokenNames = [
  "--b-color-bg",
  "--b-color-surface",
  "--b-color-border",
  "--b-color-text",
  "--b-color-text-muted",
  "--b-color-accent",
  "--b-color-accent-foreground",
  "--b-color-destructive",
  "--b-color-destructive-foreground",
  "--b-font-sans",
  "--b-font-mono",
  "--b-text-sm",
  "--b-text-base",
  "--b-leading-normal",
  "--b-space-1",
  "--b-space-2",
  "--b-space-3",
  "--b-space-4",
  "--b-radius-sm",
  "--b-radius-md",
  "--b-ease-out",
  "--b-duration-fast",
  "--b-duration-normal",
  "--b-glass-blur",
  "--b-glass-blur-edge",
  "--b-glass-saturate",
  "--b-glass-tint",
  "--b-glass-tint-veil",
  "--b-glass-border",
  "--b-glass-highlight",
  "--b-glass-edge-falloff",
] as const;

export type BCssVar = (typeof bTokenNames)[number];
