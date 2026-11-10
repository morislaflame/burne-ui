import { useContext, type Context } from "react";
import * as React from "react";

import { getSkin } from "./skinRegistry";
import type { SkinDefinition } from "./skinTypes";

function mergeMotion(
  base: SkinDefinition["motion"],
  child: SkinDefinition["motion"],
): SkinDefinition["motion"] {
  if (!base) return child;
  if (!child) return base;
  return {
    ...base,
    ...child,
    config: { ...base.config, ...child.config },
  };
}

/** Child fields win. Used when `extends` names another skin. */
export function mergeExtendedSkin(base: SkinDefinition, child: SkinDefinition): SkinDefinition {
  const fonts = [...(base.fonts ?? []), ...(child.fonts ?? [])];
  return {
    ...base,
    ...child,
    tokens: { ...base.tokens, ...child.tokens },
    tokensLight: { ...base.tokensLight, ...child.tokensLight },
    tokensDark: { ...base.tokensDark, ...child.tokensDark },
    targets: { ...base.targets, ...child.targets },
    rules: { ...base.rules, ...child.rules },
    properties: { ...base.properties, ...child.properties },
    layers: { ...base.layers, ...child.layers },
    layersDeclarative: { ...base.layersDeclarative, ...child.layersDeclarative },
    motion: mergeMotion(base.motion, child.motion),
    ...(fonts.length > 0 ? { fonts } : {}),
  };
}

function materializeSkin(
  name: string,
  read: (skinName: string) => SkinDefinition | undefined,
  seen: Set<string>,
): SkinDefinition | undefined {
  const skin = read(name);
  if (!skin || !skin.extends || seen.has(skin.name)) return skin;
  seen.add(skin.name);
  const base = materializeSkin(skin.extends, read, seen);
  if (!base) return skin;
  return mergeExtendedSkin(base, skin);
}

/**
 * Skins visible to the current `SkinProvider`. `null` context means no provider:
 * `variant="gloss"` does not read the global registry.
 */
export type SkinCatalog = {
  skins: ReadonlyMap<string, SkinDefinition>;
  /** Names missing from `skins` resolve through `registerSkin` while a provider is mounted. */
  registryFallback: boolean;
};

export const SkinCatalogContext: Context<SkinCatalog | null> = React.createContext<SkinCatalog | null>(null);

type ClientInternals = { H: object | null };

function inReactRender(): boolean {
  const react = React as unknown as {
    __CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE?: ClientInternals;
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?: {
      ReactCurrentDispatcher?: { current: object | null };
    };
  };
  const client = react.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  if (client) return client.H != null;
  return react.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?.ReactCurrentDispatcher?.current != null;
}

let installed: ((name: string) => SkinDefinition | undefined) | null = null;

function lookupFromCatalog(catalog: SkinCatalog | null): (name: string) => SkinDefinition | undefined {
  return (name: string) => {
    if (!catalog) return undefined;
    return materializeSkin(
      name,
      (skinName) => catalog.skins.get(skinName) ?? (catalog.registryFallback ? getSkin(skinName) : undefined),
      new Set(),
    );
  };
}

/** Provider render installs the catalog it is about to publish. */
export function bindSkinLookup(catalog: SkinCatalog | null): void {
  installed = lookupFromCatalog(catalog);
}

/**
 * Components call this before reading variant classes. The catalog is the
 * React context, so a portal resolves the provider it was rendered under.
 */
export function useInstallSkinLookup(): void {
  const catalog = useContext(SkinCatalogContext);
  installed = lookupFromCatalog(catalog);
}

/**
 * During render, the skin comes from the installed catalog.
 * Outside render (style unit tests), the registry is the source.
 */
export function lookupSkin(name: string): SkinDefinition | undefined {
  if (!inReactRender()) return materializeSkin(name, getSkin, new Set());
  if (!installed) return undefined;
  return installed(name);
}

export function resetSkinLookupForTests(): void {
  installed = null;
}
