/**
 * Per-slot GSAP engine (`createMotionScope`, `useMotionPart`, recipes).
 *
 * Component file contract — Types (`XxxMotion`) → Context (`createMotionScope`) →
 * Animations (defaults + host play + embed map) → Parts (`useMotionPart` only).
 * See kit Slot motion API rules and site docs `content/docs/motion`.
 */
export {
  KIT_MOTION_RECIPES,
  MOTION_PHASE_NAMES,
  isMotionFactory,
  isMotionVarsObject,
  isMotionRunActive,
  LEAVE_COMPLETE_FALLBACK_MS,
  type KitRecipeName,
  type MotionAnimation,
  type MotionCancelReason,
  type MotionContext,
  type MotionFactory,
  type MotionPartPhases,
  type MotionPhaseName,
  type MotionRecipe,
  type MotionRecipeName,
  type MotionRecipeParams,
  type MotionRun,
  type MotionTransformVars,
  type MotionRunStatus,
  type MotionSlotMap,
  type MotionValue,
  type MotionVars,
} from "./slotMotionTypes";
export {
  registerMotionRecipe,
  unregisterMotionRecipe,
  hasMotionRecipe,
  listMotionRecipes,
  isKitMotionRecipe,
  getMotionRecipe,
  type RegisterMotionRecipeOptions,
} from "./motionRecipeRegistry";
export {
  mergeMotionSlotMaps,
  resolveMotionValue,
  resolveSlotPhase,
} from "./resolveMotionValue";
export {
  killStoredMotion,
  runMotionPhase,
  type RunMotionPhaseOptions,
} from "./runMotionPhase";
export { waitForLeaveGeneration } from "./waitForLeaveGeneration";
export { enterHidesFirstPaint, KIT_ENTER_HIDES_FIRST_PAINT } from "./enterHidesFirstPaint";
export { scheduleNestedEnterBroadcast, invalidateEnterFrame } from "./scheduleNestedEnterBroadcast";
export {
  createMotionRegistry,
  createMotionScope,
  createMotionScopeController,
  hideNestedEnterSlots,
  killMotionScope,
  type MotionRegisterInput,
  type MotionRegistration,
  type MotionRegistry,
  type MotionScopeValue,
  type PlayBroadcastOptions,
  type PlaySlotPhaseOptions,
} from "./createMotionScope";
export { useMotionPointerPhases } from "./useMotionPointerPhases";
export { mergeMotionPointerHandlers, mergeMotionPressHandlers, useMotionPart } from "./useMotionPart";
export {
  hasPointerPhases,
  slotHasPointerPhases,
  useOptionalEnterOnMount,
  useSlotPhaseOnChange,
} from "./useSlotLifecycle";
export { registerKitMotionRecipes } from "./recipes";

import "./recipes";
