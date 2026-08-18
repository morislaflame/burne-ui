import { Fragment, forwardRef, type ForwardedRef, type ReactNode } from "react";

import { Text } from "@/components/core/Text";

import { flattenKbdGroupChildren } from "./kbdAPI";
import { KBD_GROUP_SEPARATOR_ARIA_HIDDEN } from "./kbdA11y";
import { useKbdGroupSlotMotion } from "./kbdAnimations";
import { KbdMotionProvider, useKbdClassNames, useOptionalKbdMotionScope } from "./kbdContext";
import { kbdGroupClass, kbdGroupSeparatorClass } from "./kbdStyles";
import type { KbdGroupProps } from "./kbdTypes";

export const KbdGroup = forwardRef<HTMLSpanElement, KbdGroupProps>(
  function KbdGroup(
    {
      className,
      classNames,
      separator = "+",
      children,
      motion,
      onPointerOver,
      onPointerOut,
      ...rest
    },
    ref,
  ) {
    const parentScope = useOptionalKbdMotionScope();
    const surface = (
      <KbdGroupSurface
        className={className}
        classNames={classNames}
        separator={separator}
        motion={motion}
        forwardedRef={ref}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        rest={rest}
      >
        {children}
      </KbdGroupSurface>
    );

    if (parentScope || motion == null) {
      return surface;
    }

    return (
      <KbdMotionProvider motion={{ group: motion }} defaults={{}}>
        {surface}
      </KbdMotionProvider>
    );
  },
);

function KbdGroupSurface({
  className,
  classNames,
  separator,
  children,
  motion,
  forwardedRef,
  onPointerOver,
  onPointerOut,
  rest,
}: {
  className?: KbdGroupProps["className"];
  classNames?: KbdGroupProps["classNames"];
  separator: ReactNode | null;
  children: KbdGroupProps["children"];
  motion?: KbdGroupProps["motion"];
  forwardedRef: ForwardedRef<HTMLSpanElement>;
  onPointerOver?: KbdGroupProps["onPointerOver"];
  onPointerOut?: KbdGroupProps["onPointerOut"];
  rest: Omit<
    KbdGroupProps,
    | "className"
    | "classNames"
    | "separator"
    | "children"
    | "motion"
    | "onPointerOver"
    | "onPointerOut"
  >;
}) {
  const slotClassNames = useKbdClassNames();
  const items = flattenKbdGroupChildren(children);
  const part = useKbdGroupSlotMotion({
    motion,
    forwardedRef,
    onPointerOver,
    onPointerOut,
  });

  return (
    <span
      ref={part.setRef}
      className={kbdGroupClass(className, classNames?.group ?? slotClassNames.group)}
      {...rest}
      {...part.pointerHandlers}
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
