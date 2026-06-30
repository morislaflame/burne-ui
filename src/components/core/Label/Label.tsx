import { LabelClassNamesProvider } from "./labelContext";
import { LabelRoot } from "./labelParts";
import type { LabelProps } from "./labelTypes";

export type {
  LabelProps,
  LabelClassNames,
  FieldLabelContextValue,
} from "./labelTypes";

export { LabelRoot, LabelSlot } from "./labelParts";

export function Label({ classNames, ...rest }: LabelProps) {
  return (
    <LabelClassNamesProvider classNames={classNames}>
      <LabelRoot {...rest} />
    </LabelClassNamesProvider>
  );
}
