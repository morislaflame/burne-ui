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

import { Button, type ButtonSize, type ButtonVariant } from "@/components/core/Button";
import { ComboBox } from "@/components/core/ComboBox";
import { Dropdown } from "@/components/core/Dropdown";
import { InputControl } from "@/components/core/Input";
import { SearchInput } from "@/components/core/SearchInput";
import { Text, type TextVariant } from "@/components/core/Text";
import "@/components/core/utils/glossInteractive.css";
import {
  ButtonGroupLayoutContext,
  ButtonGroupSegmentContext,
  useOptionalButtonGroupLayout,
  useOptionalButtonGroupSegment,
} from "./buttonGroupContext";
import type { ButtonGroupSegment } from "./buttonGroupSegment";
import { buttonGroupTextSurfaceClasses } from "./buttonGroupSegment";
import { buttonGroupTextFrameClass } from "./buttonGroupLayout";
import { cn } from "@/utils/cn";

function ButtonGroupSegmentProvider({
  segment,
  buttonSize,
  variant,
  children,
}: {
  segment: ButtonGroupSegment;
  buttonSize: ButtonSize;
  variant?: ButtonVariant;
  children: ReactNode;
}) {
  const value = useMemo(
    () => ({ segment, buttonSize, variant }),
    [buttonSize, segment, variant],
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
    const layoutCtx = useOptionalButtonGroupLayout();
    const groupCtx = useOptionalButtonGroupSegment();
    const buttonSize = buttonSizeProp ?? groupCtx?.buttonSize ?? "base";
    const groupSegment = layoutCtx?.segmented
      ? undefined
      : (groupSegmentProp ?? groupCtx?.segment);
    const groupVariant = groupCtx?.variant;

    return (
      <span
        ref={ref}
        {...rest}
        className={cn(
          buttonGroupTextSurfaceClasses(groupSegment),
          groupVariant === "gloss" && "bg-transparent text-foreground",
          "inline-flex items-center",
          buttonGroupTextFrameClass(buttonSize),
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

function ButtonGroupSeparator({ orientation }: { orientation: ButtonGroupOrientation }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none shrink-0",
        orientation === "horizontal"
          ? "my-[var(--border-width)] self-stretch border-r-token"
          : "mx-[var(--border-width)] self-stretch border-b-token",
      )}
    />
  );
}

function isGroupSegmentSlot(child: ReactElement): boolean {
  return (
    child.type === Button ||
    child.type === ButtonGroupText ||
    child.type === InputControl ||
    child.type === ComboBox ||
    child.type === SearchInput ||
    child.type === Dropdown
  );
}

export type ButtonGroupOrientation = "horizontal" | "vertical";

export type ButtonGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "role" | "children"> & {
  orientation?: ButtonGroupOrientation;
  segmented?: boolean;
  buttonSize?: ButtonSize;
  variant?: ButtonVariant;
  children: ReactNode;
};

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  {
    children,
    className = "",
    orientation = "horizontal",
    segmented = false,
    buttonSize = "base",
    variant = "default",
    ...rest
  },
  ref,
) {
  const flat = flattenFragmentChildren(children);
  const segmentCount = flat.reduce((n, el) => n + (isGroupSegmentSlot(el) ? 1 : 0), 0);
  const layoutValue = useMemo(() => ({ segmented }), [segmented]);

  let segmentIndex = -1;

  return (
    <ButtonGroupLayoutContext.Provider value={layoutValue}>
      <div
        ref={ref}
        role="group"
        className={cn(
          "inline-flex text-left w-fit",
          !segmented && cn(
            "relative rounded-base",
            variant === "gloss"
              ? "gloss-panel gloss-deep border-0 text-foreground"
              : "after:pointer-events-none after:absolute after:inset-0 after:rounded-base after:border-token after:content-['']",
          ),
          orientation === "horizontal"
            ? cn("flex-row flex-nowrap items-stretch", segmented && "gap-xsmall")
            : cn("flex-col flex-nowrap items-stretch", segmented && "gap-xsmall"),
          className,
        )}
        {...rest}
      >
        {flat.map((child, i) => {
          if (!isGroupSegmentSlot(child)) {
            return <Fragment key={child.key ?? `bg-wrap-${i}`}>{child}</Fragment>;
          }

          if (segmented) {
            return <Fragment key={child.key ?? `bg-item-${i}`}>{child}</Fragment>;
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
            <Fragment key={child.key ?? `bg-seg-${i}`}>
              <ButtonGroupSegmentProvider
                segment={seg}
                buttonSize={buttonSize}
                variant={variant}
              >
                {child}
              </ButtonGroupSegmentProvider>
              {variant !== "gloss" && position !== "last" && position !== "only" ? (
                <ButtonGroupSeparator orientation={orientation} />
              ) : null}
            </Fragment>
          );
        })}
      </div>
    </ButtonGroupLayoutContext.Provider>
  );
});

ButtonGroup.displayName = "ButtonGroup";
