import { Label, LabelSlot, type LabelComponent } from "./Label";

const LabelCompound = Object.assign(Label, { Slot: LabelSlot }) as LabelComponent;

export { LabelCompound as Label };
export type { LabelProps, LabelComponent } from "./Label";
export { type FieldLabelContextValue } from "./fieldLabelContext";
