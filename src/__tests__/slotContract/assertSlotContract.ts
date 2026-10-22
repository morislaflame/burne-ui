import { isValidElement, type RefCallback } from "react";
import { expect } from "vitest";

import { createMotionController } from "@/components/core/utils/slotMotion";
import { cn } from "@/utils/cn";

import { render } from "../helpers";
import type { SlotContractFixture, SlotContractPartProps } from "./types";

const SLOT_RE = /(?:^|\s)__slot_([A-Za-z]\w*)(?:\s|$)/g;
const MERGE_SLOT = "__merge_slot";
const MERGE_USER = "__merge_user";

function slotMarker(key: string) {
  return `__slot_${key}`;
}

function partMarker(name: string) {
  return `__part_${name}`;
}

function classTokens(el: Element) {
  return [...el.classList];
}

function pairKey(a: string, b: string) {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

export function assertSlotContract(
  fixture: SlotContractFixture,
  slotKeys: readonly string[],
  motionKeys: readonly string[] | undefined,
) {
  const refs = new Map<string, { current: Element | null }>();
  const part = (name: string): SlotContractPartProps => {
    const box = refs.get(name) ?? { current: null };
    refs.set(name, box);
    const ref: RefCallback<Element> = (node) => {
      box.current = node;
    };
    return { className: partMarker(name), ref };
  };

  const rootSlot = fixture.rootSlot ?? (slotKeys.includes("root") ? "root" : undefined);
  const classNames: Record<string, string> = {};
  for (const key of slotKeys) {
    classNames[key] = slotMarker(key);
  }
  if (rootSlot && !fixture.skipRootMerge) {
    classNames[rootSlot] = cn(classNames[rootSlot], MERGE_SLOT);
  }

  const motionController = createMotionController();

  const ui = fixture.render({
    classNames,
    className: MERGE_USER,
    motionController,
    part,
  });
  if (!isValidElement(ui)) {
    throw new Error(`${fixture.typeName}: fixture must return an element`);
  }
  render(ui);

  const scope = document.body;
  const missing: string[] = [];
  for (const key of slotKeys) {
    if (fixture.optionalSlots?.includes(key)) continue;
    const found = scope.querySelector(`.${slotMarker(key)}`);
    if (!found) missing.push(key);
  }
  expect(missing, `${fixture.typeName}: missing slot markers`).toEqual([]);

  const allowed = new Set(
    (fixture.allowDuplicateSlots ?? []).map(([a, b]) => pairKey(a, b)),
  );
  const doubles: string[] = [];
  for (const el of scope.querySelectorAll("[class*='__slot_']")) {
    const slots: string[] = [];
    const cls = el.getAttribute("class") ?? "";
    SLOT_RE.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = SLOT_RE.exec(cls))) {
      slots.push(match[1]!);
    }
    if (slots.length < 2) continue;
    const unique = [...new Set(slots)];
    if (unique.length < 2) continue;
    const extra = unique.filter((slot, index) => {
      if (index === 0) return false;
      return !allowed.has(pairKey(unique[0]!, slot));
    });
    // Every pair among unique slots must be allowlisted.
    const badPairs: string[] = [];
    for (let i = 0; i < unique.length; i += 1) {
      for (let j = i + 1; j < unique.length; j += 1) {
        const key = pairKey(unique[i]!, unique[j]!);
        if (!allowed.has(key)) badPairs.push(key);
      }
    }
    if (badPairs.length > 0) {
      doubles.push(`${unique.join("+")} on <${el.tagName.toLowerCase()}>`);
    }
    void extra;
  }
  expect(doubles, `${fixture.typeName}: two classNames slots on one node`).toEqual([]);

  if (fixture.parts) {
    for (const [partName, slot] of Object.entries(fixture.parts)) {
      const partEl = scope.querySelector(`.${partMarker(partName)}`);
      if (!partEl && fixture.optionalSlots?.includes(slot)) continue;
      expect(partEl, `${fixture.typeName}: missing __part_${partName}`).toBeTruthy();
      const slotEl = partEl && classTokens(partEl).includes(slotMarker(slot)) ? partEl : null;
      expect(
        slotEl,
        `${fixture.typeName}: __part_${partName} must share the node with __slot_${slot}`,
      ).toBe(partEl);
      const ref = refs.get(partName);
      expect(ref?.current, `${fixture.typeName}: ${partName} ref`).toBe(partEl);
    }
  }

  if (!fixture.skipMotion && motionKeys && motionKeys.length > 0) {
    const skip = new Set(fixture.notMotionTargets ?? []);
    const nested = new Set(fixture.nestedScopeSlots ?? []);
    for (const slot of motionKeys) {
      if (!slotKeys.includes(slot) || skip.has(slot)) continue;
      const marker = scope.querySelector(`.${slotMarker(slot)}`);
      if (fixture.optionalSlots?.includes(slot) && !marker) continue;
      const target =
        motionController.getTarget(slot) ?? motionController.getTargets(slot)[0] ?? null;
      if (nested.has(slot)) {
        expect(
          marker,
          `${fixture.typeName}: nested slot "${slot}" marker`,
        ).toBeTruthy();
        expect(
          target,
          `${fixture.typeName}: nested slot "${slot}" is not visible from the root controller`,
        ).toBeNull();
        continue;
      }
      expect(target, `${fixture.typeName}: motion getTarget("${slot}")`).toBeTruthy();
      expect(
        target && classTokens(target).includes(slotMarker(slot)),
        `${fixture.typeName}: motion "${slot}" must be the __slot_${slot} node`,
      ).toBe(true);
    }
  }

  if (rootSlot && !fixture.skipRootMerge) {
    const mergeNodes = [...scope.querySelectorAll(`.${MERGE_USER}`)];
    expect(
      mergeNodes.length,
      `${fixture.typeName}: className="${MERGE_USER}" must land on exactly one node`,
    ).toBe(1);
    const rootEl = scope.querySelector(`.${slotMarker(rootSlot)}`);
    expect(rootEl, `${fixture.typeName}: root slot ${rootSlot}`).toBeTruthy();
    expect(
      rootEl && classTokens(rootEl).includes(MERGE_USER),
      `${fixture.typeName}: user className must land on ${rootSlot}`,
    ).toBe(true);
    const className = rootEl?.getAttribute("class") ?? "";
    const slotAt = className.indexOf(MERGE_SLOT);
    const userAt = className.indexOf(MERGE_USER);
    expect(
      slotAt >= 0 && userAt > slotAt,
      `${fixture.typeName}: cn order kit → classNames.${rootSlot} → className (user last)`,
    ).toBe(true);
  }
}
