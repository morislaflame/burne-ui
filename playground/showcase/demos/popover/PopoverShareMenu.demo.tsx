import { IoLinkOutline, IoLogoTwitter, IoMailOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Popover } from "@/components/core/Popover";

export function PopoverShareMenuDemo() {
  return (
    <Popover side="bottom">
      <Popover.Trigger>
        <Button variant="outline" type="button">
          Поделиться
        </Button>
      </Popover.Trigger>
      <Popover.Content showArrow>
        <Popover.Arrow />
        <Popover.Header className="px-base pt-base">
          <Popover.Label>Поделиться</Popover.Label>
          <Popover.Hint>Выберите способ</Popover.Hint>
        </Popover.Header>
        <Popover.Body className="flex flex-col gap-xsmall p-base">
          <Button 
          variant="ghost" 
          size="small" 
          type="button" 
          leftIcon={<IoLinkOutline aria-hidden />}
          className="justify-start"
          >
            Скопировать ссылку
          </Button>
          <Button 
          variant="ghost" 
          size="small" 
          type="button" 
          leftIcon={<IoMailOutline aria-hidden />}
          className="justify-start"
          >
            Отправить email
          </Button>
          <Button 
          variant="ghost" 
          size="small" 
          type="button" 
          leftIcon={<IoLogoTwitter aria-hidden />}
          className="justify-start"
          >
            Twitter
          </Button>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
}
