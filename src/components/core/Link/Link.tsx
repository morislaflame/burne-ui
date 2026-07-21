import { forwardRef } from "react";

import { useLinkAnimations } from "./linkAnimations";
import { LinkClassNamesProvider } from "./linkContext";
import { LinkAnchorBody, LinkIcon } from "./linkParts";
import type { LinkProps } from "./linkTypes";
import { useLinkRootState } from "./useLinkRootState";

export type {
  LinkProps,
  LinkSize,
  LinkIconPosition,
  LinkIconProps,
  LinkClassNames,
} from "./linkTypes";

export { LinkIcon };

export const LinkRoot = forwardRef<HTMLAnchorElement, Omit<LinkProps, "classNames">>(
  function LinkRoot(
    {
      href,
      children,
      className = "",
      size: sizeProp,
      underline: underlineProp,
      icon,
      iconPosition,
      showDefaultIcon,
      defaultIconPosition,
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
      ...rest
    },
    forwardedRef,
  ) {
    const state = useLinkRootState({
      size: sizeProp,
      underline: underlineProp,
      icon,
      iconPosition,
      showDefaultIcon,
      defaultIconPosition,
      children,
    });

    const animations = useLinkAnimations({
      forwardedRef,
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
    });

    return (
      <LinkAnchorBody
        href={href}
        size={state.size}
        underline={state.underline}
        textVariant={state.textVariant}
        textChildren={state.textChildren}
        startIcon={state.startIcon}
        endIcon={state.endIcon}
        startIconMuted={state.startIconMuted}
        endIconMuted={state.endIconMuted}
        usesDefaultAtStart={state.usesDefaultAtStart}
        usesDefaultAtEnd={state.usesDefaultAtEnd}
        className={className}
        setAnchorRef={animations.setAnchorRef}
        handlePointerEnter={animations.handlePointerEnter}
        handlePointerLeave={animations.handlePointerLeave}
        handlePointerDown={animations.handlePointerDown}
        {...rest}
      />
    );
  },
);

LinkRoot.displayName = "Link";

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { classNames, ...rest },
  ref,
) {
  return (
    <LinkClassNamesProvider classNames={classNames}>
      <LinkRoot ref={ref} {...rest} />
    </LinkClassNamesProvider>
  );
});

Link.displayName = "Link";
