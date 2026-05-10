import { useState, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "../../../utils/cn";
import { Expandable } from "../../core/Expandable";

export type AccordionItem = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  content: ReactNode;
  disabled?: boolean;
};

export type AccordionProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  items: readonly AccordionItem[];
  /** Начально открытый item id (неконтролируемый режим). */
  defaultOpenId?: string | null;
  /** Управляемое открытое состояние. */
  openId?: string | null;
  onOpenIdChange?: (id: string | null) => void;
  /** Пробрасывает press-ripple в Expandable items. */
  pressRipple?: boolean;
};

export function Accordion({
  items,
  defaultOpenId = null,
  openId: openIdProp,
  onOpenIdChange,
  pressRipple = false,
  className = "",
  ...rest
}: AccordionProps) {
  const controlled = openIdProp !== undefined;
  const [internalOpenId, setInternalOpenId] = useState<string | null>(
    defaultOpenId,
  );
  const openId = controlled ? openIdProp : internalOpenId;

  return (
    <div className={cn("flex w-full flex-col", className)} {...rest}>
      {items.map((item, index) => {
        const isOpen = openId === item.id;
        return (
          <Expandable
            key={item.id}
            disabled={item.disabled}
            pressRipple={pressRipple}
            open={isOpen}
            onOpenChange={(next) => {
              const nextId = next ? item.id : null;
              if (!controlled) setInternalOpenId(nextId);
              onOpenIdChange?.(nextId);
            }}
            className={cn(
              "!rounded-none",
              index === 0 ? "!rounded-t-xl" : "-mt-px",
              index === items.length - 1 ? "!rounded-b-xl" : "",
            )}
          >
            <Expandable.Trigger>
              {item.icon ? <Expandable.Icon>{item.icon}</Expandable.Icon> : null}
              <Expandable.Content>
                <Expandable.Title>{item.title}</Expandable.Title>
                {item.description != null ? (
                  <Expandable.Description>{item.description}</Expandable.Description>
                ) : null}
              </Expandable.Content>
            </Expandable.Trigger>
            <Expandable.Panel>{item.content}</Expandable.Panel>
          </Expandable>
        );
      })}
    </div>
  );
}
