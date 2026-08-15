import type { MotionPartPhases } from "./slotMotionTypes";

export type MotionRegistration = {
  id: symbol;
  slot: string;
  node: HTMLElement;
  motion?: MotionPartPhases;
};

export type MotionRegisterInput = {
  id?: symbol;
  slot: string;
  node: HTMLElement | null;
  motion?: MotionPartPhases;
};

export type MotionRegistry = {
  register: (input: MotionRegisterInput) => () => void;
  unregister: (id: symbol) => void;
  getRegistrations: (slot?: string) => readonly MotionRegistration[];
  getTarget: (slot: string) => HTMLElement | null;
  getTargets: (slot: string) => readonly HTMLElement[];
  snapshotTargets: () => Record<string, HTMLElement | null>;
  find: (slot: string, node?: HTMLElement | null) => MotionRegistration | undefined;
};

/**
 * Multi-instance slot registry. One slot name may have many live DOM nodes.
 * `register` upserts by `id`; the disposer / `unregister` remove only that id.
 */
export function createMotionRegistry(): MotionRegistry {
  const entries = new Map<symbol, MotionRegistration>();
  const orderBySlot = new Map<string, symbol[]>();

  const addToSlot = (slot: string, id: symbol) => {
    const list = orderBySlot.get(slot);
    if (!list) {
      orderBySlot.set(slot, [id]);
      return;
    }
    if (!list.includes(id)) list.push(id);
  };

  const removeFromSlot = (slot: string, id: symbol) => {
    const list = orderBySlot.get(slot);
    if (!list) return;
    const next = list.filter((item) => item !== id);
    if (next.length === 0) orderBySlot.delete(slot);
    else orderBySlot.set(slot, next);
  };

  const unregister = (id: symbol) => {
    const prev = entries.get(id);
    if (!prev) return;
    entries.delete(id);
    removeFromSlot(prev.slot, id);
  };

  const register = (input: MotionRegisterInput): (() => void) => {
    const id = input.id ?? Symbol(input.slot);
    if (!input.node) {
      unregister(id);
      return () => unregister(id);
    }
    const prev = entries.get(id);
    if (prev && prev.slot !== input.slot) {
      removeFromSlot(prev.slot, id);
    }
    entries.set(id, {
      id,
      slot: input.slot,
      node: input.node,
      motion: input.motion,
    });
    addToSlot(input.slot, id);
    return () => unregister(id);
  };

  const getRegistrations = (slot?: string): readonly MotionRegistration[] => {
    if (slot !== undefined) {
      const ids = orderBySlot.get(slot);
      if (!ids) return [];
      const out: MotionRegistration[] = [];
      for (const id of ids) {
        const entry = entries.get(id);
        if (entry) out.push(entry);
      }
      return out;
    }
    const out: MotionRegistration[] = [];
    for (const ids of orderBySlot.values()) {
      for (const id of ids) {
        const entry = entries.get(id);
        if (entry) out.push(entry);
      }
    }
    return out;
  };

  const getTarget = (slot: string): HTMLElement | null => {
    const ids = orderBySlot.get(slot);
    if (!ids) return null;
    for (const id of ids) {
      const entry = entries.get(id);
      if (entry) return entry.node;
    }
    return null;
  };

  const getTargets = (slot: string): readonly HTMLElement[] => {
    const regs = getRegistrations(slot);
    if (regs.length === 0) return [];
    const nodes: HTMLElement[] = [];
    const seen = new Set<HTMLElement>();
    for (const reg of regs) {
      if (seen.has(reg.node)) continue;
      seen.add(reg.node);
      nodes.push(reg.node);
    }
    return nodes;
  };

  const snapshotTargets = (): Record<string, HTMLElement | null> => {
    const out: Record<string, HTMLElement | null> = {};
    for (const [slot, ids] of orderBySlot) {
      for (const id of ids) {
        const entry = entries.get(id);
        if (entry) {
          out[slot] = entry.node;
          break;
        }
      }
    }
    return out;
  };

  const find = (slot: string, node?: HTMLElement | null): MotionRegistration | undefined => {
    const regs = getRegistrations(slot);
    if (node) return regs.find((reg) => reg.node === node);
    return regs[0];
  };

  return {
    register,
    unregister,
    getRegistrations,
    getTarget,
    getTargets,
    snapshotTargets,
    find,
  };
}
