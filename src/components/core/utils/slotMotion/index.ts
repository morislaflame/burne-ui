/**
 * Per-slot GSAP engine (`createMotionScope`, `useMotionPart`, recipes).
 *
 * Component file contract — Types (`XxxMotion`) → Context (`createMotionScope`) →
 * Animations (defaults + host play + embed map) → Parts (`useMotionPart` only).
 * See kit Slot motion API rules and site docs `content/docs/motion`.
 */
export {
  KIT_MOTION_RECIPES,
  isMotionFactory,
  isMotionVarsObject,
  LEAVE_COMPLETE_FALLBACK_MS,
  type KitRecipeName,
  type MotionAnimation,
  type MotionContext,
  type MotionFactory,
  type MotionPartPhases,
  type MotionPhaseName,
  type MotionRecipe,
  type MotionRecipeName,
  type MotionSlotMap,
  type MotionValue,
  type MotionVars,
} from "./slotMotionTypes";
export { registerMotionRecipe, getMotionRecipe } from "./motionRecipeRegistry";
export {
  mergeMotionSlotMaps,
  resolveMotionValue,
  resolveSlotPhase,
} from "./resolveMotionValue";
export {
  killStoredMotion,
  runMotionPhase,
  type RunMotionPhaseOptions,
  type RunMotionPhaseResult,
} from "./runMotionPhase";
export {
  createMotionScope,
  killMotionTargets,
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
