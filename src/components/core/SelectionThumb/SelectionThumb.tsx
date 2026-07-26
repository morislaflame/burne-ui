import "../utils/glossPanel.css";

import { selectionThumbDecorativeProps } from "./selectionThumbA11y";
import {
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
  size = "base",
  gloss = false,
  shellRef,
  className,
  classNames,
  children,
  ...rest
}: SelectionThumbProps) {
  return (
    <span
      ref={shellRef}
      className={selectionThumbShellClass({
        gloss,
        size,
        className,
        slotRoot: classNames?.root,
      })}
      {...selectionThumbDecorativeProps()}
      {...rest}
    >
      {children}
    </span>
  );
}

SelectionThumb.displayName = "SelectionThumb";

export function SelectionThumbIcon({
  size = "base",
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
