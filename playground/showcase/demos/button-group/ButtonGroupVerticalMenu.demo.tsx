import { IoFolderOutline, IoSettingsOutline, IoTrashOutline } from "react-icons/io5";

import { ButtonGroup } from "@/components/composite/ButtonGroup";
import { Button } from "@/components/core/Button";
import { Surface } from "@/components/core/Surface";

export function ButtonGroupVerticalMenuDemo() {
  return (
    <Surface variant="secondary" padding="small" className="w-full max-w-[10rem]">
      <ButtonGroup aria-label="Действия с файлом" orientation="vertical" className="w-full">
        <Button
          variant="ghost"
          className="w-full justify-start"
          leftIcon={<IoFolderOutline aria-hidden />}
          groupSegment={{ orientation: "vertical", position: "first" }}
        >
          Открыть
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          leftIcon={<IoSettingsOutline aria-hidden />}
          groupSegment={{ orientation: "vertical", position: "middle" }}
        >
          Настройки
        </Button>
        <Button
          variant="ghost"
          status="danger"
          className="w-full justify-start"
          leftIcon={<IoTrashOutline aria-hidden />}
          groupSegment={{ orientation: "vertical", position: "last" }}
        >
          Удалить
        </Button>
      </ButtonGroup>
    </Surface>
  );
}
