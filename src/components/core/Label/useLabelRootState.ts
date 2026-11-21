import { useOptionalFieldLabelContext } from "./labelContext";
import type { UseLabelRootStateProps } from "./labelTypes";
 
export function useLabelRootState({
  required: requiredProp,
  disabled: disabledProp,
  htmlFor: htmlForProp,
  id: idProp,
}: UseLabelRootStateProps) {
  const ctx = useOptionalFieldLabelContext();
 
  return {
    htmlFor: htmlForProp ?? ctx?.controlId,
    id: idProp ?? ctx?.labelId,
    required: requiredProp ?? ctx?.required ?? false,
    disabled: disabledProp ?? ctx?.disabled ?? false,
  };
}
 