import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";

import type { SkinDefinition, SkinSlot } from "./skinTypes";
import { adoptSkins, getSkin, getSkinRevision, subscribeSkins } from "./skinRegistry";
import {
  applySkinVars,
  baselineFor,
  captureBaseline,
  releaseSkinVars,
  resolveSkinTokens,
  skinSurfaceStyle,
  type SkinTokenMap,
} from "./resolveSkinTokens";

export type SkinScope = {
  /** `null` when this scope opted out (`skin={null}`). */
  name: string | null;
  active: boolean;
  /** Tokens a portal must write. Null scope = captured kit baseline. */
  effective: SkinTokenMap;
  /** Tokens this scope writes on its own node. */
  local: SkinTokenMap;
  baseline: SkinTokenMap;
  targets: Partial<Record<SkinSlot, string>>;
};

const SkinContext = createContext<SkinScope | null>(null);

export type SkinProviderProps = {
  /**
   * Active skin. `null` writes the kit baseline for every token an ancestor set.
   * Omit to only register `skins` and leave the parent scope unchanged.
   */
  skin?: string | SkinDefinition | null;
  /** Registered for the tree (app layer). */
  skins?: SkinDefinition[];
  /** Node that receives the variables. Default: a `display: contents` host. */
  root?: HTMLElement | null;
  children?: ReactNode;
};

function themeMode(): "light" | "dark" {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function subscribeThemeMode(onChange: () => void) {
  if (typeof document === "undefined") return () => {};
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function resolveNamed(skin: string | SkinDefinition | null | undefined): SkinDefinition | null | undefined {
  if (skin === undefined) return undefined;
  if (skin === null) return null;
  if (typeof skin === "string") {
    const found = getSkin(skin);
    if (!found && process.env.NODE_ENV !== "production") {
      console.error(`[burne-ui] unknown skin "${skin}"`);
    }
    return found ?? null;
  }
  return skin;
}

function skinsToAdopt(
  skin: SkinProviderProps["skin"],
  skins: SkinDefinition[] | undefined,
): SkinDefinition[] {
  const list = skins ? [...skins] : [];
  if (skin && typeof skin === "object") list.push(skin);
  return list;
}

export function SkinProvider({ skin, skins, root = null, children }: SkinProviderProps) {
  adoptSkins(skinsToAdopt(skin, skins));
  const parent = useContext(SkinContext);
  const hostRef = useRef<HTMLDivElement>(null);
  const baselineRef = useRef<SkinTokenMap>({});
  const mode = useSyncExternalStore(subscribeThemeMode, themeMode, () => "dark" as const);
  useSyncExternalStore(subscribeSkins, getSkinRevision, getSkinRevision);

  const resolved = resolveNamed(skin);
  const own = useMemo(
    () => (resolved ? resolveSkinTokens(resolved, mode) : {}),
    [resolved, mode]);

  if (parent) {
    for (const [key, value] of Object.entries(parent.baseline)) {
      if (baselineRef.current[key] === undefined) baselineRef.current[key] = value;
    }
  }
  if (resolved) {
    // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- baseline is read by useMemo in the same render; an effect is too late
    baselineRef.current = captureBaseline(Object.keys(own), baselineRef.current);
  }

  const scope = useMemo<SkinScope | null>(() => {
    if (skin === undefined) return parent;
    if (!resolved) {
      const keys = Object.keys(parent?.effective ?? {});
      const effective = baselineFor(keys, baselineRef.current);
      return {
        name: null,
        active: false,
        effective,
        local: effective,
        baseline: baselineRef.current,
        targets: {},
      };
    }
    return {
      name: resolved.name,
      active: true,
      effective: { ...(parent?.effective ?? {}), ...own },
      local: own,
      baseline: baselineRef.current,
      targets: resolved.targets ?? {},
    };
  }, [skin, resolved, own, parent]);

  useLayoutEffect(() => {
    if (skin === undefined || !scope) return;
    const el = root ?? hostRef.current;
    if (!el) return;
    applySkinVars(el, scope.local, scope.name);
    return () => releaseSkinVars(el);
  }, [skin, root, scope]);

  if (skin === undefined || root) {
    if (!scope || scope === parent) return children;
    return <SkinContext.Provider value={scope}>{children}</SkinContext.Provider>;
  }

  return (
    <SkinContext.Provider value={scope}>
      <div ref={hostRef} style={{ display: "contents" }} data-skin={scope?.name ?? "none"}>
        {children}
      </div>
    </SkinContext.Provider>
  );
}

export function useSkin(): SkinScope | null {
  return useContext(SkinContext);
}

/**
 * Explicit `variant` wins, including `"default"`.
 * An omitted variant uses the active skin name. `skin={null}` is inactive, so the
 * result is `fallback` (kit default).
 */
/** Re-renders when `registerSkin` / `unregisterSkin` changes the registry. */
export function useSkinRegistryRevision(): number {
  return useSyncExternalStore(subscribeSkins, getSkinRevision, getSkinRevision);
}

export function useSkinVariant(variant: string | undefined, fallback = "default"): string {
  useSkinRegistryRevision();
  const scope = useSkin();
  if (variant !== undefined) return variant;
  if (scope?.active && scope.name) return scope.name;
  return fallback;
}

/** Palette reset under an explicit `variant="default"`. Empty otherwise. */
export function mergeSkinSurfaceStyle(
  surface: CSSProperties,
  style?: CSSProperties,
): CSSProperties | undefined {
  if (Object.keys(surface).length === 0) return style;
  return { ...surface, ...style };
}

/** Palette reset for `variant="default"`. Geometry tokens stay inherited. */
export function useSkinSurfaceStyle(variant?: string): CSSProperties {
  const scope = useSkin();
  return useMemo(() => {
    if (!scope?.active) return {};
    return skinSurfaceStyle(scope.effective, scope.baseline, variant);
  }, [scope, variant]);
}

export function useSkinTargets(variant?: string): Partial<Record<SkinSlot, string>> {
  const scope = useSkin();
  if (!scope?.active || variant === "default") return {};
  return scope.targets;
}

/** Copy the active scope onto a portal node (Dialog, Tooltip, Toast). */
export function useApplySkinPortal(ref: RefObject<HTMLElement | null>, open = true): void {
  const scope = useSkin();
  useLayoutEffect(() => {
    const el = ref.current;
    if (!open || !el || !scope) return;
    applySkinVars(el, scope.effective, scope.name);
    return () => releaseSkinVars(el);
  }, [ref, open, scope]);
}
