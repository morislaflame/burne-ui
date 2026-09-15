import { Table } from "@/components/core/Table";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "table:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "table:nudge": false });

export function TableMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("table:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("table:nudge")}>
          Off nudge
        </Button>
      </div>
      <Table motionController={liveController} motion={{ events: live }}>
        <Table.ScrollContainer>
          <Table.Content aria-label="Live">
            <Table.Header>
              <Table.Column isRowHeader>Live</Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row id="a">
                <Table.Cell>Events play</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      <Table motionController={offController} motion={{ events: off }}>
        <Table.ScrollContainer>
          <Table.Content aria-label="Off">
            <Table.Header>
              <Table.Column isRowHeader>Off</Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row id="b">
                <Table.Cell>events: false skips</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  );
}
