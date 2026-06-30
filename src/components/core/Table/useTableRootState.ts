import type { UseTableRootStateProps } from "./tableTypes";

export function useTableRootState({ variant = "default" }: UseTableRootStateProps) {
  const isGloss = variant === "gloss";

  return { variant, isGloss };
}
