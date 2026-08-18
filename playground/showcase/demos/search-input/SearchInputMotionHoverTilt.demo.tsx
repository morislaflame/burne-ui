import { SearchInput } from "@/components/core/SearchInput";

export function SearchInputMotionHoverTiltDemo() {
  return (
    <SearchInput
      aria-label="Hover tilt"
      placeholder="Search…"
      motion={{
        root: {
          hoverIn: (ctx) =>
            ctx.to({ rotation: -10, y: -3, duration: 0.22, ease: "power2.out" }),
          hoverOut: (ctx) =>
            ctx.to({ rotation: 0, y: 0, duration: 0.18, ease: "power2.out" }),
        },
      }}
    />
  );
}
