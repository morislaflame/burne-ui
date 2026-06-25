import { IoFolderOutline, IoSettingsOutline, IoTrashOutline } from "react-icons/io5";

import { ButtonGroup } from "@/components/composite/ButtonGroup";
import { Button } from "@/components/core/Button";
import { Surface } from "@/components/core/Surface";

export function ButtonGroupVerticalMenuDemo() {
  return (
    <Surface variant="secondary" padding="small" className="w-full max-w-[10rem]">
      <ButtonGroup aria-label="Actions with file" segmented buttonSize="small" orientation="vertical" className="w-full" >
        <Button
          variant="ghost"
          className="w-full justify-start"
          leftIcon={<IoFolderOutline aria-hidden />}
        >
          Open
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          leftIcon={<IoSettingsOutline aria-hidden />}
        >
          Settings
        </Button>
        <Button
          variant="ghost"
          status="danger"
          className="w-full justify-start"
          leftIcon={<IoTrashOutline aria-hidden />}
        >
          Delete
        </Button>
      </ButtonGroup>
    </Surface>
  );
}
