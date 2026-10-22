import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  createMotionController,
  createMotionGroup,
  SkinProvider,
  useMotionGroupMember,
  type MotionGroup,
  type SkinDefinition,
} from "@/index";
import { createMotionScope, useMotionPart, useSkinSlot } from "@/authoring";
import { clearSkinsForTests } from "@/skins/skinRegistry";
import { registerSkinSlots, resetRegisteredSkinSlots } from "@/skins/skinSlotRegistry";

declare module "@/skin" {
  interface SkinSlotRegistry {
    "pricing.root": true;
  }
}

const priceScope = createMotionScope("PriceTag");

const priceSkin = {
  name: "price",
  targets: { "pricing.root": "price-root" },
  motion: { "pricing.root": { hoverIn: { y: -4 } } },
  layersDeclarative: { "pricing.root": { before: [{ className: "ribbon" }] } },
} satisfies SkinDefinition;

function PriceRoot({
  controller,
  group,
}: {
  controller: ReturnType<typeof createMotionController>;
  group: MotionGroup;
}) {
  const scope = priceScope.useMotionScope();
  const part = useMotionPart<HTMLSpanElement>({ scope, slot: "root" });
  useMotionGroupMember("price", controller, group);
  const slot = useSkinSlot("pricing.root");
  const layerClass = slot.layer?.declarative?.before?.[0]?.className ?? "";
  return (
    <span
      ref={part.setRef}
      data-testid="price"
      data-class={slot.className}
      data-layer={layerClass}
      data-motion={slot.motion?.hoverIn ? "yes" : ""}
    >
      9
    </span>
  );
}

describe("burne-ui/authoring", () => {
  afterEach(() => {
    clearSkinsForTests();
    resetRegisteredSkinSlots();
  });

  it("registers a slot, reads the skin, and joins a MotionGroup", () => {
    registerSkinSlots(["pricing.root"]);
    const controller = createMotionController();
    const group = createMotionGroup();
    render(
      <SkinProvider skin={priceSkin}>
        <priceScope.MotionScopeProvider
          controller={controller}
          motionState="on"
          playInitialState
          motion={{ states: { on: { root: { y: -2, duration: 0.01 } } } }}
        >
          <PriceRoot controller={controller} group={group} />
        </priceScope.MotionScopeProvider>
      </SkinProvider>,
    );

    const node = screen.getByTestId("price");
    expect(controller.getTarget("root")).toBe(node);
    expect(group.getTarget("price", "root")).toBe(node);
    expect(node).toHaveAttribute("data-class", "price-root");
    expect(node).toHaveAttribute("data-layer", "ribbon");
    expect(node).toHaveAttribute("data-motion", "yes");
  });

  it("rejects a misspelled slot on the type", () => {
    const skin = {
      name: "paper",
      // @ts-expect-error pricing.rot is not a SkinSlotRegistry key
      targets: { "pricing.rot": "price" },
    } satisfies SkinDefinition;
    expect(skin.name).toBe("paper");
  });
});
