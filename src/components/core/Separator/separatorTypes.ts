import type { HTMLAttributes } from "react";

export type SeparatorOrientation = "horizontal" | "vertical";

export type SeparatorProps = Omit<HTMLAttributes<HTMLElement>, "role"> & {
  orientation?: SeparatorOrientation;
};
