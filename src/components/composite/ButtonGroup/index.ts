import { ButtonGroupRoot } from "./ButtonGroup";

export const ButtonGroup = ButtonGroupRoot;

export {
  ButtonGroupText,
  type ButtonGroupProps,
  type ButtonGroupTextProps,
  type ButtonGroupOrientation,
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
  useOptionalButtonGroupLayout,
  useOptionalButtonGroupSegment,
} from "./buttonGroupContext";
