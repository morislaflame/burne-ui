import type { ForwardedRef, Ref } from "react";

/**
 * Writes `node` into a React forwarded ref (callback or object form).
 */
export function mergeForwardedRef<T>(ref: ForwardedRef<T>, node: T | null): void {
  if (typeof ref === "function") ref(node);
  else if (ref) ref.current = node;
}

/**
 * Returns a callback ref that assigns `node` to every provided ref.
 */
export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (ref == null) continue;
      mergeForwardedRef(ref, node);
    }
  };
}
