import { forwardRef } from "react";

import { FieldError, type FieldErrorProps } from "@/components/core/Field";

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
  displayName: string,
) {
  function Hint({ id, ...rest }: OptionGroupHintProps) {
    const hintId = useHintId();
    return <OptionGroupHint id={id ?? hintId} {...rest} />;
  }
  Hint.displayName = displayName;
  return Hint;
}

export function createOptionGroupErrorPart(
  useErrorId: () => string,
  displayName: string,
) {
  function ErrorPart({ id, ...rest }: FieldErrorProps) {
    const errorId = useErrorId();
    return <FieldError id={id ?? errorId} {...rest} />;
  }
  ErrorPart.displayName = displayName;
  return ErrorPart;
}

export function createOptionGroupListPart(displayName: string) {
  const List = forwardRef<HTMLDivElement, OptionGroupListProps>(function List(props, ref) {
    return <OptionGroupList ref={ref} {...props} />;
  });
  List.displayName = displayName;
  return List;
}
