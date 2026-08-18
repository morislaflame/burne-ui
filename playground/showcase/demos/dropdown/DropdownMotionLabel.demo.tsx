import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";

export function DropdownMotionLabelDemo() {
  return (
    <Dropdown
      motion={{
        label: {
          enter: (ctx) =>
            ctx.fromTo(
              { y: 6, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.22, delay: 0.04 },
            ),
        },
        subTrigger: {
          enter: (ctx) =>
            ctx.fromTo(
              { x: -8, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.24, delay: 0.08 },
            ),
        },
      }}
    >
      <Dropdown.Trigger asChild>
        <Button variant="outline" type="button">
          Label + SubTrigger
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <Dropdown.Group>
          <Dropdown.Label>Share</Dropdown.Label>
          <Dropdown.Item value="link" selection={false}>
            <Dropdown.ItemLabel>Copy link</Dropdown.ItemLabel>
          </Dropdown.Item>
          <Dropdown.Sub>
            <Dropdown.SubTrigger>Invite</Dropdown.SubTrigger>
            <Dropdown.SubContent>
              <Dropdown.Item value="email" selection={false}>
                <Dropdown.ItemLabel>Email</Dropdown.ItemLabel>
              </Dropdown.Item>
            </Dropdown.SubContent>
          </Dropdown.Sub>
        </Dropdown.Group>
      </Dropdown.Popover>
    </Dropdown>
  );
}
