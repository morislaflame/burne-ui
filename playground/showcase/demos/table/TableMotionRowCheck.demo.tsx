import gsap from "gsap";

import { Table } from "@/components/core/Table";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

const TL = { overwrite: "auto" as const, force3D: false };

export function TableMotionRowCheckDemo() {
  return (
    <Table
      motion={{
        row: {
          check: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { y: -2, duration: 0.12 }, 0);
            tl.to(ctx.el, { y: 0, duration: 0.14 }, 0.12);
            tweenCssColor(ctx.el, "var(--color-primary)");
            return tl;
          },
          uncheck: (ctx) =>
            tweenCssColor(ctx.el, "var(--color-foreground)", { clearOnComplete: true }),
        },
      }}
    >
      <Table.Content aria-label="Select" selectionMode="single">
        <Table.Header>
          <Table.Column isRowHeader>Name</Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row id="ada">
            <Table.Cell>Ada</Table.Cell>
          </Table.Row>
          <Table.Row id="grace">
            <Table.Cell>Grace</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Content>
    </Table>
  );
}
