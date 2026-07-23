import { Fragment } from "react";

import { Text } from "@/components/core/Text";

import { flattenKbdGroupChildren } from "./kbdAPI";
import { KBD_GROUP_SEPARATOR_ARIA_HIDDEN } from "./kbdA11y";
import { useKbdClassNames } from "./kbdContext";
import { kbdGroupClass, kbdGroupSeparatorClass } from "./kbdStyles";
import type { KbdGroupProps } from "./kbdTypes";

export function KbdGroup({
  className,
  classNames,
  separator = "+",
  children,
  ...rest
}: KbdGroupProps) {
  const slotClassNames = useKbdClassNames();
  const items = flattenKbdGroupChildren(children);

  return (
    <span
      className={kbdGroupClass(className, classNames?.group ?? slotClassNames.group)}
      {...rest}
    >
      {items.map((child, index) => (
        <Fragment key={index}>
          {index > 0 && separator != null ? (
            <Text
              as="span"
              variant="xsmall"
              aria-hidden={KBD_GROUP_SEPARATOR_ARIA_HIDDEN}
              className={kbdGroupSeparatorClass(
                classNames?.separator ?? slotClassNames.separator,
              )}
            >
              {separator}
            </Text>
          ) : null}
          {child}
        </Fragment>
      ))}
    </span>
  );
}

KbdGroup.displayName = "KbdGroup";

export { KbdText } from "./kbdTextPart";
