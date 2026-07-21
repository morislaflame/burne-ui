import { IoLinkOutline, IoLogoTwitter, IoMailOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Popover } from "@/components/core/Popover";

export function PopoverShareMenuDemo() {
  return (
    <Popover side="bottom">
      <Popover.Trigger asChild>
        <Button variant="outline" type="button">
          Share
        </Button>
      </Popover.Trigger>
      <Popover.Content showArrow>
        <Popover.Arrow />
        <Popover.Header className="px-base pt-base">
          <Popover.Title>Share</Popover.Title>
          <Popover.Description>Choose a method</Popover.Description>
        </Popover.Header>
        <Popover.Body className="flex flex-col gap-xsmall p-base">
          <Button 
          variant="ghost" 
          size="small" 
          type="button" 
          icon={<IoLinkOutline aria-hidden />}
          className="justify-start"
          >
            Copy link
          </Button>
          <Button 
          variant="ghost" 
          size="small" 
          type="button" 
          icon={<IoMailOutline aria-hidden />}
          className="justify-start"
          >
            Send email
          </Button>
          <Button 
          variant="ghost" 
          size="small" 
          type="button" 
          icon={<IoLogoTwitter aria-hidden />}
          className="justify-start"
          >
            Twitter
          </Button>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
}
