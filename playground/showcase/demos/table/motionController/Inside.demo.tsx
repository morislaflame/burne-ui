import { Table } from "@/components/core/Table";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "table:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function FooterPulse() {
  const controller = useMotionController();
  return (
    <Table.Footer onPointerEnter={() => controller.playSlot("footer", "table:nudge")}>
      Hover the footer
    </Table.Footer>
  );
}

export function TableMotionControllerInsideDemo() {
  return (
    <Table motion={{ events }}>
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
      <FooterPulse />
    </Table>
  );
}
