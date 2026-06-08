import { Label, LabelSlot, type LabelComponent } from "./Label";

export const LabelWithSlot = Object.assign(Label, { Slot: LabelSlot }) as LabelComponent;

export { LabelWithSlot as Label, Label as LabelRoot, LabelSlot };
export type { LabelProps, LabelComponent } from "./Label";
export {
  FieldLabelContext,
  useFieldLabelContext,
  useOptionalFieldLabelContext,
  type FieldLabelContextValue,
} from "./fieldLabelContext";
