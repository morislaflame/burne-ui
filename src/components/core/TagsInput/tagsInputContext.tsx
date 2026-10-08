import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";

import { createMotionScope } from "@/components/core/utils/slotMotion";

import type { TagsInputClassNames, TagsInputContextValue } from "./tagsInputTypes";

const TagsInputContext = createContext<TagsInputContextValue | null>(null);
const TagsInputClassNamesContext = createContext<TagsInputClassNames>({});

export function TagsInputProvider({
  value,
  children,
}: {
  value: TagsInputContextValue;
  children: ReactNode;
}) {
  return <TagsInputContext.Provider value={value}>{children}</TagsInputContext.Provider>;
}

export function useTagsInputContext(): TagsInputContextValue {
  const value = useContext(TagsInputContext);
  if (!value) throw new Error("TagsInput parts must be rendered inside TagsInput.");
  return value;
}

export function TagsInputClassNamesProvider({
  classNames,
  children,
}: {
  classNames?: Prettify<TagsInputClassNames>;
  children: ReactNode;
}) {
  const parent = useContext(TagsInputClassNamesContext);
  const merged = useMemo(() => ({ ...parent, ...classNames }), [classNames, parent]);
  return (
    <TagsInputClassNamesContext.Provider value={merged}>{children}</TagsInputClassNamesContext.Provider>
  );
}

export function useTagsInputClassNames(): TagsInputClassNames {
  return useContext(TagsInputClassNamesContext);
}

/** Scope only. Defaults and host play live in `tagsInputAnimations.ts`. */
export const {
  MotionScopeProvider: TagsInputMotionProvider,
  useMotionScope: useTagsInputMotionScope,
  useOptionalMotionScope: useOptionalTagsInputMotionScope,
} = createMotionScope("TagsInput");
