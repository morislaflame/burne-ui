import { SearchInput } from "@/components/core/SearchInput";

export function SearchInputSizesDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-small">
      <SearchInput size="small" aria-label="Small" placeholder="Small" />
      <SearchInput size="base" aria-label="Base" placeholder="Base" />
      <SearchInput size="mid" aria-label="Mid" placeholder="Mid" />
      <SearchInput size="large" aria-label="Large" placeholder="Large" />
    </div>
  );
}
