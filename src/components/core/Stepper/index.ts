import { StepperRoot } from "./Stepper";
import { StepperDescription, StepperIndicator, StepperItem, StepperTitle } from "./stepperParts";

export const Stepper = Object.assign(StepperRoot, {
  Item: StepperItem,
  Indicator: StepperIndicator,
  Title: StepperTitle,
  Description: StepperDescription,
});

export type {
  StepperClassNames,
  StepperDescriptionProps,
  StepperIndicatorProps,
  StepperItemProps,
  StepperMotion,
  StepperOrientation,
  StepperPartMotion,
  StepperProps,
  StepperSize,
  StepperStep,
  StepperStepState,
  StepperTitleProps,
} from "./stepperTypes";
