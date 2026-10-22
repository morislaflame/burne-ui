import { forwardRef, useMemo, type ForwardedRef, type PointerEvent as ReactPointerEvent } from "react";
 
import { dataVariantProps } from "@/components/core/utils/dataContract";
import {
  hasPointerPhases,
  useMotionPart,
} from "@/components/core/utils/slotMotion";
 
import { useSkinRegistryRevision } from "@/skins/skinContext";

import { itemsPartTaken } from "@/components/core/utils/itemsBesideChildren";

import { resolveTabsMotionDefaults, useTabsRootEnter } from "./tabsAnimations";
import {
  TabsClassNamesProvider,
  TabsContext,
  TabsMotionProvider,
  useTabsContext,
  useTabsMotionScope,
} from "./tabsContext";
import { TabsList, TabsPanel, TabsTab } from "./tabsParts";
import { tabsRootClass } from "./tabsStyles";
import type { TabsProps } from "./tabsTypes";
import { useTabsRootState } from "./useTabsRootState";
 
export type {
  TabsProps,
  TabsListProps,
  TabsTabProps,
  TabsPanelProps,
  TabsSize,
  TabsOrientation,
  TabsVariant,
  TabsClassNames,
  TabsMotion,
  TabsPartMotion,
  TabsItem,
} from "./tabsTypes";
 
export const TabsRoot = forwardRef<HTMLDivElement, TabsProps>(function TabsRoot(
  {
    children,
    items,
    className,
    classNames,
    value,
    defaultValue,
    onValueChange,
    orientation = "horizontal",
    size = "base",
    variant,
    disabled = false,
    activationMode,
    keepMounted,
    motion,
    motionController,
    motionState,
    motionPayload,
    playInitialState,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
    ...rest
  },
  ref,
) {
  const { contextValue } = useTabsRootState({
    value,
    defaultValue,
    onValueChange,
    orientation,
    size,
    variant,
    disabled,
    activationMode,
    keepMounted,
  });
  const skinRevision = useSkinRegistryRevision();
  const motionDefaults = useMemo(() => {
    void skinRevision;
    return resolveTabsMotionDefaults(contextValue.variant);
  }, [contextValue.variant, skinRevision]);
 
  return (
    <TabsContext.Provider value={contextValue}>
      <TabsClassNamesProvider classNames={classNames}>
        <TabsMotionProvider motion={motion} defaults={motionDefaults} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
          <TabsRootSurface
            value={contextValue.value}
            orientation={contextValue.orientation}
            slotClass={classNames?.root}
            className={className}
            forwardedRef={ref}
            onPointerOver={onPointerOver}
            onPointerOut={onPointerOut}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            rest={rest}
          >
            {items && !itemsPartTaken("Tabs", children, "TabsList", "TabsTab") ? (
              <TabsList>
                {items.map((item) => (
                  <TabsTab key={item.value} value={item.value} disabled={item.disabled}>
                    {item.label}
                  </TabsTab>
                ))}
              </TabsList>
            ) : null}
            {items && !itemsPartTaken("Tabs", children, "TabsPanel")
              ? items.map((item) => (
                  <TabsPanel key={item.value} value={item.value}>
                    {item.content}
                  </TabsPanel>
                ))
              : null}
            {children}
          </TabsRootSurface>
        </TabsMotionProvider>
      </TabsClassNamesProvider>
    </TabsContext.Provider>
  );
});
 
TabsRoot.displayName = "Tabs";
 
function TabsRootSurface({
  value,
  orientation,
  slotClass,
  className,
  forwardedRef,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  rest,
  children,
}: {
  value: string | null;
  orientation: ReturnType<typeof useTabsRootState>["contextValue"]["orientation"];
  slotClass?: string;
  className?: string;
  forwardedRef: ForwardedRef<HTMLDivElement>;
  onPointerOver?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerOut?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerDown?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerUp?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  rest: Omit<
    TabsProps,
    | "children"
    | "className"
    | "classNames"
    | "value"
    | "defaultValue"
    | "onValueChange"
    | "orientation"
    | "size"
    | "variant"
    | "disabled"
    | "motion"
    | "motionController"
    | "onPointerOver"
    | "onPointerOut"
    | "onPointerDown"
    | "onPointerUp"
  >;
  children: TabsProps["children"];
}) {
  const scope = useTabsMotionScope();
  const pointer = hasPointerPhases(scope.getRootMotion()?.root);
  const part = useMotionPart<HTMLDivElement>({
    scope,
    slot: "root",
    forwardedRef,
    pointerPhases: pointer,
    pressPhases: pointer,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  useTabsRootEnter(scope, value);
  const { size, variant } = useTabsContext();
 
  return (
    <div
      ref={part.setRef}
      className={tabsRootClass({
        orientation,
        slotClass,
        className,
      })}
      {...rest}
      {...part.pointerHandlers}
      {...dataVariantProps({ size, variant })}
      data-orientation={orientation}
    >
      {children}
    </div>
  );
}
 
export { TabsList, TabsTab, TabsPanel };
 