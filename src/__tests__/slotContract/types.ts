import type { ReactNode, RefCallback } from "react";

import type { MotionController } from "@/components/core/utils/slotMotion";

/**
 * Callback ref, not `RefObject<HTMLElement>`.
 * `RefCallback<Element>` is assignable to `ref` on div, button, heading, and svg.
 */
export type SlotContractPartProps = {
  className: string;
  ref: RefCallback<Element>;
};

export type SlotContractCtx = {
  classNames: Record<string, string>;
  /** User `className` for merge-order check 5 (`p-2` vs slot `p-1`). */
  className: string;
  motionController: MotionController;
  part: (name: string) => SlotContractPartProps;
};

export type SlotContractFixture = {
  typeName: string;
  /** Extra inventory types this tree covers (aliases / nested maps). */
  covers?: readonly string[];
  /**
   * Compound part display name → classNames slot.
   * `Title` → `title`, unless the map says otherwise.
   */
  parts?: Record<string, string>;
  /** Slots that may be absent (conditional UI). */
  optionalSlots?: readonly string[];
  /**
   * Documented pairs allowed on one node (Badge mode modifiers).
   * Order does not matter.
   */
  allowDuplicateSlots?: readonly (readonly [string, string])[];
  /** Skip motion `getTarget` for these classNames keys. */
  notMotionTargets?: readonly string[];
  /**
   * Slots that live on a nested scope.
   * The marker is in the DOM; the root `motionController` does not see them.
   */
  nestedScopeSlots?: readonly string[];
  /** No `motionController` on this host (SearchInput). */
  skipMotion?: boolean;
  /** Slot that receives `classNames.root` merge. Default `root` if present. */
  rootSlot?: string;
  skipRootMerge?: boolean;
  render: (ctx: SlotContractCtx) => ReactNode;
};
