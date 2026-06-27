import { IoEllipsisHorizontal } from "react-icons/io5";

import { ButtonGroup, ButtonGroupText } from "@/components/composite/ButtonGroup";
import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";

export function ButtonGroupGlossDemo() {
  return (
    <ButtonGroup variant="gloss" aria-label="Gloss действия">
      <ButtonGroupText>Вид</ButtonGroupText>
      <Button>Список</Button>
      <Button>Сетка</Button>
      <Dropdown>
        <Dropdown.Trigger asChild>
          <Button aria-label="Дополнительные действия" iconOnly>
            <IoEllipsisHorizontal aria-hidden className="icon-base" />
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Popover>
          <Dropdown.Item value="share" selection={false}>
            Поделиться
          </Dropdown.Item>
          <Dropdown.Item value="del" variant="danger" selection={false}>
            Удалить
          </Dropdown.Item>
        </Dropdown.Popover>
      </Dropdown>
    </ButtonGroup>
  );
}
