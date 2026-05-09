import { useState, type HTMLAttributes, type ReactNode } from "react";
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
  /** Пробрасывает hover-анимации в Expandable items. */
  hoverAnimated?: boolean;
  /** Пробрасывает press-ripple в Expandable items. */
  pressRipple?: boolean;
};

export function Accordion({
  items,
  defaultOpenId = null,
  openId: openIdProp,
  onOpenIdChange,
  hoverAnimated = false,
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
    <div className={["flex w-full flex-col", className].join(" ")} {...rest}>
      {items.map((item, index) => {
        const isOpen = openId === item.id;
        return (
          <Expandable
            key={item.id}
            title={item.title}
            description={item.description}
            icon={item.icon}
            disabled={item.disabled}
            hoverAnimated={hoverAnimated}
            pressRipple={pressRipple}
            open={isOpen}
            onOpenChange={(next) => {
              const nextId = next ? item.id : null;
              if (!controlled) setInternalOpenId(nextId);
              onOpenIdChange?.(nextId);
            }}
            className={[
              "!rounded-none",
              index === 0 ? "!rounded-t-md" : "-mt-px",
              index === items.length - 1 ? "!rounded-b-md" : "",
            ].join(" ")}
          >
            {item.content}
          </Expandable>
        );
      })}
    </div>
  );
}
