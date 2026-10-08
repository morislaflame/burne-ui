import { forwardRef } from "react";

import { Avatar } from "@/components/core/Avatar";
import { Button, type ButtonProps } from "@/components/core/Button";
import { KitInformationCircleOutline } from "@/components/core/utils/kitIcons";

import { cn } from "@/utils/cn";

export const HoverCardPersonTrigger = forwardRef<HTMLButtonElement, ButtonProps>(
  function HoverCardPersonTrigger({ className, ...props }, ref) {
    return (
      <Button ref={ref} variant="outline" className={cn("gap-small", className)} {...props}>
        <Avatar size="small" label="AL" />
        Ada Lovelace
      </Button>
    );
  },
);

export function HoverCardPersonBody() {
  return (
    <div className="flex flex-col gap-small">
      <Button size="small" variant="outline" type="button" icon={<KitInformationCircleOutline />} iconPosition="start">
        View profile
      </Button>
      <Button size="small" variant="primary" type="button">
        Follow
      </Button>
    </div>
  );
}
