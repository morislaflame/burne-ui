/** Парсинг и сборка `color-mix` для primary-tint в playground. */

export type TintMixMode = "primary-transparent" | "primary-surface" | "color-surface" | "custom";

export type ParsedTint = {
  mode: TintMixMode;
  percent: number;
  mixColor: string;
  custom: string;
};

const RE_PRIMARY_TRANSPARENT =
  /^color-mix\(\s*in\s+oklab\s*,\s*var\(--color-primary\)\s+(\d+(?:\.\d+)?)%\s*,\s*transparent\s*\)$/i;

const RE_PRIMARY_SURFACE =
  /^color-mix\(\s*in\s+oklab\s*,\s*var\(--color-primary\)\s+(\d+(?:\.\d+)?)%\s*,\s*var\(--color-surface\)\s*\)$/i;

const RE_COLOR_SURFACE =
  /^color-mix\(\s*in\s+oklab\s*,\s*(#[0-9a-f]{6}|var\(--[a-z0-9-]+\))\s+(\d+(?:\.\d+)?)%\s*,\s*var\(--color-surface\)\s*\)$/i;

export function parseTintValue(value: string): ParsedTint {
  const trimmed = value.trim();

  let m = RE_PRIMARY_TRANSPARENT.exec(trimmed);
  if (m) {
    return {
      mode: "primary-transparent",
      percent: Number(m[1]),
      mixColor: "#4361ee",
      custom: trimmed,
    };
  }

  m = RE_PRIMARY_SURFACE.exec(trimmed);
  if (m) {
    return {
      mode: "primary-surface",
      percent: Number(m[1]),
      mixColor: "#4361ee",
      custom: trimmed,
    };
  }

  m = RE_COLOR_SURFACE.exec(trimmed);
  if (m) {
    return {
      mode: "color-surface",
      percent: Number(m[2]),
      mixColor: m[1],
      custom: trimmed,
    };
  }

  return {
    mode: "custom",
    percent: 10,
    mixColor: "#4361ee",
    custom: trimmed,
  };
}

export function buildTintValue(parsed: ParsedTint): string {
  if (parsed.mode === "custom") {
    return parsed.custom.trim();
  }

  const pct = Math.min(100, Math.max(0, parsed.percent));

  if (parsed.mode === "primary-transparent") {
    return `color-mix(in oklab, var(--color-primary) ${pct}%, transparent)`;
  }

  if (parsed.mode === "primary-surface") {
    return `color-mix(in oklab, var(--color-primary) ${pct}%, var(--color-surface))`;
  }

  const color = /^#[0-9a-f]{6}$/i.test(parsed.mixColor) ? parsed.mixColor : "#4361ee";
  return `color-mix(in oklab, ${color} ${pct}%, var(--color-surface))`;
}

export const TINT_MIX_MODE_LABELS: Record<TintMixMode, string> = {
  "primary-transparent": "mix(--color-primary, transparent)",
  "primary-surface": "mix(--color-primary, --color-surface)",
  "color-surface": "mix(color, --color-surface)",
  custom: "custom CSS",
};
