import { useCallback, useState } from "react";

import type { ClassValue } from "clsx";

import { cn } from "@/utils/cn";

export function mergeToggleButtonSlotClass(...parts: ClassValue[]): string {
  return cn(...parts);
}

export function useMergedPressed(
  pressed: boolean | undefined,
  defaultPressed: boolean | undefined,
): [boolean, (next: boolean) => void, boolean] {
  const isControlled = pressed !== undefined;
  const [internal, setInternal] = useState(Boolean(defaultPressed));
  const value = isControlled ? Boolean(pressed) : internal;
  const setValue = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternal(next);
    },
    [isControlled],
  );
  return [value, setValue, isControlled];
}
