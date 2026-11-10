import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";

import { MotionConfigProvider } from "@/components/core/utils/motionConfigContext";
import { useBurneThemeOptional } from "@/theme/themeContext";

import {
  bindSkinLookup,
  lookupSkin,
  SkinCatalogContext,
  useInstallSkinLookup,
  type SkinCatalog,
} from "./skinLookup";
import type { SkinDefinition, SkinSlot, SkinTargetSpec } from "./skinTypes";
import { getSkin, getSkinRevision, subscribeSkins } from "./skinRegistry";
import {
  applySkinVars,
  baselineFor,
  captureKitTokens,
  releaseSkinVars,
  resolveSkinTokens,
  sameTokenMap,
  skinSurfaceStyle,
  skinThemeAnchor,
  skinThemeMode,
  skinTokenStyle,
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
  targets: Partial<Record<SkinSlot, SkinTargetSpec>>;
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

function resolveNamed(
  skin: string | SkinDefinition | null | undefined,
  skins: readonly SkinDefinition[] | undefined,
): SkinDefinition | null | undefined {
  if (skin === undefined) return undefined;
  if (skin === null) return null;
  if (typeof skin === "string") {
    const fromScope = skins?.find((item) => item.name === skin);
    const found = fromScope ?? getSkin(skin);
    if (!found && process.env.NODE_ENV !== "production") {
      console.error(`[burne-ui] unknown skin "${skin}"`);
    }
    return found ?? null;
  }
  return skin;
}

export function SkinProvider({ skin, skins: skinsProp, root = null, children }: SkinProviderProps) {
  const parentCatalog = useContext(SkinCatalogContext);
  const parent = useContext(SkinContext);
  const hostRef = useRef<HTMLDivElement>(null);
  const theme = useBurneThemeOptional();
  const domMode = useSyncExternalStore(subscribeThemeMode, themeMode, () => "dark" as const);
  const [islandMode, setIslandMode] = useState<"light" | "dark" | null>(null);
  const [ownBaseline, setOwnBaseline] = useState<SkinTokenMap>({});
  useSyncExternalStore(subscribeSkins, getSkinRevision, getSkinRevision);

  const mode = islandMode ?? theme?.resolvedTheme ?? domMode;
  const resolved = resolveNamed(skin, skinsProp);
  const catalog = useMemo<SkinCatalog>(() => {
    const map = new Map(parentCatalog?.skins);
    for (const item of skinsProp ?? []) map.set(item.name, item);
    if (resolved) map.set(resolved.name, resolved);
    return { skins: map, registryFallback: true };
  }, [parentCatalog, skinsProp, resolved]);
  const motionConfig = resolved?.motion?.config;
  bindSkinLookup(catalog);
  const own = useMemo(
    () => (resolved ? resolveSkinTokens(resolved, mode) : {}),
    [resolved, mode]);
  const baseline = useMemo(
    () => ({ ...(parent?.baseline ?? {}), ...ownBaseline }),
    [parent, ownBaseline],
  );

  const scope = useMemo<SkinScope | null>(() => {
    if (skin === undefined) return parent;
    if (!resolved) {
      const keys = Object.keys(parent?.effective ?? {});
      const source = parent?.baseline ?? baseline;
      const effective = baselineFor(keys, source);
      return {
        name: null,
        active: false,
        effective,
        local: effective,
        baseline: source,
        targets: {},
      };
    }
    return {
      name: resolved.name,
      active: true,
      effective: { ...(parent?.effective ?? {}), ...own },
      local: own,
      baseline,
      targets: resolved.targets ?? {},
    };
  }, [skin, resolved, own, parent, baseline]);

  useLayoutEffect(() => {
    const start = hostRef.current?.parentElement ?? root;
    const next = skinThemeMode(start, theme?.root ?? null, theme?.resolvedTheme ?? domMode);
    const fallback = theme?.resolvedTheme ?? domMode;
    setIslandMode(next === fallback ? null : next);
  }, [theme?.root, theme?.resolvedTheme, domMode, root]);

  useLayoutEffect(() => {
    if (!resolved) return;
    const keys = Object.keys(own);
    if (keys.length === 0) return;
    const anchor = skinThemeAnchor(hostRef.current?.parentElement ?? root, theme?.root ?? null);
    if (!anchor) return;
    const fresh = captureKitTokens(anchor, keys);
    setOwnBaseline((prev) => (sameTokenMap(prev, { ...prev, ...fresh }) ? prev : { ...prev, ...fresh }));
  }, [resolved, own, mode, theme?.root, root]);

  useLayoutEffect(() => {
    if (!root || skin === undefined || !scope) return;
    applySkinVars(root, scope.local, scope.name);
    return () => releaseSkinVars(root);
  }, [skin, root, scope]);

  let body: ReactNode = children;
  if (!(skin === undefined || root) || (scope && scope !== parent)) {
    body = skin === undefined || root ? (
      <SkinContext.Provider value={scope}>{children}</SkinContext.Provider>
    ) : (
      <SkinContext.Provider value={scope}>
        <div
          ref={hostRef}
          data-skin={scope?.name ?? "none"}
          style={{ display: "contents", ...skinTokenStyle(scope?.local ?? {}) }}
        >
          {children}
        </div>
      </SkinContext.Provider>
    );
  }

  if (motionConfig) {
    body = <MotionConfigProvider motion={motionConfig}>{body}</MotionConfigProvider>;
  }

  return <SkinCatalogContext.Provider value={catalog}>{body}</SkinCatalogContext.Provider>;
}

export function useSkin(): SkinScope | null {
  useInstallSkinLookup();
  return useContext(SkinContext);
}

/**
 * Explicit `variant` wins, including `"default"`.
 * An omitted variant uses the active skin name. `skin={null}` is inactive, so the
 * result is `fallback` (kit default).
 */
/** Re-renders when `registerSkin` / `unregisterSkin` changes the registry. */
export function useSkinRegistryRevision(): number {
  useInstallSkinLookup();
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
  useInstallSkinLookup();
  const scope = useSkin();
  return useMemo(() => {
    if (!scope?.active) return {};
    return skinSurfaceStyle(scope.effective, scope.baseline, variant);
  }, [scope, variant]);
}

export function useSkinTargets(variant?: string): Partial<Record<SkinSlot, string>> {
  useInstallSkinLookup();
  const scope = useSkin();
  const name = variant ?? (scope?.active ? scope.name ?? undefined : undefined);
  if (!name || name === "default") return {};
  const skin = lookupSkin(name);
  if (!skin?.targets) return {};
  const out: Partial<Record<SkinSlot, string>> = {};
  for (const [slot, spec] of Object.entries(skin.targets)) {
    if (typeof spec === "string") out[slot as SkinSlot] = spec;
    else if ("replace" in spec) out[slot as SkinSlot] = spec.replace;
    else out[slot as SkinSlot] = spec.extend;
  }
  return out;
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
