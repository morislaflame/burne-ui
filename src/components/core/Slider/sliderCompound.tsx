import { Children, isValidElement, type ReactNode } from "react";

import { useSliderTrackContext } from "./sliderTrackContext";

export type SliderThumbKind = "single" | "start" | "end";

export type SliderCompoundThumbProps = {
  thumb?: SliderThumbKind;
  children?: ReactNode;
};

function resolveThumbIcon(children: ReactNode, fallback?: ReactNode): ReactNode {
  if (children == null) return fallback;
  const nodes = Children.toArray(children);
  if (nodes.length === 0) return fallback;
  if (nodes.length === 1 && isValidElement(nodes[0])) {
    const name = (nodes[0].type as { displayName?: string }).displayName;
    if (name === "SliderIcon") {
      return (nodes[0].props as { children?: ReactNode }).children ?? fallback;
    }
  }
  return children;
}

export function SliderCompoundThumb({ thumb = "single", children }: SliderCompoundThumbProps) {
  const ctx = useSliderTrackContext();
  const icon = resolveThumbIcon(children, ctx.icon);
  return ctx.renderThumb(thumb, icon);
}

SliderCompoundThumb.displayName = "SliderThumb";

export type SliderIconProps = {
  children?: ReactNode;
};

export function SliderIcon({ children }: SliderIconProps) {
  return children;
}

SliderIcon.displayName = "SliderIcon";
