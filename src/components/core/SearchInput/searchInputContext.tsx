import { createMotionScope } from "@/components/core/utils/slotMotion";

/** Scope only. Defaults and host play live in `searchInputAnimations.ts`. */
export const {
  MotionScopeProvider: SearchInputMotionProvider,
  useMotionScope: useSearchInputMotionScope,
  useOptionalMotionScope: useOptionalSearchInputMotionScope,
} = createMotionScope("SearchInput");
