import { Children, cloneElement, Fragment, isValidElement, type ReactElement, type ReactNode } from "react";
import { Button, type ButtonProps } from "@/components/core/Button";
import type { ButtonSize } from "@/components/core/Button/buttonTypes";

import type { DrawerBackdropProps, DrawerPanelSegment } from "./drawerTypes";

export {
  getDrawerSlideCloseTo,
  getDrawerSlideOpenFrom,
  getDrawerSlideRest,
  measureDrawerSlideDistance,
} from "@/components/core/utils/drawerSlide";

export function readDrawerPartDisplayName(type: unknown): string | undefined {
  return (type as { displayName?: string }).displayName;
}

export function injectFooterButtonSize(
  children: ReactNode,
  buttonSize: ButtonSize,
): ReactNode {
  return Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    if (child.type === Button) {
      const props = child.props as ButtonProps;
      return cloneElement(child as ReactElement<ButtonProps>, {
        size: props.size ?? buttonSize,
      });
    }
    if (child.type === Fragment) {
      const f = child as ReactElement<{ children?: ReactNode }>;
      return cloneElement(
        f,
        { key: f.key ?? undefined },
        injectFooterButtonSize(f.props.children, buttonSize),
      );
    }
    return child;
  });
}

export function partitionDrawerChildren(children: ReactNode): {
  backdropIsDismissable: boolean;
  panelSegments: DrawerPanelSegment[];
} {
  let backdropIsDismissable = true;
  const panelSegments: DrawerPanelSegment[] = [];
  let contentChunk: ReactNode[] = [];

  const flushContent = () => {
    if (contentChunk.length === 0) return;
    const chunk = contentChunk;
    contentChunk = [];
    panelSegments.push({ kind: "content", children: chunk });
  };

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      contentChunk.push(child);
      return;
    }

    const name = readDrawerPartDisplayName(child.type);
    if (name === "DrawerBackdrop") {
      const props = child.props as DrawerBackdropProps;
      if (props.isDismissable === false) backdropIsDismissable = false;
      return;
    }

    if (name === "DrawerHandle") {
      flushContent();
      panelSegments.push({ kind: "handle", node: child });
      return;
    }

    contentChunk.push(child);
  });

  flushContent();

  return { backdropIsDismissable, panelSegments };
}
