import type { HTMLAttributes } from "react";

import { LabelClassNamesProvider, useLabelClassNames } from "./labelContext";
import { labelRootClass } from "./labelStyles";
import { LabelContent, LabelSlot } from "./labelParts";
import type { LabelProps } from "./labelTypes";
import { useLabelRootState } from "./useLabelRootState";

export type {
  LabelProps,
  LabelClassNames,
  FieldLabelContextValue,
} from "./labelTypes";

export function LabelRoot({
  children,
  className,
  isRequired: isRequiredProp,
  htmlFor: htmlForProp,
  id: idProp,
  ...rest
}: Omit<LabelProps, "classNames">) {
  const { htmlFor, id, isRequired } = useLabelRootState({
    isRequired: isRequiredProp,
    htmlFor: htmlForProp,
    id: idProp,
  });
  const slotClassNames = useLabelClassNames();
  const rootClass = labelRootClass({
    className,
    slotClass: slotClassNames.root,
  });

  if (htmlFor != null) {
    return (
      <label id={id} htmlFor={htmlFor} className={rootClass} {...rest}>
        <LabelContent isRequired={isRequired}>{children}</LabelContent>
      </label>
    );
  }

  const spanRest = rest as HTMLAttributes<HTMLSpanElement>;

  return (
    <span id={id} className={rootClass} {...spanRest}>
      <LabelContent isRequired={isRequired}>{children}</LabelContent>
    </span>
  );
}

export function Label({ classNames, ...rest }: LabelProps) {
  return (
    <LabelClassNamesProvider classNames={classNames}>
      <LabelRoot {...rest} />
    </LabelClassNamesProvider>
  );
}

export { LabelSlot };
