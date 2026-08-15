import gsap from "gsap";

import { SearchInput } from "@/components/core/SearchInput";

const TL = { overwrite: "auto" as const, force3D: false };

export function SearchInputMotionPressBounceDemo() {
  return (
    <SearchInput
      aria-label="Press bounce"
      placeholder="Search…"
      motion={{
        root: {
          pressIn: (ctx) =>
            gsap.to(ctx.el, {
              scale: 0.88,
              duration: 0.12,
              yoyo: true,
              repeat: 1,
              ease: "power2.inOut",
              ...TL,
            }),
        },
      }}
    />
  );
}
