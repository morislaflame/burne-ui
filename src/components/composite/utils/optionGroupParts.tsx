import { forwardRef } from "react";

import { FieldError, type FieldErrorProps } from "@/components/core/Field";
import { cn } from "@/utils/cn";

import { OptionGroupHeader, OptionGroupHint, OptionGroupLegend, OptionGroupList, type OptionGroupHintProps, type OptionGroupLegendProps, type OptionGroupListProps } from "./optionGroupFieldset";

export function createOptionGroupLegendPart(displayName: string) {
  function Legend({ children, ...rest }: OptionGroupLegendProps) {
    return (
      <OptionGroupLegend {...rest}>
        <OptionGroupHeader>{children}</OptionGroupHeader>
      </OptionGroupLegend>
    );
  }
  Legend.displayName = displayName;
  return Legend;
}

export function createOptionGroupHintPart(
  useHintId: () => string,
  useSlotClassName: () => string | undefined,
  displayName: string,
) {
  function Hint({ id, className, ...rest }: OptionGroupHintProps) {
    const hintId = useHintId();
    const slotClass = useSlotClassName();
    return <OptionGroupHint id={id ?? hintId} className={cn(slotClass, className)} {...rest} />;
  }
  Hint.displayName = displayName;
  return Hint;
}

export function createOptionGroupErrorPart(
  useErrorId: () => string,
  useSlotClassName: () => string | undefined,
  displayName: string,
) {
  function ErrorPart({ id, className, ...rest }: FieldErrorProps) {
    const errorId = useErrorId();
    const slotClass = useSlotClassName();
    return <FieldError id={id ?? errorId} className={cn(slotClass, className)} {...rest} />;
  }
  ErrorPart.displayName = displayName;
  return ErrorPart;
}

export function createOptionGroupListPart(
  useSlotClassName: () => string | undefined,
  displayName: string,
) {
  const List = forwardRef<HTMLDivElement, OptionGroupListProps>(function List(
    { className, ...rest },
    ref,
  ) {
    const slotClass = useSlotClassName();
    return <OptionGroupList ref={ref} className={cn(slotClass, className)} {...rest} />;
  });
  List.displayName = displayName;
  return List;
}
