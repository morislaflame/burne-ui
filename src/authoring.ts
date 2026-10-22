/**
 * Semver surface for a component package (`burne-ui/authoring`).
 * Changes only on a major. `check-public-surface` snapshots the runtime names.
 * App code keeps `motionController`, `motionState`, and `MotionGroup` on `burne-ui`.
 */
export { createMotionScope } from "@/components/core/utils/slotMotion/createMotionScope";
export type { MotionScope } from "@/components/core/utils/slotMotion/createMotionScope";
export { useMotionPart } from "@/components/core/utils/slotMotion/useMotionPart";
export { mergeRefs } from "@/components/core/utils/mergeRefs";
export { mergeAsChildProps } from "@/components/core/utils/mergeAsChildProps";
export { useControllableState } from "@/components/core/utils/useControllableState";
export {
  focusKeyboard,
  focusOnOpen,
  focusPanelOnOpen,
} from "@/components/core/utils/focusElement";
export {
  dataActiveState,
  dataCheckedState,
  dataExpandedState,
  dataFlag,
  dataGroupSegment,
  dataOnState,
  dataOpenState,
  dataValue,
  dataVariantProps,
} from "@/components/core/utils/dataContract";
export { useSkinSlot } from "@/skins/useSkinSlot";
export type { SkinSlotView } from "@/skins/useSkinSlot";
export type { UseControllableStateParams } from "@/components/core/utils/useControllableState";
export type { DataState } from "@/components/core/utils/dataContract";
export type { MotionScopeValue } from "@/components/core/utils/slotMotion/createMotionScope";
export type {
  MotionController,
  MotionMapWithEvents,
  MotionPartPhases,
  MotionStateHostProps,
} from "@/components/core/utils/slotMotion";
export type { Prettify } from "@/utils/prettify";
