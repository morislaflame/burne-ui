import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ImgHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";

import {
  Tooltip,
  type TooltipSide,
  type TooltipSize,
  type TooltipVariant,
} from "@/components/core/Tooltip";
import { getMotionConfig, motionContentFade, motionInteractive } from "@/components/core/utils/motionConfig";
import { prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import { Text, type TextVariant } from "@/components/core/Text";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import { cn } from "@/utils/cn";

/** Размер круга аватара. */
export type AvatarSize = "small" | "base" | "mid" | "large";

export type AvatarProps = Omit<HTMLAttributes<HTMLDivElement>, "aria-label"> & {
  /** Круг диаметром small / base / mid / large. По умолчанию `base`. */
  size?: AvatarSize;
  /** Подпись пользователя — первая буква во `Avatar.Fallback`, если там нет текста; также `aria-label` корня. */
  label?: string;
  /** URL фото — только **simple API** (без `children`). В compound игнорируется. */
  src?: string;
  /** `alt` для `<img>` в simple API. По умолчанию пустая строка. */
  alt?: string;
  /** `loading` для `<img>` в simple API. */
  loading?: ImgHTMLAttributes<HTMLImageElement>["loading"];
  /** Никнейм во всплывающем `Tooltip` при наведении. Без текста тултип не показывается. */
  nickname?: string;
  /** Размер тултипа при заданном `nickname`. По умолчанию `base`. */
  tooltipSize?: TooltipSize;
  /** Вариант тултипа (как у `Alert`). По умолчанию `default`. */
  tooltipVariant?: TooltipVariant;
  /** Сторона тултипа относительно аватара при `nickname`. По умолчанию `top`. */
  tooltipSide?: TooltipSide;
};

export type AvatarImageProps = ImgHTMLAttributes<HTMLImageElement>;

export type AvatarFallbackProps = HTMLAttributes<HTMLSpanElement>;

export type AvatarGroupProps = HTMLAttributes<HTMLDivElement>;

type ImageStatus = "idle" | "loaded" | "error";

type AvatarContextValue = {
  size: AvatarSize;
  label: string | undefined;
  imageStatus: ImageStatus;
  onImageLoad: () => void;
  onImageError: () => void;
};

const AvatarContext = createContext<AvatarContextValue | null>(null);

function useAvatarContext(component: string): AvatarContextValue {
  const ctx = useContext(AvatarContext);
  if (!ctx) {
    throw new Error(`${component} должен использоваться внутри <Avatar>`);
  }
  return ctx;
}

const SIZE_CLASS: Record<AvatarSize, { root: string }> = {
  small: { root: "avatar-size-small" },
  base: { root: "avatar-size-base" },
  mid: { root: "avatar-size-mid" },
  large: { root: "avatar-size-large" },
};

const AVATAR_FALLBACK_TEXT: Record<
  AvatarSize,
  { variant: TextVariant; className: string }
> = {
  small: {
    variant: "small",
    className: "font-semibold uppercase",
  },
  base: {
    variant: "base",
    className: "font-semibold uppercase",
  },
  mid: {
    variant: "mid",
    className: "font-semibold uppercase",
  },
  large: {
    variant: "header-2",
    className: "font-semibold uppercase",
  },
};

function letterFromLabel(label: string | undefined): string {
  const t = label?.trim();
  if (!t) return "?";
  const first = [...t][0];
  return first ? first.toLocaleUpperCase() : "?";
}

export const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  function AvatarImage({ className = "", onLoad, onError, ...rest }, ref) {
    const { imageStatus, onImageLoad, onImageError } = useAvatarContext("Avatar.Image");
    const imgRef = useRef<HTMLImageElement | null>(null);

    const setImgRef = useCallback(
      (node: HTMLImageElement | null) => {
        imgRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const mergedOnLoad = useCallback(
      (e: React.SyntheticEvent<HTMLImageElement>) => {
        onLoad?.(e);
        if (!e.defaultPrevented) onImageLoad();
      },
      [onLoad, onImageLoad],
    );

    const mergedOnError = useCallback(
      (e: React.SyntheticEvent<HTMLImageElement>) => {
        onError?.(e);
        if (!e.defaultPrevented) onImageError();
      },
      [onError, onImageError],
    );

    const visible = imageStatus === "loaded";

    useLayoutEffect(() => {
      const el = imgRef.current;
      if (!el) return;

      const reduceMotion =
        prefersReducedInteractiveHoverLift() || !getMotionConfig().enableContentFade;

      killMotion(el);

      if (reduceMotion) {
        gsap.set(el, { autoAlpha: visible ? 1 : 0 });
        return;
      }

      gsap.to(el, {
        autoAlpha: visible ? 1 : 0,
        ...motionContentFade(),
        overwrite: "auto",
      });
    }, [visible]);

    return (
      <img
        ref={setImgRef}
        className={cn(
          "absolute inset-0 z-[1] size-full object-cover",
          !visible && "pointer-events-none",
          className,
        )}
        alt={rest.alt ?? ""}
        onLoad={mergedOnLoad}
        onError={mergedOnError}
        {...rest}
      />
    );
  },
);

export const AvatarFallback = forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  function AvatarFallback({ className = "", children, ...rest }, ref) {
    const { label, imageStatus, size } = useAvatarContext("Avatar.Fallback");

    const show = imageStatus !== "loaded";

    const hasCustomChild =
      children !== undefined && children !== null && children !== false && children !== "";

    const text = hasCustomChild ? children : letterFromLabel(label);

    const fb = AVATAR_FALLBACK_TEXT[size];

    return (
      <span
        ref={ref}
        className={cn(
          "absolute inset-0 z-0 flex items-center justify-center bg-[color-mix(in_oklab,var(--color-primary)_18%,var(--color-surface))] text-primary",
          show ? "opacity-100" : "pointer-events-none opacity-0",
          className,
        )}
        aria-hidden
        {...rest}
      >
        <Text as="span" variant={fb.variant} inheritColor className={fb.className}>
          {text}
        </Text>
      </span>
    );
  },
);

export const AvatarRoot = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  {
    size = "base",
    label,
    src,
    alt = "",
    loading,
    nickname,
    tooltipSize = "base",
    tooltipVariant = "default",
    tooltipSide = "top",
    className = "",
    children,
    role,
    ...rest
  },
  ref,
) {
  const [imageStatus, setImageStatus] = useState<ImageStatus>("idle");

  const onImageLoad = useCallback(() => {
    setImageStatus("loaded");
  }, []);

  const onImageError = useCallback(() => {
    setImageStatus("error");
  }, []);

  const ctx = useMemo<AvatarContextValue>(
    () => ({
      size,
      label,
      imageStatus,
      onImageLoad,
      onImageError,
    }),
    [size, label, imageStatus, onImageLoad, onImageError],
  );

  const isCompound = hasCompoundChildren(children);
  const hasLabel = Boolean(label?.trim());
  const nick = nickname?.trim();

  const avatarContent = isCompound ? (
    children
  ) : (
    <>
      {src ? (
        <AvatarImage src={src} alt={alt} loading={loading} />
      ) : null}
      <AvatarFallback />
    </>
  );

  const shell = (
    <div
      ref={ref}
      role={role ?? "group"}
      className={cn(
        "relative inline-flex shrink-0 select-none overflow-hidden rounded-full bg-surface text-left ring-2 ring-background",
        SIZE_CLASS[size].root,
        className,
      )}
      aria-label={hasLabel ? label!.trim() : undefined}
      {...rest}
    >
      {avatarContent}
    </div>
  );

  return (
    <AvatarContext.Provider value={ctx}>
      {nick ? (
        <Tooltip size={tooltipSize} variant={tooltipVariant} side={tooltipSide}>
          <Tooltip.Trigger>{shell}</Tooltip.Trigger>
          <Tooltip.Content>{nick}</Tooltip.Content>
        </Tooltip>
      ) : (
        shell
      )}
    </AvatarContext.Provider>
  );
});

