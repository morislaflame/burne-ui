import { useState } from "react";

import gsap from "gsap";

import { Pagination } from "@/components/core/Pagination";

const TL = { overwrite: "auto" as const, force3D: false };

export function PaginationMotionControlWaveDemo() {
  const [page, setPage] = useState(4);

  return (
    <Pagination
      page={page}
      totalPages={12}
      onPageChange={setPage}
      motion={{
        control: {
          pressIn: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { y: 2, scale: 0.94, duration: 0.1 }, 0);
            const kids = ctx.el.querySelectorAll("svg, span");
            if (kids.length) {
              tl.to(kids, { y: -3, stagger: 0.04, duration: 0.14 }, 0.04);
            }
            return tl;
          },
          pressOut: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { y: 0, scale: 1, duration: 0.16 }, 0);
            const kids = ctx.el.querySelectorAll("svg, span");
            if (kids.length) {
              tl.to(kids, { y: 0, duration: 0.14 }, 0);
            }
            return tl;
          },
        },
      }}
    >
      <Pagination.Summary>Page {page} of 12</Pagination.Summary>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous />
        </Pagination.Item>
        <Pagination.Pages />
        <Pagination.Item>
          <Pagination.Next />
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
