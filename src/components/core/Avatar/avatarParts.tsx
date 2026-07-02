import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useRef,
  type ReactElement,
} from "react";

import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

import { letterFromLabel } from "./avatarAPI";
import { AVATAR_FALLBACK_ARIA_HIDDEN, avatarGroupRole } from "./avatarA11y";
import { useAvatarImageFade, useAvatarGroupItemMotion } from "./avatarAnimations";
import {
  AvatarClassNamesProvider,
  useAvatarClassNames,
  useAvatarContext,
} from "./avatarContext";
import {
  AVATAR_FALLBACK_TEXT,
  AVATAR_GLOSS_SHADOW_CLASS,
  avatarFallbackClass,
  avatarGroupClass,
  avatarGroupItemClass,
  avatarImageClass,
  avatarRootClass,
  avatarGlossWrapClass,
  AVATAR_GROUP_ITEM_TRANSFORM_ORIGIN,
} from "./avatarStyles";
import type {
  AvatarFallbackProps,
  AvatarGroupProps,
  AvatarGroupItemProps,
  AvatarImageProps,
  AvatarShellProps,
  AvatarSimpleContentProps,
} from "./avatarTypes";

export const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  function AvatarImage({ className = "", onLoad, onError, ...rest }, ref) {
    const { imageStatus, onImageLoad, onImageError } = useAvatarContext("Avatar.Image");
    const slotClassNames = useAvatarClassNames();
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
    useAvatarImageFade(visible, imgRef);

    return (
      <img
        ref={setImgRef}
        className={avatarImageClass(visible, cn(slotClassNames.image, className))}
        alt={rest.alt ?? ""}
        onLoad={mergedOnLoad}
        onError={mergedOnError}
        {...rest}
      />
    );
  },
);

AvatarImage.displayName = "AvatarImage";

export const AvatarFallback = forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  function AvatarFallback({ className = "", children, ...rest }, ref) {
    const { label, imageStatus, size } = useAvatarContext("Avatar.Fallback");
    const slotClassNames = useAvatarClassNames();

    const show = imageStatus !== "loaded";

    const hasCustomChild =
      children !== undefined && children !== null && children !== false && children !== "";

    const text = hasCustomChild ? children : letterFromLabel(label);

    const fb = AVATAR_FALLBACK_TEXT[size];

    return (
      <span
        ref={ref}
        className={avatarFallbackClass(show, cn(slotClassNames.fallback, className))}
        aria-hidden={AVATAR_FALLBACK_ARIA_HIDDEN}
        {...rest}
      >
        <Text as="span" variant={fb.variant} inheritColor className={fb.className}>
          {text}
        </Text>
      </span>
    );
  },
);

AvatarFallback.displayName = "AvatarFallback";

export function AvatarSimpleContent({ src, alt = "", loading }: AvatarSimpleContentProps) {
  return (
    <>
      {src ? <AvatarImage src={src} alt={alt} loading={loading} /> : null}
      <AvatarFallback />
    </>
  );
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  function AvatarGroup({ className = "", classNames, children, ...rest }, ref) {
    const slotClassNames = useAvatarClassNames();
    const mapped = Children.toArray(children).filter(isValidElement) as ReactElement[];

    return (
      <AvatarClassNamesProvider classNames={classNames}>
        <div
          ref={ref}
          role={avatarGroupRole()}
          className={avatarGroupClass(cn(slotClassNames.group, className))}
          {...rest}
        >
          {mapped.map((child, index) => (
            <AvatarGroupItem key={child.key ?? index} stackIndex={index}>
              {child}
            </AvatarGroupItem>
          ))}
        </div>
      </AvatarClassNamesProvider>
    );
  },
);

AvatarGroup.displayName = "AvatarGroup";

function AvatarGroupItem({
  stackIndex,
  children,
}: AvatarGroupItemProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const slotClassNames = useAvatarClassNames();
  const { applyLift, applyRest } = useAvatarGroupItemMotion(wrapRef);

  return (
    <div
      ref={wrapRef}
      style={{ transformOrigin: AVATAR_GROUP_ITEM_TRANSFORM_ORIGIN }}
      className={avatarGroupItemClass(stackIndex, slotClassNames.groupItem)}
      onPointerEnter={applyLift}
      onPointerLeave={applyRest}
    >
      {children}
    </div>
  );
}

export const AvatarDefaultShell = forwardRef<HTMLDivElement, AvatarShellProps>(
  function AvatarDefaultShell({ size, className, role, children, ...rest }, ref) {
    const slotClassNames = useAvatarClassNames();
    return (
      <div
        ref={ref}
        role={role}
        className={avatarRootClass(size, false, cn(slotClassNames.root, className))}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

AvatarDefaultShell.displayName = "AvatarDefaultShell";

export const AvatarGlossShell = forwardRef<HTMLDivElement, AvatarShellProps>(
  function AvatarGlossShell({ size, className, role, children, ...rest }, ref) {
    const slotClassNames = useAvatarClassNames();
    const { "aria-label": ariaLabel, ...outerRest } = rest;

    return (
      <div
        ref={ref}
        className={avatarGlossWrapClass(size, slotClassNames.glossWrap)}
        {...outerRest}
      >
        <div className={AVATAR_GLOSS_SHADOW_CLASS} aria-hidden />
        <div
          role={role}
          className={avatarRootClass(size, true, cn(slotClassNames.root, className))}
          aria-label={ariaLabel}
        >
          {children}
        </div>
      </div>
    );
  },
);

AvatarGlossShell.displayName = "AvatarGlossShell";
