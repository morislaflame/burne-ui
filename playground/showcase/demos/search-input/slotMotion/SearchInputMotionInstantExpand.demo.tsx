import { SearchInput } from "@/components/core/SearchInput";

export function SearchInputMotionInstantExpandDemo() {
  return (
    <SearchInput
      aria-label="Instant expand"
      placeholder="Search…"
      motion={{
        root: { enter: false, leave: false },
        icon: { enter: false, leave: false },
      }}
    />
  );
}
