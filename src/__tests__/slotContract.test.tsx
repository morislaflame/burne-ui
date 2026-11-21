import path from "node:path";
import { describe, expect, it } from "vitest";

import { loadClassNamesTypes } from "../../scripts/classNamesInventory.mjs";

import { assertSlotContract } from "./slotContract/assertSlotContract";
import { SLOT_CONTRACT_FIXTURES } from "./slotContract/fixtures";
import {
  CLASS_NAMES_SLOTS,
  SKIP_CONTRACT_TYPES,
  motionKeysForClassNames,
} from "./slotContract/inventory";

describe("R1.1 slot contract", () => {
  it("covers every XxxClassNames type with a fixture", () => {
    const covered = new Set<string>();
    for (const fixture of SLOT_CONTRACT_FIXTURES) {
      covered.add(fixture.typeName);
      for (const extra of fixture.covers ?? []) covered.add(extra);
    }

    const missing = [...CLASS_NAMES_SLOTS.keys()]
      .filter((name) => !SKIP_CONTRACT_TYPES.has(name) && !covered.has(name))
      .sort();

    expect(missing, "new XxxClassNames without a slot-contract fixture").toEqual([]);

    const docsInventory = loadClassNamesTypes(path.resolve("src/components"));
    for (const name of docsInventory.types.keys()) {
      expect(covered.has(name) || SKIP_CONTRACT_TYPES.has(name), name).toBe(true);
    }
  });

  it.each(SLOT_CONTRACT_FIXTURES.map((fixture) => [fixture.typeName, fixture] as const))(
    "%s",
    (typeName, fixture) => {
      const keys = CLASS_NAMES_SLOTS.get(typeName);
      expect(keys, `${typeName} must exist in XxxClassNames inventory`).toBeTruthy();
      assertSlotContract(fixture, keys ?? [], motionKeysForClassNames(typeName));
    },
  );
});
