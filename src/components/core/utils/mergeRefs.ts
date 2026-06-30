import type { ForwardedRef } from "react";

/**
 * Writes `node` into a React forwarded ref (callback or object form).
 */
export function mergeForwardedRef<T>(ref: ForwardedRef<T>, node: T | null): void {
  if (typeof ref === "function") ref(node);
  else if (ref) ref.current = node;
}
