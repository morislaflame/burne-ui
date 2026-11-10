import { createElement } from "react";
import { describe, expect, it } from "vitest";

import { HOVER_CARD_TRIGGER_NAME, isHoverCardCompound, splitHoverCardMotion } from "./hoverCardAPI";

describe("splitHoverCardMotion", () => {
  it("keeps trigger on the hover scope and forwards the card map", () => {
    const motion = {
      trigger: { hoverIn: { y: -2 } },
      title: { hoverIn: { y: -4 } },
      events: { "card:ping": { y: -6 } },
    };
    expect(splitHoverCardMotion(motion)).toEqual({
      trigger: { hoverIn: { y: -2 } },
      popoverMotion: {
        title: { hoverIn: { y: -4 } },
        events: { "card:ping": { y: -6 } },
      },
    });
  });

  it("returns empty halves when motion is missing", () => {
    expect(splitHoverCardMotion(undefined)).toEqual({
      trigger: undefined,
      popoverMotion: undefined,
    });
  });
});

describe("isHoverCardCompound", () => {
  it("sees HoverCard.Trigger nested in children", () => {
    function Trigger() {
      return null;
    }
    Trigger.displayName = HOVER_CARD_TRIGGER_NAME;
    const tree = createElement(Trigger, null, "Ada");
    expect(isHoverCardCompound(tree)).toBe(true);
    expect(isHoverCardCompound("Ada")).toBe(false);
  });
});
