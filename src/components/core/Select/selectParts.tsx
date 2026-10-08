import { forwardRef, useCallback } from "react";
 
import { ListBox } from "@/components/core/ListBox";
import { Popover } from "@/components/core/Popover";
import { POPOVER_DEFAULT_OFFSET } from "@/components/core/Popover/popoverStyles";
import type { MotionController, MotionStateHostProps } from "@/components/core/utils/slotMotion";
 
import { useSelectClassNames, useSelectContext } from "./selectContext";
import { SelectError, SelectHint, SelectLabel } from "./selectFieldParts";
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
      listBoxProps,
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
      virtualized,
      virtualItemSize,
      options,
      optionValues,
      multiple,
      value,
      setValue,
      values,
      setValues,
      activeValue,
      setActiveValue,
      variant,
      size,
    } = useSelectContext();
 
    const {
      className: listBoxClassName,
      classNames: listBoxSlotClassNames,
      style: listBoxStyle,
      size: listBoxSize,
      virtualized: listVirtualized,
      virtualItemSize: listItemSize,
      ...listBoxRest
    } = listBoxProps ?? {};
 
    const handleValueChange = useCallback(
      (next: string | string[]) => {
        if (multiple) {
          setValues(Array.isArray(next) ? next : next ? [next] : []);
          return;
        }
        const v = Array.isArray(next) ? (next[0] ?? "") : next;
        setValue(v);
        setOpen(false);
      },
      [multiple, setOpen, setValue, setValues],
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
              indicator
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
        variant={variant}
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
              size={listBoxSize ?? size}
              {...listBoxRest}
              listId={listId}
              aria-labelledby={labelConnected ? labelId : undefined}
              aria-label={labelConnected ? undefined : placeholder}
              multiple={multiple}
              value={multiple ? values : value}
              onValueChange={handleValueChange}
              activeValue={activeValue}
              onActiveValueChange={setActiveValue}
              classNames={{
                item: slotClassNames.listBoxItem,
                label: slotClassNames.listBoxLabel,
                hint: slotClassNames.listBoxHint,
                icon: slotClassNames.listBoxIcon,
                empty: slotClassNames.listBoxEmpty,
                header: slotClassNames.listBoxHeader,
                headerText: slotClassNames.listBoxHeaderText,
                ...listBoxSlotClassNames,
              }}
              className={cn(
                SELECT_LISTBOX_CLASS,
                slotClassNames.listBox,
                listBoxClassName,
              )}
              virtualized={virtualized || listVirtualized}
              virtualItemSize={virtualItemSize ?? listItemSize}
              style={{ maxHeight: menuMaxHeight, ...listBoxStyle }}
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
  motionController,
  motionState,
  motionPayload,
  playInitialState,
}: {
  label: React.ReactNode;
  hint: React.ReactNode;
  error: React.ReactNode;
  labelId: string;
  motionController?: MotionController;
} & MotionStateHostProps) {
  const slotClassNames = useSelectClassNames();
 
  return (
    <>
      {label != null ? (
        <SelectLabel id={labelId} classNames={{ root: slotClassNames.label }}>
          {label}
        </SelectLabel>
      ) : null}
      <SelectTriggerGroup motionController={motionController}
                motionState={motionState}
                motionPayload={motionPayload}
                playInitialState={playInitialState}>
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
 