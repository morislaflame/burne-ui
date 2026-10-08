import { cloneElement, createElement, isValidElement, type CSSProperties, type HTMLAttributes, type PointerEventHandler, type ReactElement, type ReactNode, type Ref } from "react";

import {
  useMotionPart,
  useOptionalEnterOnMount,
  type MotionPartPhases,
  type MotionScopeValue,
} from "@/components/core/utils/slotMotion";
import { cn } from "@/utils/cn";

import { resolveSkinLayer } from "./resolveSkinLayer";
import { useSkinRegistryRevision } from "./skinContext";
import type { SkinSlot } from "./skinTypes";

export type SkinShellProps = {
  part: SkinSlot;
  variant?: string;
  scope: MotionScopeValue | null;
  /** Local motion slot. Defaults to the part after the dot (`card.root` → `root`). */
  slot?: string;
  motion?: MotionPartPhases;
  className?: string;
  /** Merged onto the declarative `content` node. */
  contentClassName?: string;
  children?: ReactNode;
  ref?: Ref<HTMLElement>;
  pointerPhases?: boolean;
  pressPhases?: boolean;
  /**
   * Modal hosts play `enter` themselves. `false` skips the extra mount enter.
   * Slot `mount` still runs from the registration.
   */
  enterOnMount?: boolean;
  /**
   * Used when this variant has no layer. `ref` and pointer handlers land on this element.
   * Without it, `SkinShell` renders a `div`.
   */
  fallback?: ReactElement<{ className?: string; children?: ReactNode }>;
  onPointerOver?: PointerEventHandler<HTMLElement>;
  onPointerOut?: PointerEventHandler<HTMLElement>;
  onPointerDown?: PointerEventHandler<HTMLElement>;
  onPointerUp?: PointerEventHandler<HTMLElement>;
} & Omit<
  HTMLAttributes<HTMLElement>,
  "className" | "children" | "onPointerOver" | "onPointerOut" | "onPointerDown" | "onPointerUp"
>;

function localSlot(part: string, slot?: string): string {
  if (slot) return slot;
  const dot = part.indexOf(".");
  return dot < 0 ? part : part.slice(dot + 1);
}

function mergeStyle(
  ...parts: Array<Record<string, string> | CSSProperties | undefined>
): CSSProperties | undefined {
  const defined = parts.filter((part): part is Record<string, string> | CSSProperties => part != null);
  if (defined.length === 0) return undefined;
  return Object.assign({}, ...defined);
}

function layerNodes(
  nodes: Array<{ className?: string; style?: Record<string, string> }> | undefined,
  place: "before" | "after",
) {
  return nodes?.map((node, index) => (
    <div
      // Static skin data: the same className may repeat, so className cannot be the key.
      // eslint-disable-next-line react/no-array-index-key -- layer order is the identity
      key={`${place}-${index}`}
      aria-hidden="true"
      className={node.className}
      style={node.style as CSSProperties | undefined}
    />
  ));
}

/**
 * Tier 3 host. Registers `slot` through `useMotionPart` and, when the variant
 * names a skin with `layers` / `layersDeclarative` for `part`, renders that layer.
 * `variant="default"` renders the plain shell.
 */
export function SkinShell({
  part,
  variant,
  scope,
  slot,
  motion,
  className,
  contentClassName,
  children,
  ref,
  pointerPhases = false,
  pressPhases = false,
  enterOnMount = true,
  fallback,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  ...rest
}: SkinShellProps) {
  useSkinRegistryRevision();
  const name = localSlot(part, slot);
  const partMotion = useMotionPart<HTMLElement>({
    scope,
    slot: name,
    motion,
    forwardedRef: ref,
    pointerPhases,
    pressPhases,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  useOptionalEnterOnMount(enterOnMount ? scope : null, name, partMotion.targetRef);

  const layer = resolveSkinLayer(variant, part);
  const pointer = partMotion.pointerHandlers;

  if (layer?.renderer) {
    return createElement(
      layer.renderer,
      {
        ref: partMotion.setRef as (node: HTMLElement | null) => void,
        className,
        ...rest,
        onPointerOver: pointer.onPointerOver,
        onPointerOut: pointer.onPointerOut,
        onPointerDown: pointer.onPointerDown,
        onPointerUp: pointer.onPointerUp,
      },
      children,
    );
  }

  const declarative = layer?.declarative;
  const { style: restStyle, ...domRest } = rest;
  const shellClass = cn(declarative?.wrapper?.className, className);
  const shellStyle = mergeStyle(declarative?.wrapper?.style, restStyle);
  const body = declarative?.content ? (
    <div
      className={cn(declarative.content.className, contentClassName)}
      style={declarative.content.style as CSSProperties | undefined}
    >
      {children}
    </div>
  ) : (
    children
  );
  const before = layerNodes(declarative?.before, "before");
  const after = layerNodes(declarative?.after, "after");

  if (fallback && isValidElement(fallback)) {
    const fallbackStyle = (fallback.props as { style?: CSSProperties }).style;
    return cloneElement(
      fallback,
      {
        className: cn(fallback.props.className, shellClass),
        ...(domRest as HTMLAttributes<HTMLElement>),
        style: mergeStyle(declarative?.wrapper?.style, fallbackStyle, restStyle),
        ...pointer,
        ref: partMotion.setRef,
      } as Partial<typeof fallback.props>,
      before,
      body,
      after,
    );
  }

  return (
    <div
      ref={partMotion.setRef as (node: HTMLDivElement | null) => void}
      className={shellClass}
      {...(domRest as HTMLAttributes<HTMLDivElement>)}
      style={shellStyle}
      {...(pointer as HTMLAttributes<HTMLDivElement>)}
    >
      {before}
      {body}
      {after}
    </div>
  );
}
