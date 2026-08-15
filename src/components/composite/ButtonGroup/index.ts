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
  ButtonGroupMotion,
  ButtonGroupPartMotion,
} from "./ButtonGroup";

export type { ButtonGroupSegment } from "./buttonGroupTypes";

export {
  ButtonGroupLayoutContext,
  ButtonGroupSegmentContext,
  ButtonGroupLayoutProvider,
  ButtonGroupSegmentProvider,
  ButtonGroupClassNamesProvider,
  useOptionalButtonGroupLayout,
  useOptionalButtonGroupSegment,
  useInJoinedButtonGroup,
  useButtonGroupClassNames,
} from "./buttonGroupContext";
