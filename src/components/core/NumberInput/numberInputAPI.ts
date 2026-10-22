import { isValidElement, type ReactNode } from "react";

const DRAFT = /^-?\d*\.?\d*$/;

/** Stable default so SSR and the browser format the same string. */
export const NUMBER_INPUT_LOCALE = "en";

export function numberInputLocale(locale?: string): string {
  const trimmed = locale?.trim();
  return trimmed ? trimmed : NUMBER_INPUT_LOCALE;
}

type NumberInputSeparators = { group: string; decimal: string; minus: string };

const separatorCache = new Map<string, NumberInputSeparators>();
const groupedFormatters = new Map<string, Intl.NumberFormat>();
const signedFormatters = new Map<string, Intl.NumberFormat>();
const displayFormatters = new Map<string, Intl.NumberFormat>();

function groupedFormatter(locale: string): Intl.NumberFormat {
  const hit = groupedFormatters.get(locale);
  if (hit) return hit;
  groupedFormatters.set(locale, new Intl.NumberFormat(locale, { useGrouping: true }));
  return groupedFormatters.get(locale)!;
}

function signedFormatter(locale: string): Intl.NumberFormat {
  const hit = signedFormatters.get(locale);
  if (hit) return hit;
  signedFormatters.set(locale, new Intl.NumberFormat(locale));
  return signedFormatters.get(locale)!;
}

/** Group, decimal, and minus signs from `Intl.NumberFormat#formatToParts`. */
export function numberInputSeparators(locale?: string): NumberInputSeparators {
  const key = numberInputLocale(locale);
  const cached = separatorCache.get(key);
  if (cached) return cached;
  const grouped = groupedFormatter(key).formatToParts(1000.1);
  const signed = signedFormatter(key).formatToParts(-1);
  const parts: NumberInputSeparators = {
    group: grouped.find((part) => part.type === "group")?.value ?? ",",
    decimal: grouped.find((part) => part.type === "decimal")?.value ?? ".",
    minus: signed.find((part) => part.type === "minusSign")?.value ?? "-",
  };
  separatorCache.set(key, parts);
  return parts;
}

export function normalizeNumberInputRaw(raw: string, locale?: string): string {
  const { group, decimal, minus } = numberInputSeparators(locale);
  let next = raw.trim();
  if (group) next = next.split(group).join("");
  if (decimal !== ".") next = next.split(decimal).join(".");
  if (minus !== "-") next = next.split(minus).join("-");
  return next;
}

export function numberInputStep(step: number | undefined): number {
  return step != null && Number.isFinite(step) && step > 0 ? step : 1;
}

export function numberInputPrecision(step: number): number {
  const safe = numberInputStep(step);
  const text = String(safe);
  const exp = text.match(/e-(\d+)$/i);
  if (exp) return Number(exp[1]);
  const dot = text.indexOf(".");
  return dot === -1 ? 0 : text.length - dot - 1;
}

export function roundNumberInput(value: number, step: number): number {
  const places = numberInputPrecision(step);
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

export function clampNumberInput(value: number, min?: number, max?: number): number {
  let next = value;
  if (min != null && Number.isFinite(min) && next < min) next = min;
  if (max != null && Number.isFinite(max) && next > max) next = max;
  return next;
}

/** Nearest value on the step grid. The grid starts at `min`, or at 0. */
export function snapNumberInput(value: number, step: number, min?: number, max?: number): number {
  const safe = numberInputStep(step);
  const origin = min != null && Number.isFinite(min) ? min : 0;
  const steps = Math.round((value - origin) / safe);
  const snapped = roundNumberInput(origin + steps * safe, safe);
  return clampNumberInput(snapped, min, max);
}

export function stepNumberInput(
  current: number | null,
  direction: 1 | -1,
  step: number,
  min?: number,
  max?: number,
): number {
  const safe = numberInputStep(step);
  if (current == null) {
    const start = direction > 0 ? (min ?? 0) : (max ?? 0);
    return snapNumberInput(start, safe, min, max);
  }
  return snapNumberInput(current + direction * safe, safe, min, max);
}

export function numberInputCanStep(
  current: number | null,
  direction: 1 | -1,
  min?: number,
  max?: number,
): boolean {
  if (current == null) return true;
  if (direction < 0 && min != null && current <= min) return false;
  if (direction > 0 && max != null && current >= max) return false;
  return true;
}

export function isNumberInputDraft(raw: string, locale?: string): boolean {
  if (raw === "") return true;
  const { group, decimal, minus } = numberInputSeparators(locale);
  for (const char of raw.trim()) {
    const digit = char >= "0" && char <= "9";
    if (!digit && char !== group && char !== decimal && char !== minus && char !== "-" && char !== ".") {
      return false;
    }
  }
  const normalized = normalizeNumberInputRaw(raw, locale);
  return normalized === "" || DRAFT.test(normalized);
}

function isIncompleteNumber(raw: string, locale?: string): boolean {
  const { decimal, minus } = numberInputSeparators(locale);
  return (
    raw === minus ||
    raw === "-" ||
    raw === decimal ||
    raw === "." ||
    raw === `${minus}${decimal}` ||
    raw === `${minus}.` ||
    raw === `-${decimal}` ||
    raw === "-."
  );
}

/** `null` is empty, `undefined` is incomplete or rejected, a number is complete. */
export function parseNumberInputComplete(raw: string, locale?: string): number | null | undefined {
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  if (isIncompleteNumber(trimmed, locale)) return undefined;
  if (!isNumberInputDraft(trimmed, locale)) return undefined;
  const normalized = normalizeNumberInputRaw(trimmed, locale);
  if (!DRAFT.test(normalized) || isIncompleteNumber(normalized, "en")) return undefined;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : undefined;
}

/** Plain editable text: no grouping, locale decimal separator. */
export function numberInputEditText(value: number, locale?: string): string {
  const rounded = Math.round(value * 1e10) / 1e10;
  const text = String(rounded);
  const { decimal } = numberInputSeparators(locale);
  return decimal === "." ? text : text.replace(".", decimal);
}

export function formatNumberInput(
  value: number | null,
  formatOptions?: Intl.NumberFormatOptions,
  locale?: string,
): string {
  if (value == null || !Number.isFinite(value)) return "";
  if (!formatOptions) return numberInputEditText(value, locale);
  const localeKey = numberInputLocale(locale);
  const key = `${localeKey}\0${JSON.stringify(formatOptions)}`;
  const hit = displayFormatters.get(key);
  if (hit) return hit.format(value);
  displayFormatters.set(key, new Intl.NumberFormat(localeKey, formatOptions));
  return displayFormatters.get(key)!.format(value);
}

export function parseFormNumber(raw: unknown): number | null {
  if (raw == null || raw === "") return null;
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : null;
  if (typeof raw === "string") {
    const parsed = parseNumberInputComplete(raw.trim());
    return typeof parsed === "number" ? parsed : null;
  }
  return null;
}

const SHELL_PARTS = new Set([
  "NumberInputDecrement",
  "NumberInputControl",
  "NumberInputIncrement",
]);

export function isNumberInputShellElement(node: ReactNode): boolean {
  if (!isValidElement(node)) return false;
  const name = (node.type as { displayName?: string }).displayName;
  return name != null && SHELL_PARTS.has(name);
}
