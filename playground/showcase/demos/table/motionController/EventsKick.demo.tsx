import { Table } from "@/components/core/Table";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "table:scan": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { y: -4, duration: 0.16, ease: "power2.out" }, 0);
    if (ctx.targets.header) {
      tl.fromRest(ctx.targets.header, { y: -8, duration: 0.18 }, 0);
    }
    if (ctx.targets.body) {
      tl.fromRest(ctx.targets.body, { y: -10, duration: 0.18 }, 0.04);
    }
    tl.to(ctx.el, { y: 0, duration: 0.24, ease: "power2.inOut" }, 0.22);
    if (ctx.targets.header) {
      tl.to(ctx.targets.header, { y: 0, duration: 0.22 }, 0.22);
    }
    if (ctx.targets.body) {
      tl.to(ctx.targets.body, { y: 0, duration: 0.22 }, 0.22);
    }
    return tl;
  },
});

export function TableMotionEventsKickDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("table:scan")}>
        Scan
      </Button>
      <Table motionController={controller} motion={{ events }}>
        <Table.ScrollContainer>
          <Table.Content aria-label="Crew">
            <Table.Header>
              <Table.Column isRowHeader>Name</Table.Column>
              <Table.Column>Role</Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row id="ada">
                <Table.Cell>Ada</Table.Cell>
                <Table.Cell>Eng</Table.Cell>
              </Table.Row>
              <Table.Row id="lin">
                <Table.Cell>Lin</Table.Cell>
                <Table.Cell>Design</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  );
}
