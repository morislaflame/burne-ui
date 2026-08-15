import gsap from "gsap";

import { SearchInput } from "@/components/core/SearchInput";

const TL = { overwrite: "auto" as const, force3D: false };

export function SearchInputMotionHoverTiltDemo() {
  return (
    <SearchInput
      aria-label="Hover tilt"
      placeholder="Search…"
      motion={{
        root: {
          hoverIn: (ctx) =>
            gsap.to(ctx.el, { rotation: -10, y: -3, duration: 0.22, ease: "power2.out", ...TL }),
          hoverOut: (ctx) =>
            gsap.to(ctx.el, { rotation: 0, y: 0, duration: 0.18, ease: "power2.out", ...TL }),
        },
      }}
    />
  );
}
