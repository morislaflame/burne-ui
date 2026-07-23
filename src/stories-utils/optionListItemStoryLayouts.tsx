import type { ElementType } from "react";
import { IoChevronForward, IoGlobeOutline } from "react-icons/io5";

import { Avatar } from "@/components/core/Avatar";
import { Badge } from "@/components/core/Badge";
import { PIN_IMAGE1 } from "@/stories-utils/mockImages";
import { cn } from "@/utils/cn";

export type OptionListItemLayoutParts = {
  Item: ElementType;
  ItemLabel: ElementType;
  ItemHint: ElementType;
  ItemIcon: ElementType;
  ItemIndicator: ElementType;
};

/** Shared compound items for Dropdown / ListBox / ComboBox stories — shows how the grid changes. */
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
        <ItemLabel>Label only</ItemLabel>
      </Item>

      <Item value="label-hint">
        <ItemLabel>Label + Hint</ItemLabel>
        <ItemHint>ItemHint → second line in the middle column</ItemHint>
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
        <ItemHint>3 cols × 2 rows — all slots filled</ItemHint>
        <ItemIcon>
          <IoGlobeOutline aria-hidden />
        </ItemIcon>
      </Item>

      <Item value="member" className="gap-y-base">
        <ItemLabel>
          <span className="flex min-w-0 items-center gap-small">
            <Avatar size="small" label="Anya Ivanova" src={PIN_IMAGE1} alt="" loading="lazy" />
            <span className="flex min-w-0 flex-col gap-px">
              <span className="truncate font-medium">Anya Ivanova</span>
              <span className="truncate text-xsmall text-muted">Product Design</span>
            </span>
          </span>
        </ItemLabel>
        <ItemHint>@anya · on the team since 2023</ItemHint>
        <ItemIcon>
          <Badge status="success" size="small">
            Pro
          </Badge>
        </ItemIcon>
        <span
          className={cn(
            "col-start-1 row-start-3 flex flex-wrap gap-small",
            "min-w-0 max-w-full justify-self-start [width:fit-content]",
          )}
        >
          <Badge variant="secondary" size="small">
            Design
          </Badge>
          <Badge variant="outline" size="small">
            Figma
          </Badge>
          <Badge variant="outline" size="small">
            Research
          </Badge>
        </span>
      </Item>

      <Item value="action">
        <ItemLabel>More actions</ItemLabel>
        <ItemIcon>
          <IoChevronForward aria-hidden />
        </ItemIcon>
      </Item>
    </>
  );
}
