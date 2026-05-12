import {
  Children,
  Fragment,
  cloneElement,
  forwardRef,
  isValidElement,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";

import { Button, type ButtonProps, type ButtonSize } from "@/components/core/Button";
import { Input, type InputProps, type InputSize } from "@/components/core/Input";

/** `Input` не имеет `small`; при `buttonSize="small"` используем поле как `base`. */
function inputSizeFromButtonSize(bs: ButtonSize): InputSize {
  return bs === "small" ? "base" : bs;
}
import { Text, type TextVariant } from "@/components/core/Text";
import type { ButtonGroupSegment } from "@/components/core/utils/buttonGroupSegment";
import { buttonGroupTextSurfaceClasses } from "@/components/core/utils/buttonGroupSegment";
import { cn } from "@/utils/cn";

const BUTTON_GROUP_TEXT_VARIANT: Record<ButtonSize, TextVariant> = {
  small: "small",
  base: "base",
  large: "mid",
  xlarge: "mid",
};

const BUTTON_GROUP_TEXT_FRAME: Record<ButtonSize, string> = {
  small: "min-h-7 px-base py-xsmall",
  base: "min-h-8 px-plus py-small",
  large: "min-h-10 px-mid py-base",
  xlarge: "min-h-12 px-large py-base",
};

function flattenFragmentChildren(children: ReactNode): React.ReactElement[] {
  const out: React.ReactElement[] = [];
  Children.forEach(children, (node) => {
    if (!isValidElement(node)) return;
    if (node.type === Fragment) {
      const { children: fragKids } = node.props as {
        children?: ReactNode;
      };
      out.push(...flattenFragmentChildren(fragKids));
      return;
    }
    out.push(node);
  });
  return out;
}

export type ButtonGroupTextProps = ComponentPropsWithoutRef<"span"> & {
  /**
   * @internal Позиция в группе; выставляется из `<ButtonGroup>`.
   */
  groupSegment?: ButtonGroupSegment;
  /** Высота/отступы в духу `Button` того же размера. По умолчанию `base`. */
  buttonSize?: ButtonSize;
};

/**
 * Неактивная подпись внутри склеенной группы (`Button`, `SearchInput`-рядом и т.д.).
 */
export const ButtonGroupText = forwardRef<HTMLSpanElement, ButtonGroupTextProps>(
  function ButtonGroupText(
    {
      children,
      className = "",
      buttonSize = "base",
      groupSegment,
      ...rest
    },
    ref,
  ) {
    return (
      <span
        ref={ref}
        {...rest}
        className={cn(
          buttonGroupTextSurfaceClasses(groupSegment),
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
  return child.type === Button || child.type === ButtonGroupText || child.type === Input;
}

export type ButtonGroupOrientation = "horizontal" | "vertical";

export type ButtonGroupProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "role" | "children"
> & {
  /** Ряд или колонка. По умолчанию `horizontal`. */
  orientation?: ButtonGroupOrientation;
  /** Совпадает с `size` вложенных `Button`; влияет на `ButtonGroupText`. По умолчанию `base`. */
  buttonSize?: ButtonSize;
  children: ReactNode;
};

/**
 * Группа сегментов без зазоров: общий контур скругления только по внешним краям (`Button`, `Input`, `ButtonGroup.Text`).
 *
 * Скругления у `SearchInput` по-прежнему задаются инлайново — для тулбара используйте `Input` в группе или отдельный ряд.
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  function ButtonGroup(
    {
      children,
      className = "",
      orientation = "horizontal",
      buttonSize = "base",
      ...rest
    },
    ref,
  ) {
    const flat = flattenFragmentChildren(children);
    const segmentCount = flat.reduce(
      (n, el) => n + (isGroupSegmentSlot(el) ? 1 : 0),
      0,
    );

    let segmentIndex = -1;

    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          "inline-flex",
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

          if (child.type === Button) {
            const btn = child as ReactElement<ButtonProps>;
            const next = cloneElement(btn, {
              groupSegment: btn.props.groupSegment ?? seg,
              size: btn.props.size ?? buttonSize,
            });
            return <Fragment key={child.key ?? `bg-btn-${i}`}>{next}</Fragment>;
          }

          if (child.type === Input) {
            const inp = child as ReactElement<InputProps>;
            const nextInp = cloneElement(inp, {
              groupSegment: inp.props.groupSegment ?? seg,
              size: inp.props.size ?? inputSizeFromButtonSize(buttonSize),
            });
            return <Fragment key={child.key ?? `bg-inp-${i}`}>{nextInp}</Fragment>;
          }

          const textEl = child as ReactElement<ButtonGroupTextProps>;
          const nextText = cloneElement(textEl, {
            groupSegment: textEl.props.groupSegment ?? seg,
            buttonSize: textEl.props.buttonSize ?? buttonSize,
          });
          return <Fragment key={child.key ?? `bg-t-${i}`}>{nextText}</Fragment>;
        })}
      </div>
    );
  },
);

ButtonGroup.displayName = "ButtonGroup";
