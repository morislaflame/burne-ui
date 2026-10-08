import { forwardRef, useMemo } from "react";

import { resolveStepperMotionDefaults } from "./stepperAnimations";
import { StepperClassNamesProvider, StepperMotionProvider, StepperProvider } from "./stepperContext";
import { StepperList } from "./stepperParts";
import type { StepperProps } from "./stepperTypes";
import { useStepperRootState } from "./useStepperRootState";

export const StepperRoot = forwardRef<HTMLOListElement, StepperProps>(function StepperRoot(props, ref) {
  const state = useStepperRootState(props);
  const motionDefaults = useMemo(() => resolveStepperMotionDefaults(), []);

  return (
    <StepperClassNamesProvider classNames={state.classNames}>
      <StepperProvider value={state.context}>
        <StepperMotionProvider
          motion={state.motion}
          defaults={motionDefaults}
          params={{}}
          controller={state.motionController}
          motionState={state.motionState}
          motionPayload={state.motionPayload}
          playInitialState={state.playInitialState}
        >
          <StepperList
            ref={ref}
            compound={state.compound}
            steps={state.steps}
            {...state.rest}
          >
            {state.children}
          </StepperList>
        </StepperMotionProvider>
      </StepperProvider>
    </StepperClassNamesProvider>
  );
});

StepperRoot.displayName = "Stepper";
