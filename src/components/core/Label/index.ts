import { Label, LabelRoot, LabelSlot } from "./Label";
 
export type LabelComponent = typeof Label & {
  Slot: typeof LabelSlot;
};
 
const LabelCompound = Object.assign(Label, { Slot: LabelSlot }) as LabelComponent;
 
export { LabelCompound as Label, LabelRoot, LabelSlot };
 
export type { LabelProps, LabelClassNames, LabelMotion, LabelPartMotion, FieldLabelContextValue } from "./labelTypes";
 
export {
  FieldLabelContext,
  useOptionalFieldLabelContext,
} from "./labelContext";
 
 
 