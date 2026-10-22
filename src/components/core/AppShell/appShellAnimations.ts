/**
 * Slot motion for AppShell — look here first.
 *
 * DOM slots: `root`, `body`, `main`
 *
 * `Header` and `Sidebar` are their own hosts. Defaults: empty.
 */
import type { ForwardedRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
} from "@/components/core/utils/slotMotion";

import { useAppShellMotionScope } from "./appShellContext";
import type { AppShellPartMotion } from "./appShellTypes";

export function resolveAppShellMotionDefaults() {
  return {};
}

/** Literal registrations for the slot checker. The hooks below pass the same names. */
const APP_SHELL_MOTION_SLOTS = {
  root: { slot: "root" },
  body: { slot: "body" },
  main: { slot: "main" },
} as const;

type AppShellSlotArgs = {
  forwardedRef?: ForwardedRef<HTMLDivElement>;
  motion?: AppShellPartMotion;
  onPointerOver?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerOut?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerDown?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerUp?: (e: ReactPointerEvent<HTMLDivElement>) => void;
};

function useAppShellSlot(
  slot: "root" | "body" | "main",
  {
    forwardedRef,
    motion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  }: AppShellSlotArgs,
) {
  const scope = useAppShellMotionScope();
  const pointer = hasPointerPhases(motion);
  const part = useMotionPart<HTMLDivElement>({
    scope,
    slot: APP_SHELL_MOTION_SLOTS[slot].slot,
    motion,
    forwardedRef,
    pointerPhases: pointer,
    pressPhases: pointer,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  useOptionalEnterOnMount(scope, slot, part.targetRef);
  return part;
}

export function useAppShellRootMotion(args: AppShellSlotArgs) {
  return useAppShellSlot("root", args);
}

export function useAppShellBodyMotion(args: AppShellSlotArgs) {
  return useAppShellSlot("body", args);
}

export function useAppShellMainMotion(args: AppShellSlotArgs) {
  return useAppShellSlot("main", args);
}
