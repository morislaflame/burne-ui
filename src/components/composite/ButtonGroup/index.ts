import { ButtonGroupRoot } from "./ButtonGroup";

export const ButtonGroup = ButtonGroupRoot;

export {
  ButtonGroupText,
  type ButtonGroupProps,
  type ButtonGroupTextProps,
  type ButtonGroupOrientation,
  type ButtonGroupClassNames,
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
