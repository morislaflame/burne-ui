import { Table } from "@/components/core/Table";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

export function TableMotionColumnLabelDemo() {
  return (
    <Table
      className="max-w-xl"
      motion={{
        label: {
          enter: (ctx) =>
            ctx.fromTo({ y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.26 }),
          hoverIn: (ctx) => tweenCssColor(ctx.el, "var(--color-primary)", { duration: 0.2 }),
          hoverOut: (ctx) =>
            tweenCssColor(ctx.el, "var(--color-foreground)", {
              duration: 0.18,
              clearOnComplete: true,
            }),
        },
      }}
    >
      <Table.Content aria-label="Column labels">
        <Table.Header>
          <Table.Column isRowHeader>
            <Table.Label>Name</Table.Label>
          </Table.Column>
          <Table.Column>
            <Table.Label>Role</Table.Label>
          </Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row id="ada">
            <Table.Cell>Ada</Table.Cell>
            <Table.Cell>Engineer</Table.Cell>
          </Table.Row>
          <Table.Row id="grace">
            <Table.Cell>Grace</Table.Cell>
            <Table.Cell>Architect</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Content>
    </Table>
  );
}
