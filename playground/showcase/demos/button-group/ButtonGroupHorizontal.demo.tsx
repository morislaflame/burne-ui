import { IoEllipsisHorizontal } from "react-icons/io5";

import { ButtonGroup, ButtonGroupText } from "@/components/composite/ButtonGroup";
import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";

export function ButtonGroupHorizontalDemo() {
  return (
    <ButtonGroup aria-label="Действия с документом">
      <ButtonGroupText>Вид</ButtonGroupText>
      <Button variant="outline">Список</Button>
      <Button variant="outline" groupSegment={{ orientation: "horizontal", position: "middle" }}>
        Сетка
      </Button>
      <Dropdown>
        <Dropdown.Trigger asChild>
          <Button
            variant="primary"
            aria-label="Дополнительные действия"
            iconOnly
            groupSegment={{ orientation: "horizontal", position: "last" }}
          >
            <IoEllipsisHorizontal aria-hidden className="icon-base" />
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Popover>
          <Dropdown.Item value="dup" selection={false}>
            Дублировать
          </Dropdown.Item>
          <Dropdown.Item value="del" variant="danger" selection={false}>
            Удалить
          </Dropdown.Item>
        </Dropdown.Popover>
      </Dropdown>
    </ButtonGroup>
  );
}
