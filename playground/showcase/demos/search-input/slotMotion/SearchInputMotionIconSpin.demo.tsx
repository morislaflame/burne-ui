import { SearchInput } from "@/components/core/SearchInput";

export function SearchInputMotionIconSpinDemo() {
  return (
    <SearchInput
      aria-label="Icon spin"
      placeholder="Search…"
      motion={{
        icon: {
          enter: (ctx) =>
            ctx.to({ rotation: 360, duration: 0.45, ease: "power2.out" }),
          leave: (ctx) =>
            ctx.to({ rotation: 0, duration: 0.28, ease: "power2.inOut" }),
        },
      }}
    />
  );
}
