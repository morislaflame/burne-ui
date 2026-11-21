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
  /**
   * When true, blocks pointer/keyboard activation (`onClick`, `onAuxClick`, and
   * `Enter`/`Space` on `onKeyDown`) with `preventDefault()` + `stopPropagation()`
   * before any child handler runs — critical for `<Button asChild disabled><a>`.
   */
  disabled?: boolean;
};

function isEventHandlerProp(key: string): boolean {
  return /^on[A-Z]/.test(key);
}

export function getChildRef<T>(child: ReactElement): Ref<T> | undefined {
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
  const runBeforeSet = options?.runBeforeChild ? new Set(options.runBeforeChild) : undefined;
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
        runBeforeSet?.has(key) === true
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
 
  if (options?.disabled) {
    delete merged.href;
    merged.onClick = (event: { preventDefault?: () => void; stopPropagation?: () => void }) => {
      event?.preventDefault?.();
      event?.stopPropagation?.();
    };
    merged.onAuxClick = (event: { preventDefault?: () => void; stopPropagation?: () => void }) => {
      event?.preventDefault?.();
      event?.stopPropagation?.();
    };
    const prevKeyDown = merged.onKeyDown as ((event: KeyboardEvent) => void) | undefined;
    merged.onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      prevKeyDown?.(event);
    };
  }

  merged.ref = mergeRefs(getChildRef<T>(child), forwardedRef);

  return merged;
}
 