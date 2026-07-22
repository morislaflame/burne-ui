import type { CSSProperties, ReactElement, Ref } from "react";

import { cn } from "@/utils/cn";

import { mergeRefs } from "./mergeRefs";

type AnyProps = Record<string, unknown>;

export type MergeAsChildPropsOptions = {
  /**
   * `on*` handlers that must run before the child's handler.
   * Default for all other handlers: child first (so the child can `preventDefault`),
   * then the host. Use `runBeforeChild` when the host must `preventDefault` before a
   * child Button sees the event (e.g. squeeze-open triggers).
   */
  runBeforeChild?: readonly string[];
};

function isEventHandlerProp(key: string): boolean {
  return /^on[A-Z]/.test(key);
}

function getChildRef<T>(child: ReactElement): Ref<T> | undefined {
  const propsRef = (child.props as { ref?: Ref<T> }).ref;
  if (propsRef != null) return propsRef;
  // React 18: ref may live on the element instance, not in props.
  return (child as ReactElement & { ref?: Ref<T> }).ref;
}

function chainHandlers(
  first: (...args: unknown[]) => void,
  second: (...args: unknown[]) => void,
) {
  return (...args: unknown[]) => {
    first(...args);
    second(...args);
  };
}

/**
 * Build props for `cloneElement` when an asChild host delegates to a single child.
 *
 * - Spreads host `ownProps` over the child (`id`, `data-*`, `style`, …)
 * - Merges `className` via `cn` and shallow-merges `style`
 * - Chains `on*` handlers (child→host by default; see `runBeforeChild`)
 * - Merges the child's ref with `forwardedRef`
 */
export function mergeAsChildProps<T extends Element = Element>(
  child: ReactElement,
  ownProps: AnyProps,
  forwardedRef?: Ref<T> | null,
  options?: MergeAsChildPropsOptions,
): AnyProps {
  const childProps = child.props as AnyProps;
  const runBefore = options?.runBeforeChild;
  const merged: AnyProps = { ...childProps };

  for (const [key, value] of Object.entries(ownProps)) {
    if (key === "className" || key === "style" || key === "ref") continue;

    if (
      isEventHandlerProp(key) &&
      typeof value === "function" &&
      typeof childProps[key] === "function"
    ) {
      const ownHandler = value as (...args: unknown[]) => void;
      const childHandler = childProps[key] as (...args: unknown[]) => void;
      merged[key] =
        runBefore?.includes(key) === true
          ? chainHandlers(ownHandler, childHandler)
          : chainHandlers(childHandler, ownHandler);
      continue;
    }

    merged[key] = value;
  }

  if (childProps.className != null || ownProps.className != null) {
    merged.className = cn(
      childProps.className as string | undefined,
      ownProps.className as string | undefined,
    );
  }

  const childStyle = childProps.style as CSSProperties | undefined;
  const ownStyle = ownProps.style as CSSProperties | undefined;
  if (childStyle != null || ownStyle != null) {
    merged.style =
      childStyle != null && ownStyle != null
        ? { ...childStyle, ...ownStyle }
        : (ownStyle ?? childStyle);
  }

  merged.ref = mergeRefs(getChildRef<T>(child), forwardedRef);

  return merged;
}
