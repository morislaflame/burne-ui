import {
  Children,
  createContext,
  isValidElement,
  useContext,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from "react";

import { cn } from "@/utils/cn";

import type { SliderOrientation, SliderSize } from "./Slider";

export type SliderThumbKind = "single" | "start" | "end";

export type SliderTrackContextValue = {
  fillRef: RefObject<HTMLSpanElement | null>;
  fillClassResolved: string;
  railClass: string;
  markNodes: ReactNode;
  size: SliderSize;
  orientation: SliderOrientation;
  disabled?: boolean;
  icon?: ReactNode;
  range: boolean;
  renderThumb: (kind: SliderThumbKind, iconOverride?: ReactNode) => ReactNode;
};

const SliderTrackContext = createContext<SliderTrackContextValue | null>(null);

function useSliderTrackContext() {
  const ctx = useContext(SliderTrackContext);
  if (!ctx) {
    throw new Error("Slider.Rail, Slider.Fill, Slider.Thumb, Slider.Icon — внутри Slider.Track");
  }
  return ctx;
}

export function SliderTrackProvider({
  value,
  children,
}: {
  value: SliderTrackContextValue;
  children: ReactNode;
}) {
  return (
    <SliderTrackContext.Provider value={value}>{children}</SliderTrackContext.Provider>
  );
}

export type SliderRailProps = HTMLAttributes<HTMLDivElement>;

export function SliderRail({ className, children, ...rest }: SliderRailProps) {
  const ctx = useSliderTrackContext();

  return (
    <div className={cn(ctx.railClass, className)} aria-hidden {...rest}>
      {children ?? (
        <>
          <SliderFill />
          {ctx.markNodes}
        </>
      )}
    </div>
  );
}

SliderRail.displayName = "SliderRail";

export type SliderFillProps = HTMLAttributes<HTMLSpanElement>;

export function SliderFill({ className, ...rest }: SliderFillProps) {
  const ctx = useSliderTrackContext();

  return (
    <span ref={ctx.fillRef} className={cn(ctx.fillClassResolved, className)} {...rest} />
  );
}

SliderFill.displayName = "SliderFill";

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

