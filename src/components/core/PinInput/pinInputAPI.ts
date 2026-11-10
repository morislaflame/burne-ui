import type { PinInputType } from "./pinInputTypes";

export const PIN_INPUT_LENGTH_DEFAULT = 6;
export const PIN_INPUT_LENGTH_MAX = 12;

export function pinInputLength(length: number | undefined): number {
  if (length == null || !Number.isFinite(length)) return PIN_INPUT_LENGTH_DEFAULT;
  return Math.min(PIN_INPUT_LENGTH_MAX, Math.max(1, Math.trunc(length)));
}

export function pinInputChars(value: string, length: number): string[] {
  const chars = [...value].slice(0, length);
  while (chars.length < length) chars.push("");
  return chars;
}

export function pinInputChar(raw: string, type: PinInputType): string {
  const char = [...raw].pop() ?? "";
  if (!char || /\s/.test(char)) return "";
  if (type === "number") return /^\d$/.test(char) ? char : "";
  return /^[\p{L}\p{N}]$/u.test(char) ? char : "";
}

/** Replace `index`, or append when `index` is the first empty cell. The tail after a replaced cell stays. */
export function pinInputInsert(value: string, index: number, char: string, length: number): string {
  const at = Math.min(Math.max(0, index), value.length, length - 1);
  const chars = [...value];
  chars[at] = char;
  return chars.join("").slice(0, length);
}

export function pinInputDelete(value: string, index: number): { value: string; focus: number } {
  if (!value) return { value: "", focus: 0 };
  const at = index >= value.length ? value.length - 1 : index;
  const chars = [...value];
  chars.splice(at, 1);
  return { value: chars.join(""), focus: Math.max(0, at) };
}

export function pinInputPaste(
  value: string,
  index: number,
  text: string,
  type: PinInputType,
  length: number,
): { value: string; focus: number } {
  const incoming = [...text].map((char) => pinInputChar(char, type)).filter(Boolean);
  let next = value;
  let at = Math.min(index, next.length);
  for (const char of incoming) {
    if (at >= length) break;
    next = pinInputInsert(next, at, char, length);
    at += 1;
  }
  return { value: next, focus: Math.min(at, length - 1) };
}

export function pinInputSeparatorIndex(length: number): number {
  return Math.ceil(length / 2) - 1;
}

export type PinInputKeyAction =
  | { type: "move"; index: number }
  | { type: "delete" }
  | { type: "none" };

export function pinInputKeyAction(
  key: string,
  index: number,
  length: number,
  value: string,
): PinInputKeyAction {
  if (key === "ArrowLeft") return { type: "move", index: Math.max(0, index - 1) };
  if (key === "ArrowRight") return { type: "move", index: Math.min(length - 1, index + 1) };
  if (key === "Home") return { type: "move", index: 0 };
  if (key === "End") return { type: "move", index: Math.min(value.length, length - 1) };
  if (key === "Backspace") return { type: "delete" };
  return { type: "none" };
}
