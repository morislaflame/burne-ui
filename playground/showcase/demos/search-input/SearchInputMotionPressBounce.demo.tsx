import { SearchInput } from "@/components/core/SearchInput";

export function SearchInputMotionPressBounceDemo() {
  return (
    <SearchInput
      aria-label="Press bounce"
      placeholder="Search…"
      motion={{
        root: {
          pressIn: {
            scale: 0.88,
            duration: 0.12,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
          },
        },
      }}
    />
  );
}
