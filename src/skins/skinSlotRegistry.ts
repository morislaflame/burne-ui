/**
 * Runtime set of slots a package added with `registerSkinSlots`.
 * Kit tables stay generated. A name lands here only after that call.
 * The CLI keeps the same contract in its own process (`--slot`).
 */
const extra = new Set<string>();

export function registerSkinSlots(
  slots: readonly string[],
  mode: "add" | "replace" = "add",
): void {
  if (mode === "replace") extra.clear();
  for (const slot of slots) {
    if (typeof slot !== "string") continue;
    const name = slot.trim();
    if (name === "") {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[burne-ui] registerSkinSlots: empty slot");
      }
      continue;
    }
    extra.add(name);
  }
}

export function isRegisteredSkinSlot(slot: string): boolean {
  return extra.has(slot);
}

/** Kit live set, plus every slot `registerSkinSlots` added. */
export function isAcceptedSkinSlot(slot: string, live: ReadonlySet<string>): boolean {
  return live.has(slot) || extra.has(slot);
}

export function skinSlotIssue(
  slot: string,
  known: ReadonlySet<string>,
  live: ReadonlySet<string>,
): "empty" | "unknown" | "dead" | null {
  if (slot.trim() === "") return "empty";
  if (!known.has(slot) && !extra.has(slot)) return "unknown";
  if (!live.has(slot) && !extra.has(slot)) return "dead";
  return null;
}

/** Test-only. */
export function resetRegisteredSkinSlots(): void {
  extra.clear();
}