/** Аватар: simple (`src` + `label`) или compound (`Avatar.Image` / `Avatar.Fallback`). */
const AVATAR_GROUP_HOVER_TRANSLATE_Y = -10;
const AVATAR_GROUP_HOVER_SCALE = 1.08;

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  function AvatarGroup({ className = "", children, ...rest }, ref) {
    const mapped = Children.toArray(children).filter(isValidElement) as ReactElement[];

    return (
      <div
        ref={ref}
        role="group"
        className={cn("flex flex-row flex-nowrap items-center text-left", className)}
        {...rest}
      >
        {mapped.map((child, index) => (
          <AvatarGroupItem key={child.key ?? index} stackIndex={index}>
            {child}
          </AvatarGroupItem>
        ))}
      </div>
    );
  },
);

function AvatarGroupItem({
  stackIndex,
  children,
}: {
  stackIndex: number;
  children: ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = prefersReducedInteractiveHoverLift();

  const applyRest = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    killMotion(el);
    if (reduced) {
      el.style.transform = "";
      return;
    }
    gsap.to(el, { y: 0, scale: 1, ...motionInteractive(), overwrite: "auto" });
  }, [reduced]);

  const applyLift = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    killMotion(el);
    if (reduced) {
      el.style.transform = `translateY(${AVATAR_GROUP_HOVER_TRANSLATE_Y}px) scale(${AVATAR_GROUP_HOVER_SCALE})`;
      return;
    }
    gsap.to(el, {
      y: AVATAR_GROUP_HOVER_TRANSLATE_Y,
      scale: AVATAR_GROUP_HOVER_SCALE,
      ...motionInteractive(),
      overwrite: "auto",
    });
  }, [reduced]);

  useEffect(() => {
    const el = wrapRef.current;
    return () => {
      if (el) killMotion(el);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{ transformOrigin: "center bottom" }}
      className={cn(
        "relative inline-flex will-change-transform",
        stackIndex > 0 && "-ml-plus",
      )}
      onPointerEnter={applyLift}
      onPointerLeave={applyRest}
    >
      {children}
    </div>
  );
}
