import { useRef } from "react";

import "../utils/glossPanel.css";

import { useSelectionIndicatorAnimation } from "../SelectionIndicator/useSelectionIndicatorAnimation";
import { selectionThumbDecorativeProps } from "./selectionThumbA11y";
import {
  selectionThumbFillClass,
  selectionThumbIconInnerClass,
  selectionThumbIconRootClass,
  selectionThumbShellClass,
} from "./selectionThumbStyles";
import type { SelectionThumbIconProps, SelectionThumbProps } from "./selectionThumbTypes";

export type {
  SelectionThumbClassNames,
  SelectionThumbIconClassNames,
  SelectionThumbIconProps,
  SelectionThumbProps,
} from "./selectionThumbTypes";

export function SelectionThumb({
  active,
  size = "base",
  gloss = false,
  shellRef,
  fillRef: fillRefProp,
  className,
  classNames,
  children,
  ...rest
}: SelectionThumbProps) {
  const internalFillRef = useRef<HTMLSpanElement>(null);
  const fillRef = fillRefProp ?? internalFillRef;

  useSelectionIndicatorAnimation(active, fillRef);

  return (
    <span
      ref={shellRef}
      className={selectionThumbShellClass({
        gloss,
        className,
        slotRoot: classNames?.root,
      })}
      {...selectionThumbDecorativeProps()}
      {...rest}
    >
      <span
        ref={fillRef}
        {...selectionThumbDecorativeProps()}
        className={selectionThumbFillClass({ gloss, slotFill: classNames?.fill })}
        style={{ transform: "scale(0)", opacity: 0 }}
      />
      {children}
    </span>
  );
}

SelectionThumb.displayName = "SelectionThumb";

export function SelectionThumbIcon({
  size = "base",
  highlighted = false,
  gloss = false,
  iconRef,
  className,
  classNames,
  children,
  style,
  ...rest
}: SelectionThumbIconProps) {
  return (
    <span
      ref={iconRef}
      {...selectionThumbDecorativeProps()}
      className={selectionThumbIconRootClass({
        gloss,
        highlighted,
        className,
        slotRoot: classNames?.root,
      })}
      style={style}
      {...rest}
    >
      <span className={selectionThumbIconInnerClass(size, classNames?.icon)}>
        {children}
      </span>
    </span>
  );
}

SelectionThumbIcon.displayName = "SelectionThumbIcon";
