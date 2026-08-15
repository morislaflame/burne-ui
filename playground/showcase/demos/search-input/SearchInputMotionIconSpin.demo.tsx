import gsap from "gsap";

import { SearchInput } from "@/components/core/SearchInput";

const TL = { overwrite: "auto" as const, force3D: false };

export function SearchInputMotionIconSpinDemo() {
  return (
    <SearchInput
      aria-label="Icon spin"
      placeholder="Search…"
      motion={{
        icon: {
          enter: (ctx) =>
            gsap.to(ctx.el, { rotation: 360, duration: 0.45, ease: "power2.out", ...TL }),
          leave: (ctx) =>
            gsap.to(ctx.el, { rotation: 0, duration: 0.28, ease: "power2.inOut", ...TL }),
        },
      }}
    />
  );
}
