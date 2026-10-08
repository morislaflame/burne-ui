import type { SkinDefinition, SkinLayerRenderer, SkinSlot } from "./skinTypes";
import { SKIN_SLOTS } from "./skinSlots.generated";

const SLOT_SET = new Set<string>(SKIN_SLOTS);

type SkinEntry = {
  skin: SkinDefinition;
};

const kitSkins = new Map<string, SkinEntry>();
const appSkins = new Map<string, SkinEntry>();

let revision = 0;
const listeners = new Set<() => void>();
let emitScheduled = false;

const layerIds = new WeakMap<SkinLayerRenderer, number>();
let layerSeq = 1;

export type RegisterSkinOptions = {
  /** Replace a kit skin. A new name always writes. */
  override?: boolean;
};

function warn(message: string) {
  if (process.env.NODE_ENV !== "production") console.warn(`[burne-ui] ${message}`);
}

function error(message: string) {
  if (process.env.NODE_ENV !== "production") console.error(`[burne-ui] ${message}`);
}

function validate(skin: SkinDefinition) {
  if (!skin.name) {
    warn("registerSkin: name must be a non-empty string");
    return false;
  }
  if ((skin.layers || skin.layersDeclarative) && !skin.styleUrl) {
    warn(`skin "${skin.name}" has layers without styleUrl`);
  }
  if (skin.targets) {
    for (const slot of Object.keys(skin.targets)) {
      if (!SLOT_SET.has(slot)) {
        error(`skin "${skin.name}" targets unknown slot "${slot}"`);
      }
    }
  }
  if (skin.motion) {
    for (const slot of Object.keys(skin.motion)) {
      if (!SLOT_SET.has(slot)) {
        error(`skin "${skin.name}" motion unknown slot "${slot}"`);
      }
    }
  }
  for (const slot of [
    ...Object.keys(skin.layers ?? {}),
    ...Object.keys(skin.layersDeclarative ?? {}),
  ]) {
    if (!SLOT_SET.has(slot)) {
      error(`skin "${skin.name}" layers unknown slot "${slot}"`);
    }
  }
  return true;
}

function layerStamp(layers: SkinDefinition["layers"]): string {
  if (!layers) return "";
  const record = layers as Partial<Record<string, SkinLayerRenderer | undefined>>;
  return Object.keys(record)
    .sort()
    .map((key) => {
      const renderer = record[key];
      if (!renderer) return `${key}:0`;
      let id = layerIds.get(renderer);
      if (id === undefined) {
        id = layerSeq++;
        layerIds.set(renderer, id);
      }
      return `${key}:${id}`;
    })
    .join(",");
}

function sortJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortJson);
  if (value && typeof value === "object") {
    const source = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(source).sort()) {
      const item = source[key];
      if (typeof item === "function") continue;
      out[key] = sortJson(item);
    }
    return out;
  }
  return value;
}

function skinFingerprint(skin: SkinDefinition): string {
  const { layers, ...data } = skin;
  return `${JSON.stringify(sortJson(data))}#${layerStamp(layers)}`;
}

function emit() {
  for (const listener of [...listeners]) listener();
}

function scheduleEmit() {
  if (emitScheduled) return;
  emitScheduled = true;
  queueMicrotask(() => {
    emitScheduled = false;
    emit();
  });
}

function writeEntry(map: Map<string, SkinEntry>, skin: SkinDefinition): boolean {
  if (!validate(skin)) return false;
  const prev = map.get(skin.name)?.skin;
  if (prev && skinFingerprint(prev) === skinFingerprint(skin)) return false;
  map.set(skin.name, { skin });
  revision += 1;
  return true;
}

/** Kit layer. A later call does not remove app overrides. */
export function registerKitSkin(skin: SkinDefinition): void {
  if (writeEntry(kitSkins, skin)) emit();
}

export function registerSkin(skin: SkinDefinition, options?: RegisterSkinOptions): void {
  if (kitSkins.has(skin.name) && !options?.override) {
    warn(
      `"${skin.name}" is a kit skin. Pass { override: true } to replace it, or register a new name.`);
    return;
  }
  if (writeEntry(appSkins, skin)) emit();
}

/**
 * Provider path. Writes the same app layer as `registerSkin`, but does not
 * notify listeners during render. A microtask notifies trees that are not
 * children of this render.
 */
export function adoptSkins(skins: readonly SkinDefinition[]): void {
  let changed = false;
  for (const skin of skins) {
    if (kitSkins.has(skin.name)) {
      warn(
        `"${skin.name}" is a kit skin. Pass { override: true } to replace it, or register a new name.`);
      continue;
    }
    if (writeEntry(appSkins, skin)) changed = true;
  }
  if (changed) scheduleEmit();
}

export function unregisterSkin(name: string): boolean {
  const removed = appSkins.delete(name);
  if (!removed) return false;
  revision += 1;
  emit();
  return true;
}

export function getSkin(name: string): SkinDefinition | undefined {
  return appSkins.get(name)?.skin ?? kitSkins.get(name)?.skin;
}

export function hasSkin(name: string): boolean {
  return getSkin(name) !== undefined;
}

export function listSkins(): string[] {
  const names = new Set<string>(kitSkins.keys());
  for (const name of appSkins.keys()) names.add(name);
  return [...names].sort();
}

export function clearSkinsForTests(): void {
  if (appSkins.size === 0 && kitSkins.size === 0) return;
  appSkins.clear();
  kitSkins.clear();
  revision += 1;
  emit();
}

export function subscribeSkins(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

/** Registry revision for `useSyncExternalStore`. Identical writes do not bump it. */
export function getSkinRevision(): number {
  return revision;
}

export type { SkinSlot };
