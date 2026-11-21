import { afterEach, describe, expect, it, vi } from "vitest";

import { parseSkinDocument } from "./skinDocument";
import { warnSkinSlots } from "./skinSlotChecks";
import { registerSkinSlots, resetRegisteredSkinSlots } from "./skinSlotRegistry";

describe("registerSkinSlots", () => {
  afterEach(() => {
    resetRegisteredSkinSlots();
    vi.restoreAllMocks();
  });

  it("accepts a foreign slot and still rejects a typo", () => {
    registerSkinSlots(["pricing.root"]);
    const parsed = parseSkinDocument({
      name: "paper",
      targets: { "pricing.root": "price" },
      motion: { "pricing.root": { hoverIn: { y: -4 } } },
      layersDeclarative: { "pricing.root": { before: [{ className: "ribbon" }] } },
    });
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.skin.targets?.["pricing.root"]).toBe("price");

    const typo = parseSkinDocument({
      name: "paper",
      targets: { "pricing.rot": "price" },
    });
    expect(typo.ok).toBe(false);
    if (typo.ok) return;
    expect(typo.errors.some((error) => error.includes("pricing.rot"))).toBe(true);
  });

  it("keeps a kit dead slot dead", () => {
    registerSkinSlots(["pricing.root"]);
    const parsed = parseSkinDocument({
      name: "paper",
      targets: { "button.icon": "x" },
    });
    expect(parsed.ok).toBe(false);
    if (parsed.ok) return;
    expect(parsed.errors.some((error) => error.includes("button.icon is dead"))).toBe(true);
  });

  it("warns on an unknown slot until it is registered", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    warnSkinSlots({ name: "paper", targets: { "pricing.root": "price" } });
    expect(error.mock.calls.some((call) => String(call[0]).includes("unknown slot"))).toBe(true);

    error.mockClear();
    registerSkinSlots(["pricing.root"]);
    warnSkinSlots({ name: "paper", targets: { "pricing.root": "price" } });
    expect(error.mock.calls.some((call) => String(call[0]).includes("pricing.root"))).toBe(false);
  });
});
