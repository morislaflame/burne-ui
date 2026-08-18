import { describe, expect, expectTypeOf, it } from "vitest";

import { createMotionController } from "./motionController";
import { createMotionEvents } from "./motionEvents";
import type { MotionController, MotionPlayEvent } from "./motionControllerTypes";
import type { MotionPhaseName } from "./slotMotionTypes";

describe("MotionController play event types", () => {
  it("accepts phases and namespaced events without a generic", () => {
    const controller = createMotionController();
    type PlayArg = Parameters<typeof controller.play>[0];
    type AllArg = Parameters<typeof controller.playAll>[0];
    expectTypeOf<PlayArg>().toEqualTypeOf<MotionPlayEvent>();
    expectTypeOf<AllArg>().toEqualTypeOf<PlayArg>();
    expectTypeOf<PlayArg>().toMatchTypeOf<MotionPhaseName | (string & {})>();
    const phase: PlayArg = "hoverIn";
    const event: PlayArg = "card:rise";
    const allArg: AllArg = "card:rise";
    expect(typeof controller.playSlot).toBe("function");
    expect(phase).toBe("hoverIn");
    expect(event).toBe("card:rise");
    expect(allArg).toBe("card:rise");
  });

  it("keeps phases when TEvent is inferred from createMotionEvents", () => {
    const events = createMotionEvents({
      "card:rise": { y: -6 },
      "card:rest": { y: 0 },
    });
    const controller = createMotionController<keyof typeof events>();
    type PlayArg = Parameters<typeof controller.play>[0];
    const phase: PlayArg = "hoverIn";
    const event: PlayArg = "card:rise";
    // @ts-expect-error unknown event name
    const typo: PlayArg = "card:typo";
    expect(phase).toBe("hoverIn");
    expect(event).toBe("card:rise");
    expect(typo).toBe("card:typo");
  });

  it("types Card-style handles as MotionController", () => {
    const controller: MotionController = createMotionController();
    const event: Parameters<typeof controller.play>[0] = "notify:ping";
    expect(event).toBe("notify:ping");
    expect(typeof controller.playAll).toBe("function");
  });
});
