import { Fragment, forwardRef, useCallback } from "react";
 
import { ListBox } from "@/components/core/ListBox";
import { Popover } from "@/components/core/Popover";
import { POPOVER_DEFAULT_OFFSET } from "@/components/core/Popover/popoverStyles";
import type { MotionController, MotionStateHostProps } from "@/components/core/utils/slotMotion";
 
import { resolveSelectPopoverPanelMotion } from "./selectAnimations";
import { useSelectClassNames, useSelectContext, useOptionalSelectMotionScope } from "./selectContext";
import { SelectError, SelectHint, SelectLabel } from "./selectFieldParts";
import { SELECT_LISTBOX_CLASS, SELECT_POPOVER_BODY_CLASS, SELECT_POPOVER_CLASS } from "./selectStyles";
import { SelectTrigger, SelectShell, SelectValue } from "./selectTriggerParts";
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
      portalContainer: portalContainerProp,
      listBoxProps,
      motion,
      ...rest
    },
    ref,
  ) {
    const slotClassNames = useSelectClassNames();
    const fieldMotion = useOptionalSelectMotionScope();
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
      optionSections,
      optionValues,
      multiple,
      value,
      setValue,
      values,
      setValues,
      activeValue,
      setActiveValue,
      variant,
      disabled,
      size,
      portalContainer,
    } = useSelectContext();
    const panelMotion = resolveSelectPopoverPanelMotion(
      variant,
      disabled,
      fieldMotion?.getRootMotion()?.popover,
      motion,
    );
 
    const {
      className: listBoxClassName,
      classNames: listBoxSlotClassNames,
      style: listBoxStyle,
      size: listBoxSize,
      virtualized: listVirtualized,
      virtualItemSize: listItemSize,
      ...listBoxRest
    } = listBoxProps ?? {};
 
    const handleSingleChange = useCallback(
      (next: string | null) => {
        setValue(next ?? "");
        setOpen(false);
      },
      [setOpen, setValue],
    );
 
    const unlabeled =
      optionSections.length === 1 && optionSections[0]?.label == null
        ? optionSections[0].items
        : null;
    const listContent =
      children ??
      (optionValues.length === 0 ? (
        <ListBox.Empty />
      ) : unlabeled ? (
        unlabeled.map((opt) => (
          <ListBox.Item
            key={opt.value}
            value={opt.value}
            disabled={opt.disabled}
            label={opt.label}
            hint={opt.hint}
            icon={opt.icon}
            indicator
          />
        ))
      ) : (
        optionSections.map((section) => {
          const items = section.items.map((opt) => (
            <ListBox.Item
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
              label={opt.label}
              hint={opt.hint}
              icon={opt.icon}
              indicator
            />
          ));
          if (!section.label) {
            return <Fragment key={section.items[0]?.value ?? "items"}>{items}</Fragment>;
          }
          const sectionKey = `${section.label}:${section.items[0]?.value ?? ""}`;
          return (
            <ListBox.Section key={sectionKey}>
              <ListBox.Header>{section.label}</ListBox.Header>
              {items}
            </ListBox.Section>
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
        portalContainer={portalContainerProp ?? portalContainer}
      >
        <Popover.Content
          ref={ref}
          matchAnchorWidth
          unstyled
          contentRole={undefined}
          align={align}
          offset={offset}
          className={cn(SELECT_POPOVER_CLASS, slotClassNames.popover, className)}
          motion={{ content: panelMotion }}
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
              selectionMode={multiple ? "multiple" : "single"}
              value={multiple ? undefined : value || null}
              onValueChange={multiple ? undefined : handleSingleChange}
              values={multiple ? values : undefined}
              onValuesChange={multiple ? setValues : undefined}
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
      <SelectShell motionController={motionController}
                motionState={motionState}
                motionPayload={motionPayload}
                playInitialState={playInitialState}>
        <SelectValue />
        <SelectTrigger />
      </SelectShell>
      <SelectPopover />
      {hint != null ? <SelectHint>{hint}</SelectHint> : null}
      {error != null ? <SelectError>{error}</SelectError> : null}
    </>
  );
}
 
export { SelectError, SelectHint, SelectLabel } from "./selectFieldParts";
export { SelectTrigger, SelectShell, SelectValue } from "./selectTriggerParts";
 