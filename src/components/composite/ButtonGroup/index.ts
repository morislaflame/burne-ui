import { ButtonGroupRoot } from "./ButtonGroup";
import { ButtonGroupText } from "./buttonGroupParts";

export const ButtonGroup = Object.assign(ButtonGroupRoot, {
  Text: ButtonGroupText,
});

export type {
  ButtonGroupProps,
  ButtonGroupTextProps,
  ButtonGroupOrientation,
  ButtonGroupClassNames,
} from "./ButtonGroup";

export type { ButtonGroupSegment } from "./buttonGroupTypes";

export {
  buttonGroupRoundingClasses,
  buttonGroupOverlapBorderClasses,
  buttonGroupSegmentSurfaceClasses,
  buttonGroupTextSurfaceClasses,
  buttonGroupTextFrameClass,
} from "./buttonGroupStyles";

export {
  ButtonGroupLayoutContext,
  ButtonGroupSegmentContext,
  ButtonGroupLayoutProvider,
  ButtonGroupSegmentProvider,
  ButtonGroupClassNamesProvider,
  useOptionalButtonGroupLayout,
  useOptionalButtonGroupSegment,
  useButtonGroupClassNames,
} from "./buttonGroupContext";
