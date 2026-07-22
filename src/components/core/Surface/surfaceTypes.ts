import type { HTMLAttributes } from "react";

import type { ShadowSize } from "@/tokens/shadows";

export type SurfaceVariant = "default" | "secondary" | "tertiary" | "gloss";

export type SurfaceShadow = ShadowSize;

export type SurfacePadding = "none" | "small" | "base" | "plus" | "mid";

export type SurfaceRadius = "base" | "mid" | "large";

export type SurfaceClassNames = {
  root?: string;
  glossContent?: string;
};

export type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
  variant?: SurfaceVariant;
  shadow?: SurfaceShadow;
  padding?: SurfacePadding;
  radius?: SurfaceRadius;
  classNames?: SurfaceClassNames;
};
