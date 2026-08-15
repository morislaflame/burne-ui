import { useState } from "react";

import gsap from "gsap";

import { Pagination } from "@/components/core/Pagination";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

const TL = { overwrite: "auto" as const, force3D: false };

export function PaginationMotionNavTintDemo() {
  const [page, setPage] = useState(5);

  return (
    <Pagination page={page} totalPages={12} onPageChange={setPage}>
      <Pagination.Summary>Page {page} of 12</Pagination.Summary>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous
            motion={{
              hoverIn: (ctx) => {
                const tl = gsap.timeline({ ...TL });
                tl.to(ctx.el, { x: -2, duration: 0.16 }, 0);
                tweenCssColor(ctx.el, "var(--color-primary)");
                return tl;
              },
              hoverOut: (ctx) => {
                const tl = gsap.timeline({ ...TL });
                tl.to(ctx.el, { x: 0, duration: 0.14 }, 0);
                tweenCssColor(ctx.el, "var(--color-foreground)", { clearOnComplete: true });
                return tl;
              },
            }}
          />
        </Pagination.Item>
        <Pagination.Pages />
        <Pagination.Item>
          <Pagination.Next
            motion={{
              pressIn: (ctx) =>
                gsap.to(ctx.el, { x: 4, scale: 0.92, duration: 0.16, ease: "back.out(1.8)", ...TL }),
              pressOut: (ctx) =>
                gsap.to(ctx.el, { x: 0, scale: 1, duration: 0.18, ease: "power2.inOut", ...TL }),
            }}
          />
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
