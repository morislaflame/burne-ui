import { isValidElement, type ReactNode } from "react";

const DRAFT = /^-?\d*\.?\d*$/;

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

export function isNumberInputDraft(raw: string): boolean {
  return raw === "" || DRAFT.test(raw);
}

/** `null` is empty, `undefined` is incomplete or rejected, a number is complete. */
export function parseNumberInputComplete(raw: string): number | null | undefined {
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  if (trimmed === "-" || trimmed === "." || trimmed === "-.") return undefined;
  if (!DRAFT.test(trimmed)) return undefined;
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : undefined;
}

export function formatNumberInput(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return "";
  const rounded = Math.round(value * 1e10) / 1e10;
  return String(rounded);
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
