import { Children, forwardRef, isValidElement, useMemo, type ForwardedRef, type ReactNode } from "react";

import {
  resolveAppShellMotionDefaults,
  useAppShellBodyMotion,
  useAppShellMainMotion,
  useAppShellRootMotion,
} from "./appShellAnimations";
import { AppShellMotionProvider } from "./appShellContext";
import { appShellBodyClass, appShellMainClass, appShellRootClass } from "./appShellStyles";
import type { AppShellPartMotion, AppShellProps } from "./appShellTypes";

export type {
  AppShellClassNames,
  AppShellMotion,
  AppShellPartMotion,
  AppShellProps,
} from "./appShellTypes";

function partName(child: ReactNode): string | undefined {
  if (!isValidElement(child)) return undefined;
  const type = child.type as { displayName?: string };
  return typeof type === "function" || typeof type === "object" ? type.displayName : undefined;
}

function sidebarEdge(child: ReactNode): "start" | "end" {
  if (!isValidElement(child)) return "start";
  const side = (child.props as { side?: string }).side;
  return side === "end" ? "end" : "start";
}

function splitShell(children: ReactNode) {
  const header: ReactNode[] = [];
  const leading: ReactNode[] = [];
  const trailing: ReactNode[] = [];
  const main: ReactNode[] = [];
  Children.forEach(children, (child) => {
    const name = partName(child);
    if (name === "Header") header.push(child);
    else if (name === "Sidebar") {
      if (sidebarEdge(child) === "end") trailing.push(child);
      else leading.push(child);
    } else main.push(child);
  });
  return { header, leading, trailing, main };
}

export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(function AppShell(
  {
    className = "",
    classNames,
    children,
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
  const motionDefaults = useMemo(() => resolveAppShellMotionDefaults(), []);
  const slots = splitShell(children);

  return (
    <AppShellMotionProvider
      motion={motion}
      defaults={motionDefaults}
      controller={motionController}
      motionState={motionState}
      motionPayload={motionPayload}
      playInitialState={playInitialState}
    >
      <AppShellSurface
        className={className}
        classNames={classNames}
        forwardedRef={ref}
        rootMotion={motion?.root}
        bodyMotion={motion?.body}
        mainMotion={motion?.main}
        header={slots.header}
        leading={slots.leading}
        trailing={slots.trailing}
        main={slots.main}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        rest={rest}
      />
    </AppShellMotionProvider>
  );
});

function AppShellSurface({
  className,
  classNames,
  forwardedRef,
  rootMotion,
  bodyMotion,
  mainMotion,
  header,
  leading,
  trailing,
  main,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  rest,
}: {
  className: string;
  classNames: AppShellProps["classNames"];
  forwardedRef: ForwardedRef<HTMLDivElement>;
  rootMotion?: AppShellPartMotion;
  bodyMotion?: AppShellPartMotion;
  mainMotion?: AppShellPartMotion;
  header: ReactNode[];
  leading: ReactNode[];
  trailing: ReactNode[];
  main: ReactNode[];
  onPointerOver: AppShellProps["onPointerOver"];
  onPointerOut: AppShellProps["onPointerOut"];
  onPointerDown: AppShellProps["onPointerDown"];
  onPointerUp: AppShellProps["onPointerUp"];
  rest: Omit<
    AppShellProps,
    | "className"
    | "classNames"
    | "children"
    | "motion"
    | "motionController"
    | "motionState"
    | "motionPayload"
    | "playInitialState"
    | "onPointerOver"
    | "onPointerOut"
    | "onPointerDown"
    | "onPointerUp"
  >;
}) {
  const part = useAppShellRootMotion({
    forwardedRef,
    motion: rootMotion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  return (
    <div
      ref={part.setRef}
      className={appShellRootClass({ slotClass: classNames?.root, className })}
      {...rest}
      {...part.pointerHandlers}
    >
      {header}
      <AppShellBody slotClass={classNames?.body} motion={bodyMotion}>
        {leading}
        <AppShellMain slotClass={classNames?.main} motion={mainMotion}>
          {main}
        </AppShellMain>
        {trailing}
      </AppShellBody>
    </div>
  );
}

function AppShellBody({
  slotClass,
  motion,
  children,
}: {
  slotClass?: string;
  motion?: AppShellPartMotion;
  children: ReactNode;
}) {
  const part = useAppShellBodyMotion({ motion });
  return (
    <div ref={part.setRef} className={appShellBodyClass({ slotClass })} {...part.pointerHandlers}>
      {children}
    </div>
  );
}

function AppShellMain({
  slotClass,
  motion,
  children,
}: {
  slotClass?: string;
  motion?: AppShellPartMotion;
  children: ReactNode;
}) {
  const part = useAppShellMainMotion({ motion });
  return (
    <main ref={part.setRef} className={appShellMainClass({ slotClass })} {...part.pointerHandlers}>
      {children}
    </main>
  );
}

AppShell.displayName = "AppShell";
