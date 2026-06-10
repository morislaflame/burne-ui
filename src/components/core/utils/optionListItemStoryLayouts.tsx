import type { ElementType } from "react";
import { IoChevronForward, IoGlobeOutline } from "react-icons/io5";

import { Avatar } from "@/components/core/Avatar";
import { Badge } from "@/components/core/Badge";
import { PIN_IMAGE1 } from "@/utils/mockImages";
import { cn } from "@/utils/cn";

export type OptionListItemLayoutParts = {
  Item: ElementType;
  ItemLabel: ElementType;
  ItemHint: ElementType;
  ItemIcon: ElementType;
  ItemIndicator: ElementType;
};

/** Общие compound-пункты для stories Dropdown / ListBox / ComboBox — видно, как меняется grid. */
export function OptionListItemLayoutShowcase({
  Item,
  ItemLabel,
  ItemHint,
  ItemIcon,
  ItemIndicator,
}: OptionListItemLayoutParts) {
  return (
    <>
      <Item value="label-only">
        <ItemLabel>Только Label</ItemLabel>
      </Item>

      <Item value="label-hint">
        <ItemLabel>Label + Hint</ItemLabel>
        <ItemHint>ItemHint → вторая строка в средней колонке</ItemHint>
      </Item>

      <Item value="label-icon">
        <ItemLabel>Label + Icon</ItemLabel>
        <ItemIcon>
          <kbd className="rounded-sm border-token px-xsmall font-mono text-xs opacity-70">⌘C</kbd>
        </ItemIcon>
      </Item>

      <Item value="indicator-label">
        <ItemIndicator />
        <ItemLabel>Indicator + Label</ItemLabel>
      </Item>

      <Item value="full-grid">
        <ItemIndicator />
        <ItemLabel>Indicator + Label + Hint + Icon</ItemLabel>
        <ItemHint>3 cols × 2 rows — все слоты заняты</ItemHint>
        <ItemIcon>
          <IoGlobeOutline aria-hidden />
        </ItemIcon>
      </Item>

      <Item value="member" className="gap-y-base">
        <ItemLabel>
          <span className="flex min-w-0 items-center gap-small">
            <Avatar size="small" label="Аня Иванова" src={PIN_IMAGE1} alt="" loading="lazy" />
            <span className="flex min-w-0 flex-col gap-px">
              <span className="truncate font-medium">Аня Иванова</span>
              <span className="truncate text-tools text-muted">Product Design</span>
            </span>
          </span>
        </ItemLabel>
        <ItemHint>@anya · в команде с 2023</ItemHint>
        <ItemIcon>
          <Badge color="success" size="small">
            Pro
          </Badge>
        </ItemIcon>
        <span
          className={cn(
            "col-start-1 row-start-3 flex flex-wrap gap-small",
            "min-w-0 max-w-full justify-self-start [width:fit-content]",
          )}
        >
          <Badge color="secondary" size="small">
            Design
          </Badge>
          <Badge color="outline" size="small">
            Figma
          </Badge>
          <Badge color="outline" size="small">
            Research
          </Badge>
        </span>
      </Item>

      <Item value="action">
        <ItemLabel>Ещё действия</ItemLabel>
        <ItemIcon>
          <IoChevronForward aria-hidden />
        </ItemIcon>
      </Item>
    </>
  );
}
