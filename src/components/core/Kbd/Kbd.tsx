import { forwardRef } from "react";

import { mergeKbdSlotClass } from "./kbdAPI";
import { useKbdAnimations } from "./kbdAnimations";
import { KbdClassNamesProvider } from "./kbdContext";
import { KbdBody } from "./kbdParts";
import type { KbdProps } from "./kbdTypes";
import { useKbdRootState } from "./useKbdRootState";

export type {
  KbdProps,
  KbdVariant,
  KbdSize,
  KbdClassNames,
  KbdGroupProps,
} from "./kbdTypes";

export const KbdRoot = forwardRef<HTMLElement, KbdProps>(function Kbd(
  {
    variant = "default",
    size = "base",
    classNames,
    className = "",
    children,
    hoverLift = true,
    onPointerOver,
    onPointerOut,
    ...rest
  },
  ref,
) {
  const state = useKbdRootState({
    variant,
    size,
    className,
    classNames,
  });

  const animations = useKbdAnimations({
    variant: state.variant,
    hoverLift,
    forwardedRef: ref,
    onPointerOver,
    onPointerOut,
  });

  return (
    <KbdClassNamesProvider classNames={classNames}>
      <kbd
        ref={animations.setMergedRef}
        className={mergeKbdSlotClass(
          state.rootClass,
          animations.motionClass,
          animations.glossMotionClass,
        )}
        {...animations.pointerHandlers}
        {...rest}
      >
        <KbdBody size={state.size}>{children}</KbdBody>
      </kbd>
    </KbdClassNamesProvider>
  );
});

KbdRoot.displayName = "KbdRoot";
