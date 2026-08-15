import gsap from "gsap";

import { Table } from "@/components/core/Table";

const TL = { overwrite: "auto" as const, force3D: false };

export function TableMotionRootWaveDemo() {
  return (
    <Table
      motion={{
        root: {
          enter: (ctx) =>
            gsap.fromTo(ctx.el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.32, ...TL }),
        },
        content: {
          enter: (ctx) => gsap.fromTo(ctx.el, { y: 6 }, { y: 0, duration: 0.24, ...TL }),
        },
      }}
    >
      <Table.Content aria-label="Wave">
        <Table.Header>
          <Table.Column isRowHeader>Name</Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Ada</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Content>
    </Table>
  );
}
