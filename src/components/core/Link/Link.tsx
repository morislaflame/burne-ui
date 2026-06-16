import {
  forwardRef,
  useCallback,
  useRef,
  type AnchorHTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { IoArrowForward } from "react-icons/io5";

import { Text, type TextVariant } from "@/components/core/Text";
import type { ComponentSize } from "@/components/core/utils/componentSize";
import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  shouldSkipInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { getMotionConfig } from "@/components/core/utils/motionConfig";
import { TEXT_COLOR_TRANSITION } from "@/components/core/utils/hoverVariant";
import { cn } from "@/utils/cn";

export type LinkSize = ComponentSize;

export type LinkIconPosition = "start" | "end";

export type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & {
  href: string;
  children: ReactNode;
  size?: LinkSize;
  /** Подчёркивание текста ссылки. */
  underline?: boolean;
  /** Иконка слева от текста. */
  leftIcon?: ReactNode;
  /** Иконка справа от текста. */
  rightIcon?: ReactNode;
  /**
   * Показать стандартную стрелку ↗, если не переданы `leftIcon` / `rightIcon`.
   * По умолчанию `false`.
   */
  showDefaultIcon?: boolean;
  /** Сторона для стандартной стрелки. По умолчанию `end`. */
  defaultIconPosition?: LinkIconPosition;
};

const LINK_TEXT_VARIANT: Record<LinkSize, TextVariant> = {
  small: "small",
  base: "base",
  mid: "mid",
  large: "large",
};

const LINK_ICON_CLASS: Record<LinkSize, string> = {
  small: "icon-small",
  base: "icon-base",
  mid: "icon-mid",
  large: "icon-large",
};

function DefaultLinkIcon({ size }: { size: LinkSize }) {
  return (
    <IoArrowForward
      aria-hidden
      className={cn(LINK_ICON_CLASS[size], "rotate-[-45deg]")}
    />
  );
}

function LinkIconSlot({
  children,
  size,
  muted = false,
}: {
  children: ReactNode;
  size: LinkSize;
  /** Стандартная иконка: muted в покое, primary при hover на ссылке. */
  muted?: boolean;
}) {
  return (
    <span
      className={cn(
        TEXT_COLOR_TRANSITION,
        LINK_ICON_CLASS[size],
        "[&_svg]:size-full",
        muted
          ? "text-muted group-hover/link:text-primary group-focus-visible/link:text-primary"
          : "text-primary",
      )}
      aria-hidden
    >
      {children}
    </span>
  );
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {
    href,
    children,
    className = "",
    size = "base",
    underline = false,
    leftIcon,
    rightIcon,
    showDefaultIcon = false,
    defaultIconPosition = "end",
    onPointerEnter,
    onPointerLeave,
    onPointerDown,
    ...rest
  },
  forwardedRef,
) {
  const motionRef = useRef<HTMLSpanElement>(null);

  const setRefs = useCallback(
    (node: HTMLAnchorElement | null) => {
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef],
  );

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent<HTMLAnchorElement>) => {
      onPointerEnter?.(e);
      if (e.defaultPrevented) return;
      const el = motionRef.current;
      if (!el || shouldSkipInteractiveHoverLift()) return;
      animateInteractiveHoverLift(el, true, getMotionConfig().hoverLiftScale);
    },
    [onPointerEnter],
  );

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent<HTMLAnchorElement>) => {
      onPointerLeave?.(e);
      if (e.defaultPrevented) return;
      const el = motionRef.current;
      if (!el) return;
      animateInteractiveHoverLift(el, false, getMotionConfig().hoverLiftScale);
    },
    [onPointerLeave],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLAnchorElement>) => {
      onPointerDown?.(e);
      if (e.defaultPrevented) return;
      const el = motionRef.current;
      if (!el || shouldSkipInteractiveHoverLift()) return;
      void animateInteractivePressSqueeze(el);
    },
    [onPointerDown],
  );

  const usesDefaultIcon = showDefaultIcon && !leftIcon && !rightIcon;
  const defaultIconNode = usesDefaultIcon ? <DefaultLinkIcon size={size} /> : null;

  let resolvedStart = leftIcon ?? null;
  let resolvedEnd = rightIcon ?? null;
  let defaultIconAtStart = false;
  let defaultIconAtEnd = false;

  if (defaultIconNode) {
    if (defaultIconPosition === "start") {
      resolvedStart = defaultIconNode;
      defaultIconAtStart = true;
    } else {
      resolvedEnd = defaultIconNode;
      defaultIconAtEnd = true;
    }
  }

  return (
    <span ref={motionRef} className="inline-flex origin-center will-change-transform">
      <a
        ref={setRefs as Ref<HTMLAnchorElement>}
        href={href}
        className={cn(
          "group/link inline-flex max-w-full min-w-0 items-center gap-xsmall rounded-mid px-xsmall py-xsmall no-underline outline-none",
          "text-primary",
          "focus-ring",
          className,
        )}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        {...rest}
      >
        {resolvedStart ? (
          <LinkIconSlot size={size} muted={defaultIconAtStart}>
            {resolvedStart}
          </LinkIconSlot>
        ) : null}
        <Text
          as="span"
          variant={LINK_TEXT_VARIANT[size]}
          inheritColor
          className={cn(
            "min-w-0 truncate font-medium text-primary",
            underline && "underline decoration-primary/70 underline-offset-[0.2em]",
          )}
        >
          {children}
        </Text>
        {resolvedEnd ? (
          <LinkIconSlot size={size} muted={defaultIconAtEnd}>
            {resolvedEnd}
          </LinkIconSlot>
        ) : null}
      </a>
    </span>
  );
});

Link.displayName = "Link";
