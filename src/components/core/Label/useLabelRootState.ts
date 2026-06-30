import { useOptionalFieldLabelContext } from "./labelContext";
import type { UseLabelRootStateProps } from "./labelTypes";

export function useLabelRootState({
  isRequired: isRequiredProp,
  htmlFor: htmlForProp,
  id: idProp,
}: UseLabelRootStateProps) {
  const ctx = useOptionalFieldLabelContext();

  return {
    htmlFor: htmlForProp ?? ctx?.controlId,
    id: idProp ?? ctx?.labelId,
    isRequired: isRequiredProp ?? ctx?.isRequired ?? false,
  };
}
