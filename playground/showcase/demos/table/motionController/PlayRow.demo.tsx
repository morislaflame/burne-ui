import { Table } from "@/components/core/Table";
import { Button } from "@/components/core/Button";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function TableMotionControllerPlayRowDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("row", "hoverIn")}>
          playSlot(row)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("row", "hoverOut")}>
          Reset
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("row", { y: 0 })}>
          Snap
        </Button>
      </div>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Crew">
            <Table.Header>
              <Table.Column isRowHeader>Name</Table.Column>
              <Table.Column>Role</Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row
                id="ada"
                motionController={controller}
                motion={{
                  hoverIn: { y: -6, duration: 0.22, replay: "rest" },
                  hoverOut: { y: 0, duration: 0.16 },
                }}
              >
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
