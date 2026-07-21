import { IoEllipsisHorizontal } from "react-icons/io5";

import { ButtonGroup, ButtonGroupText } from "@/components/composite/ButtonGroup";
import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";

export function ButtonGroupGlossDemo() {
  return (
    <ButtonGroup variant="gloss" aria-label="Gloss actions">
      <ButtonGroupText>View</ButtonGroupText>
      <Button>List</Button>
      <Button>Net</Button>
      <Dropdown>
        <Dropdown.Trigger asChild>
          <Button aria-label="Additional actions" iconOnly>
            <IoEllipsisHorizontal aria-hidden className="icon-base" />
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Popover align="end">
          <Dropdown.Item value="share" selection={false}>
            Share
          </Dropdown.Item>
          <Dropdown.Item value="del" status="danger" selection={false}>
            Delete
          </Dropdown.Item>
        </Dropdown.Popover>
      </Dropdown>
    </ButtonGroup>
  );
}
