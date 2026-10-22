export function renderSkinStylesheet(skin: {
  name: string;
  tokens?: Record<string, string>;
  tokensLight?: Record<string, string>;
  tokensDark?: Record<string, string>;
}): string;
