import { Fragment, type ReactNode } from "react";

import { Text } from "@/components/core/Text";

import { flattenKbdGroupChildren } from "./kbdAPI";
import { KBD_GROUP_SEPARATOR_ARIA_HIDDEN } from "./kbdA11y";
import { useKbdClassNames } from "./kbdContext";
import {
  KBD_TEXT_VARIANT,
  kbdGroupClass,
  kbdGroupSeparatorClass,
} from "./kbdStyles";
import type { KbdGroupProps, KbdSize } from "./kbdTypes";

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
              variant="tools"
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

export function KbdBody({
  size,
  children,
}: {
  size: KbdSize;
  children: ReactNode;
}) {
  if (children == null || children === false) return null;

  if (typeof children === "string" || typeof children === "number") {
    return (
      <Text as="span" variant={KBD_TEXT_VARIANT[size]} inheritColor>
        {children}
      </Text>
    );
  }

  return children;
}
