import { forwardRef, useCallback } from "react";

import { Label } from "@/components/core/Label";
import { ListBox } from "@/components/core/ListBox";
import { Popover } from "@/components/core/Popover";
import { POPOVER_DEFAULT_OFFSET } from "@/components/core/Popover/popoverStyles";

import { useSelectClassNames, useSelectContext } from "./selectContext";
import { SelectError, SelectHint } from "./selectFieldParts";
import { SELECT_LISTBOX_CLASS, SELECT_POPOVER_BODY_CLASS, SELECT_POPOVER_CLASS } from "./selectStyles";
import { SelectTrigger, SelectTriggerGroup, SelectValue } from "./selectTriggerParts";
import type { SelectPopoverProps } from "./selectTypes";

import { cn } from "@/utils/cn";

export const SelectPopover = forwardRef<HTMLDivElement, SelectPopoverProps>(
  function SelectPopover(
    {
      children,
      className,
      side = "bottom",
      align,
      offset = POPOVER_DEFAULT_OFFSET,
      ...rest
    },
    ref,
  ) {
    const slotClassNames = useSelectClassNames();
    const {
      open,
      setOpen,
      anchorRef,
      listId,
      labelId,
      labelConnected,
      placeholder,
      menuMaxHeight,
      options,
      optionValues,
      value,
      setValue,
      activeValue,
      setActiveValue,
      variant,
    } = useSelectContext();

    const handleValueChange = useCallback(
      (next: string | string[]) => {
        const v = Array.isArray(next) ? (next[0] ?? "") : next;
        setValue(v);
        setOpen(false);
      },
      [setOpen, setValue],
    );

    const listContent =
      children ??
      (optionValues.length === 0 ? (
        <ListBox.Empty />
      ) : (
        optionValues.map((v) => {
          const opt = options.find((o) => o.value === v)!;
          return (
            <ListBox.Item
              key={v}
              value={v}
              disabled={opt.disabled}
              label={opt.label}
              hint={opt.hint}
              icon={opt.icon}
            />
          );
        })
      ));

    return (
      <Popover
        open={open}
        onOpenChange={setOpen}
        side={side}
        anchorRef={anchorRef}
        variant={variant === "gloss" ? "gloss" : "default"}
      >
        <Popover.Content
          ref={ref}
          matchAnchorWidth
          unstyled
          contentRole={undefined}
          align={align}
          offset={offset}
          className={cn(SELECT_POPOVER_CLASS, slotClassNames.popover, className)}
          {...rest}
        >
          <Popover.Body
            className={cn(
              SELECT_POPOVER_BODY_CLASS,
              slotClassNames.popoverBody,
            )}
          >
            <ListBox
              listId={listId}
              aria-labelledby={labelConnected ? labelId : undefined}
              aria-label={labelConnected ? undefined : placeholder}
              value={value}
              onValueChange={handleValueChange}
              activeValue={activeValue}
              onActiveValueChange={setActiveValue}
              selectionIndicator
              className={cn(
                SELECT_LISTBOX_CLASS,
                slotClassNames.listBox,
              )}
              style={{ maxHeight: menuMaxHeight }}
            >
              {listContent}
            </ListBox>
          </Popover.Body>
        </Popover.Content>
      </Popover>
    );
  },
);

SelectPopover.displayName = "SelectPopover";


export function SelectSimpleBody({
  label,
  hint,
  error,
  labelId,
}: {
  label: React.ReactNode;
  hint: React.ReactNode;
  error: React.ReactNode;
  labelId: string;
}) {
  const slotClassNames = useSelectClassNames();

  return (
    <>
      {label != null ? (
        <Label id={labelId} classNames={{ root: slotClassNames.label }}>
          {label}
        </Label>
      ) : null}
      <SelectTriggerGroup>
        <SelectValue />
        <SelectTrigger />
      </SelectTriggerGroup>
      <SelectPopover />
      {hint != null ? <SelectHint>{hint}</SelectHint> : null}
      {error != null ? <SelectError>{error}</SelectError> : null}
    </>
  );
}

export { SelectError, SelectHint, SelectLabel } from "./selectFieldParts";
export { SelectTrigger, SelectTriggerGroup, SelectValue } from "./selectTriggerParts";
