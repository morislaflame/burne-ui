import type { RippleDirection } from "@/components/core/utils/pressRipple";

import type { RippleColor } from "./rippleTokens";

export type RippleProps = {
  color?: RippleColor | string;
  disabled?: boolean;
  duration?: number;
  direction?: RippleDirection;
  className?: string;
};

export type { RippleDirection };
