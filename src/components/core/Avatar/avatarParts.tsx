import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useMemo,
  useRef,
  type ReactElement,
} from "react";

import { Text } from "@/components/core/Text";
import { useMotionPart } from "@/components/core/utils/slotMotion";
import { cn } from "@/utils/cn";

import { letterFromLabel } from "./avatarAPI";
import { AVATAR_FALLBACK_ARIA_HIDDEN, avatarGroupRole } from "./avatarA11y";
import {
  resolveAvatarGroupItemMotionDefaults,
  useAvatarImageMotion,
} from "./avatarAnimations";
import {
  AvatarClassNamesProvider,
  AvatarGroupMotionProvider,
  AvatarMotionProvider,
  useAvatarClassNames,
  useAvatarContext,
  useAvatarGroupMotion,
  useOptionalAvatarMotionScope,
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
  function AvatarImage({ className = "", motion, onLoad, onError, ...rest }, ref) {
    const { imageStatus, onImageLoad, onImageError } = useAvatarContext("Avatar.Image");
    const slotClassNames = useAvatarClassNames();
    const scope = useOptionalAvatarMotionScope();
    const imgRef = useRef<HTMLImageElement | null>(null);
    const { setRef } = useMotionPart<HTMLImageElement>({
      scope,
      slot: "image",
      motion,
      forwardedRef: ref,
    });

    const bindRef = useCallback(
      (node: HTMLImageElement | null) => {
        imgRef.current = node;
        setRef(node);
      },
      [setRef],
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
    useAvatarImageMotion(scope, visible, imgRef);

    return (
      <img
        ref={bindRef}
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
  function AvatarFallback({ className = "", children, motion, onPointerOver, onPointerOut, ...rest }, ref) {
    const { label, imageStatus, size } = useAvatarContext("Avatar.Fallback");
    const slotClassNames = useAvatarClassNames();
    const { setRef, pointerHandlers } = useMotionPart<HTMLSpanElement>({
      scope: useOptionalAvatarMotionScope(),
      slot: "fallback",
      motion,
      forwardedRef: ref,
      pointerPhases: true,
      onPointerOver,
      onPointerOut,
    });

    const show = imageStatus !== "loaded";

    const hasCustomChild =
      children !== undefined && children !== null && children !== false && children !== "";

    const text = hasCustomChild ? children : letterFromLabel(label);

    const fb = AVATAR_FALLBACK_TEXT[size];

    return (
      <span
        ref={setRef}
        className={avatarFallbackClass(show, cn(slotClassNames.fallback, className))}
        aria-hidden={AVATAR_FALLBACK_ARIA_HIDDEN}
        {...rest}
        {...pointerHandlers}
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
  function AvatarGroup({ className = "", classNames, children, motion, ...rest }, ref) {
    const slotClassNames = useAvatarClassNames();
    const mapped = Children.toArray(children).filter(isValidElement) as ReactElement[];

    return (
      <AvatarClassNamesProvider classNames={classNames}>
        <AvatarGroupMotionProvider motion={motion}>
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
        </AvatarGroupMotionProvider>
      </AvatarClassNamesProvider>
    );
  },
);

AvatarGroup.displayName = "AvatarGroup";

function AvatarGroupItem({
  stackIndex,
  children,
}: AvatarGroupItemProps) {
  const groupMotion = useAvatarGroupMotion();
  const defaults = useMemo(() => resolveAvatarGroupItemMotionDefaults(), []);

  return (
    <AvatarMotionProvider motion={groupMotion} defaults={defaults}>
      <AvatarGroupItemSurface stackIndex={stackIndex}>{children}</AvatarGroupItemSurface>
    </AvatarMotionProvider>
  );
}

function AvatarGroupItemSurface({
  stackIndex,
  children,
}: AvatarGroupItemProps) {
  const slotClassNames = useAvatarClassNames();
  const { setRef, pointerHandlers } = useMotionPart<HTMLDivElement>({
    scope: useOptionalAvatarMotionScope(),
    slot: "groupItem",
    pointerPhases: true,
  });

  return (
    <div
      ref={setRef}
      style={{ transformOrigin: AVATAR_GROUP_ITEM_TRANSFORM_ORIGIN }}
      className={avatarGroupItemClass(stackIndex, slotClassNames.groupItem)}
      {...pointerHandlers}
    >
      {children}
    </div>
  );
}

export const AvatarDefaultShell = forwardRef<HTMLDivElement, AvatarShellProps>(
  function AvatarDefaultShell({ size, className, role, children, onPointerOver, onPointerOut, ...rest }, ref) {
    const slotClassNames = useAvatarClassNames();
    const { setRef, pointerHandlers } = useMotionPart<HTMLDivElement>({
      scope: useOptionalAvatarMotionScope(),
      slot: "root",
      forwardedRef: ref,
      pointerPhases: true,
      onPointerOver,
      onPointerOut,
    });
    return (
      <div
        ref={setRef}
        role={role}
        className={avatarRootClass(size, false, cn(slotClassNames.root, className))}
        {...rest}
        {...pointerHandlers}
      >
        {children}
      </div>
    );
  },
);

AvatarDefaultShell.displayName = "AvatarDefaultShell";

export const AvatarGlossShell = forwardRef<HTMLDivElement, AvatarShellProps>(
  function AvatarGlossShell({ size, className, role, children, onPointerOver, onPointerOut, ...rest }, ref) {
    const slotClassNames = useAvatarClassNames();
    const { "aria-label": ariaLabel, ...outerRest } = rest;
    const { setRef, pointerHandlers } = useMotionPart<HTMLDivElement>({
      scope: useOptionalAvatarMotionScope(),
      slot: "root",
      forwardedRef: ref,
      pointerPhases: true,
      onPointerOver,
      onPointerOut,
    });

    return (
      <div
        ref={setRef}
        className={avatarGlossWrapClass(size, slotClassNames.glossWrap)}
        {...outerRest}
        {...pointerHandlers}
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
