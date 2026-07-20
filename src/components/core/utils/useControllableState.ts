import { useCallback, useState } from "react";

export type UseControllableStateParams<T> = {
  value?: T;
  defaultValue: T | (() => T);
  onChange?: (next: T) => void;
};

/**
 * Controlled/uncontrolled state: when `value` is defined the hook is controlled
 * and only notifies via `onChange`; otherwise it owns internal state.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateParams<T>): [T, (next: T) => void, boolean] {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const current = isControlled ? (value as T) : internal;
  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );
  return [current, setValue, isControlled];
}
