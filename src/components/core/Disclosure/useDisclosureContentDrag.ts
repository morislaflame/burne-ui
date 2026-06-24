import { useCallback, type PointerEvent as ReactPointerEvent, type RefObject } from "react";

import { prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { motionInteractive } from "@/components/core/utils/motionConfig";

const OPEN_RATIO = 0.38;
const OPEN_VELOCITY = 0.45;
const CLOSE_VELOCITY = -0.45;

import { measureCollapsibleContentHeight } from "@/components/core/utils/useCollapsibleHeight";

function readShellHeight(shell: HTMLElement): number {
  return shell.getBoundingClientRect().height;
}

function syncChevron(chevron: HTMLElement | null, height: number, maxHeight: number) {
  if (!chevron || maxHeight <= 0) return;
  const progress = Math.min(Math.max(height / maxHeight, 0), 1);
  gsap.set(chevron, { rotation: progress * 180 });
}

export function useDisclosureContentDrag(
  shellRef: RefObject<HTMLElement | null>,
  innerRef: RefObject<HTMLElement | null>,
  chevronRef: RefObject<HTMLElement | null>,
  open: boolean,
  setOpen: (next: boolean) => void,
  disabled: boolean,
  skipContentAnimRef: RefObject<boolean>,
): { onPointerDown: (e: ReactPointerEvent<HTMLElement>) => void } {
  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (disabled) return;
      const shell = shellRef.current;
      const inner = innerRef.current;
      if (!shell || !inner) return;
      if (prefersReducedInteractiveHoverLift()) return;

      e.preventDefault();

      const maxHeight = measureCollapsibleContentHeight(inner);
      if (maxHeight <= 0) return;

      const handle = e.currentTarget;
      handle.setPointerCapture(e.pointerId);

      const startClientY = e.clientY;
      const startHeight = readShellHeight(shell);
      let lastClientY = startClientY;
      let lastTime = performance.now();
      let velocity = 0;

      killMotion(shell, chevronRef.current);
      shell.style.overflow = "hidden";
      shell.style.willChange = "height";

      const onMove = (ev: globalThis.PointerEvent) => {
        if (ev.pointerId !== e.pointerId) return;
        const clientY = ev.clientY;
        const delta = clientY - startClientY;
        const now = performance.now();
        const dt = now - lastTime;
        if (dt > 0) velocity = (clientY - lastClientY) / dt;
        lastClientY = clientY;
        lastTime = now;

        const nextHeight = Math.max(0, Math.min(maxHeight, startHeight + delta));
        shell.style.height = `${nextHeight}px`;
        syncChevron(chevronRef.current, nextHeight, maxHeight);
      };

      const onUp = (ev: globalThis.PointerEvent) => {
        if (ev.pointerId !== e.pointerId) return;
        handle.releasePointerCapture(ev.pointerId);
        handle.removeEventListener("pointermove", onMove);
        handle.removeEventListener("pointerup", onUp);
        handle.removeEventListener("pointercancel", onUp);

        const clientY = ev.clientY;
        const delta = clientY - startClientY;
        const currentHeight = Math.max(0, Math.min(maxHeight, startHeight + delta));
        const ratio = currentHeight / maxHeight;
        const vars = { ...motionInteractive(), overwrite: "auto" as const };

        const shouldOpen =
          ratio >= OPEN_RATIO || velocity > OPEN_VELOCITY;
        const shouldClose =
          ratio <= 1 - OPEN_RATIO || velocity < CLOSE_VELOCITY;

        killMotion(shell, chevronRef.current);

        if (!open && shouldOpen) {
          const tl = gsap.timeline({
            onComplete: () => {
              shell.style.willChange = "";
              shell.style.height = "auto";
              shell.style.overflow = "";
              if (skipContentAnimRef) skipContentAnimRef.current = true;
              setOpen(true);
            },
          });
          tl.to(shell, { height: maxHeight, ...vars }, 0);
          if (chevronRef.current) {
            tl.to(chevronRef.current, { rotation: 180, ...vars }, 0);
          }
          return;
        }

        if (open && shouldClose) {
          const tl = gsap.timeline({
            onComplete: () => {
              shell.style.willChange = "";
              shell.style.height = "0px";
              shell.style.overflow = "hidden";
              if (skipContentAnimRef) skipContentAnimRef.current = true;
              setOpen(false);
            },
          });
          tl.to(shell, { height: 0, ...vars }, 0);
          if (chevronRef.current) {
            tl.to(chevronRef.current, { rotation: 0, ...vars }, 0);
          }
          return;
        }

        const snapOpen = ratio >= 0.5;
        const targetHeight = snapOpen ? maxHeight : 0;
        const tl = gsap.timeline({
          onComplete: () => {
            shell.style.willChange = "";
            if (snapOpen) {
              shell.style.height = "auto";
              shell.style.overflow = "";
            } else {
              shell.style.height = "0px";
              shell.style.overflow = "hidden";
            }
            if (skipContentAnimRef) skipContentAnimRef.current = true;
            setOpen(snapOpen);
          },
        });
        tl.to(shell, { height: targetHeight, ...vars }, 0);
        if (chevronRef.current) {
          tl.to(chevronRef.current, { rotation: snapOpen ? 180 : 0, ...vars }, 0);
        }
      };

      handle.addEventListener("pointermove", onMove);
      handle.addEventListener("pointerup", onUp);
      handle.addEventListener("pointercancel", onUp);
    },
    [chevronRef, disabled, innerRef, open, setOpen, shellRef, skipContentAnimRef],
  );

  return { onPointerDown };
}
