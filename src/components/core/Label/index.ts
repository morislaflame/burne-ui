import { Label, LabelRequired, LabelSlot, LabelText } from "./Label";
 
export type LabelComponent = typeof Label & {
  Slot: typeof LabelSlot;
  Text: typeof LabelText;
  Required: typeof LabelRequired;
};
 
const LabelCompound = Object.assign(Label, {
  Slot: LabelSlot,
  Text: LabelText,
  Required: LabelRequired,
}) as LabelComponent;
 
export { LabelCompound as Label };
 
export type {
  LabelProps,
  LabelClassNames,
  LabelMotion,
  LabelPartMotion,
  LabelTextProps,
  LabelRequiredProps,
} from "./labelTypes";
 
export {
  FieldLabelContext,
  useOptionalFieldLabelContext,
} from "./labelContext";
 
 
 