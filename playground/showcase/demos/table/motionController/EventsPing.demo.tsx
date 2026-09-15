import { Table } from "@/components/core/Table";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "table:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function TableMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("table:nudge")}>
        Nudge
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
