import {
  Children,
  Fragment,
  forwardRef,
  isValidElement,
  useMemo,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";

import { Button, type ButtonSize } from "@/components/core/Button";
import { InputControl } from "@/components/core/Input/Input";
import { Text, type TextVariant } from "@/components/core/Text";
import {
  ButtonGroupSegmentContext,
  useOptionalButtonGroupSegment,
} from "@/components/core/utils/buttonGroupContext";
import type { ButtonGroupSegment } from "@/components/core/utils/buttonGroupSegment";
import { buttonGroupTextSurfaceClasses } from "@/components/core/utils/buttonGroupSegment";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";
import { cn } from "@/utils/cn";

function ButtonGroupSegmentProvider({
  segment,
  buttonSize,
  children,
}: {
  segment: ButtonGroupSegment;
  buttonSize: ButtonSize;
  children: ReactNode;
}) {
  const value = useMemo(
    () => ({ segment, buttonSize }),
    [buttonSize, segment.orientation, segment.position],
  );
  return (
    <ButtonGroupSegmentContext.Provider value={value}>{children}</ButtonGroupSegmentContext.Provider>
  );
}

const BUTTON_GROUP_TEXT_VARIANT: Record<ButtonSize, TextVariant> = {
  small: "small",
  base: "base",
  mid: "mid",
  large: "mid",
};

const BUTTON_GROUP_TEXT_FRAME: Record<ButtonSize, string> = {
  small: `${CONTROL_SIZE_LAYOUT.small.h} ${CONTROL_SIZE_LAYOUT.small.padX}`,
  base: `${CONTROL_SIZE_LAYOUT.base.h} ${CONTROL_SIZE_LAYOUT.base.padX}`,
  mid: `${CONTROL_SIZE_LAYOUT.mid.h} ${CONTROL_SIZE_LAYOUT.mid.padX}`,
  large: `${CONTROL_SIZE_LAYOUT.large.h} ${CONTROL_SIZE_LAYOUT.large.padX}`,
};

function flattenFragmentChildren(children: ReactNode): React.ReactElement[] {
  const out: React.ReactElement[] = [];
  Children.forEach(children, (node) => {
    if (!isValidElement(node)) return;
    if (node.type === Fragment) {
      const { children: fragKids } = node.props as { children?: ReactNode };
      out.push(...flattenFragmentChildren(fragKids));
      return;
    }
    out.push(node);
  });
  return out;
}

export type ButtonGroupTextProps = ComponentPropsWithoutRef<"span"> & {
  groupSegment?: ButtonGroupSegment;
  buttonSize?: ButtonSize;
};

export const ButtonGroupText = forwardRef<HTMLSpanElement, ButtonGroupTextProps>(
  function ButtonGroupText(
    { children, className = "", buttonSize: buttonSizeProp, groupSegment: groupSegmentProp, ...rest },
    ref,
  ) {
    const groupCtx = useOptionalButtonGroupSegment();
    const buttonSize = buttonSizeProp ?? groupCtx?.buttonSize ?? "base";
    const groupSegment = groupSegmentProp ?? groupCtx?.segment;

    return (
      <span
        ref={ref}
        {...rest}
        className={cn(
          buttonGroupTextSurfaceClasses(groupSegment),
          "inline-flex items-center",
          BUTTON_GROUP_TEXT_FRAME[buttonSize],
          className,
        )}
      >
        <Text
          variant={BUTTON_GROUP_TEXT_VARIANT[buttonSize]}
          inheritColor
          as="span"
          className="max-w-[12rem] truncate font-medium whitespace-nowrap md:max-w-[18rem]"
        >
          {children}
        </Text>
      </span>
    );
  },
);

ButtonGroupText.displayName = "ButtonGroupText";

function isGroupSegmentSlot(child: ReactElement): boolean {
  return child.type === Button || child.type === ButtonGroupText || child.type === InputControl;
}

export type ButtonGroupOrientation = "horizontal" | "vertical";

export type ButtonGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "role" | "children"> & {
  orientation?: ButtonGroupOrientation;
  buttonSize?: ButtonSize;
  children: ReactNode;
};

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { children, className = "", orientation = "horizontal", buttonSize = "base", ...rest },
  ref,
) {
  const flat = flattenFragmentChildren(children);
  const segmentCount = flat.reduce((n, el) => n + (isGroupSegmentSlot(el) ? 1 : 0), 0);

  let segmentIndex = -1;

  return (
    <div
      ref={ref}
      role="group"
      className={cn(
        "inline-flex text-left",
        orientation === "horizontal"
          ? "flex-row flex-nowrap items-stretch"
          : "flex-col flex-nowrap items-stretch",
        className,
      )}
      {...rest}
    >
      {flat.map((child, i) => {
        if (!isGroupSegmentSlot(child)) {
          return <Fragment key={child.key ?? `bg-wrap-${i}`}>{child}</Fragment>;
        }

        segmentIndex += 1;
        const position =
          segmentCount <= 1
            ? ("only" as const)
            : segmentIndex === 0
              ? ("first" as const)
              : segmentIndex === segmentCount - 1
                ? ("last" as const)
                : ("middle" as const);

        const seg: ButtonGroupSegment = { orientation, position };

        return (
          <ButtonGroupSegmentProvider
            key={child.key ?? `bg-seg-${i}`}
            segment={seg}
            buttonSize={buttonSize}
          >
            {child}
          </ButtonGroupSegmentProvider>
        );
      })}
    </div>
  );
});

ButtonGroup.displayName = "ButtonGroup";
