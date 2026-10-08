import { useMemo, type ReactNode } from "react";

import { Popover } from "@/components/core/Popover";

import { isHoverCardCompound, splitHoverCardMotion } from "./hoverCardAPI";
import { resolveHoverCardMotionDefaults } from "./hoverCardAnimations";
import { HoverCardHostProvider, HoverCardMotionProvider } from "./hoverCardContext";
import { HoverCardBody, HoverCardContent, HoverCardDescription, HoverCardEscapeFocus, HoverCardHeader, HoverCardTitle, HoverCardTrigger } from "./hoverCardParts";
import type { HoverCardProps } from "./hoverCardTypes";
import { useHoverCardRootState } from "./useHoverCardRootState";

function hoverCardSimple(
  trigger: ReactNode,
  title: ReactNode,
  description: ReactNode,
  showArrow: boolean,
  children: ReactNode,
) {
  return (
    <>
      <HoverCardTrigger>{trigger}</HoverCardTrigger>
      <HoverCardContent showArrow={showArrow}>
        {title != null || description != null ? (
          <HoverCardHeader>
            {title != null ? <HoverCardTitle>{title}</HoverCardTitle> : null}
            {description != null ? <HoverCardDescription>{description}</HoverCardDescription> : null}
          </HoverCardHeader>
        ) : null}
        {children != null ? <HoverCardBody>{children}</HoverCardBody> : null}
      </HoverCardContent>
    </>
  );
}

export function HoverCardRoot({
  children,
  trigger,
  title,
  description,
  showArrow = true,
  classNames,
  size = "base",
  variant,
  side = "bottom",
  open,
  defaultOpen = false,
  onOpenChange,
  openDelay,
  closeDelay,
  shouldDismiss,
  portalContainer,
  motion,
  motionController,
  motionState,
  motionPayload,
  playInitialState,
}: HoverCardProps) {
  const compound = isHoverCardCompound(children);
  const { open: openState, setOpen, host } = useHoverCardRootState({
    open,
    defaultOpen,
    onOpenChange,
    openDelay,
    closeDelay,
    motionController,
    motionState,
    motionPayload,
    playInitialState,
  });
  const { trigger: triggerMotion, popoverMotion } = useMemo(
    () => splitHoverCardMotion(motion),
    [motion],
  );
  const triggerMotionMap = useMemo(() => ({ trigger: triggerMotion }), [triggerMotion]);

  return (
    <HoverCardHostProvider value={host}>
      <HoverCardMotionProvider motion={triggerMotionMap} defaults={resolveHoverCardMotionDefaults()}>
        <Popover
          classNames={classNames}
          size={size}
          variant={variant}
          side={side}
          open={openState}
          onOpenChange={setOpen}
          shouldDismiss={shouldDismiss}
          restoreFocus={false}
          portalContainer={portalContainer}
          motion={popoverMotion}
        >
          <HoverCardEscapeFocus />
          {compound ? children : hoverCardSimple(trigger, title, description, showArrow, children)}
        </Popover>
      </HoverCardMotionProvider>
    </HoverCardHostProvider>
  );
}

HoverCardRoot.displayName = "HoverCard";
