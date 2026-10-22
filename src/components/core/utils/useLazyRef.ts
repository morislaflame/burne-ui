import { useRef, type RefObject } from "react";

/**
 * Stable ref filled on the first render.
 * `useRef(init())` would run `init` on every render and throw the value away.
 */
export function useLazyRef<T>(init: () => T): RefObject<T> {
  const ref = useRef<T | null>(null);
  if (ref.current === null) {
    ref.current = init();
  }
  return ref as RefObject<T>;
}
