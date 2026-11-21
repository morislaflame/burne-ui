import { useState } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

import { Button } from "@/components/core/Button";
import { createMotionFactory, createMotionStates, type MotionContext, type MotionPayload } from "@/components/core/utils/slotMotion";

gsap.registerPlugin(TextPlugin);

type BusyMode = "idle" | "busy";

type CaptionPayload = MotionPayload & {
  from: string;
  to: string;
};

const LABELS: Record<BusyMode, string> = {
  idle: "Idle pose",
  busy: "Working…",
};

function captionPayload(ctx: MotionContext<CaptionPayload>): CaptionPayload {
  const to = ctx.payload?.to ?? ctx.el.textContent ?? "";
  return { from: ctx.payload?.from ?? to, to };
}

function morphCaption(ctx: MotionContext<CaptionPayload>, loop: boolean) {
  const { from, to } = captionPayload(ctx);
  if (ctx.reduced) {
    ctx.el.textContent = to;
    gsap.set(ctx.el, { autoAlpha: 1 });
    return;
  }
  const tl = gsap.timeline();
  ctx.onCleanup(() => {
    tl.kill();
    gsap.killTweensOf(ctx.el);
  });
  tl.set(ctx.el, { text: from, autoAlpha: 1 });
  tl.to(ctx.el, { duration: 0.65, text: to, ease: "none" });
  if (loop) {
    tl.to(ctx.el, {
      autoAlpha: 0.4,
      duration: 0.55,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
  }
  return tl;
}

const states = createMotionStates({
  idle: {
    root: { scale: 1, duration: 0.22 },
    text: createMotionFactory<CaptionPayload>((ctx) => morphCaption(ctx, false)),
  },
  busy: {
    root: { scale: 0.97, duration: 0.22 },
    text: createMotionFactory<CaptionPayload>((ctx) => morphCaption(ctx, true)),
  },
});

function wait(ms: number) {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}

export function ButtonMotionStatesBusyDemo() {
  const [mode, setMode] = useState<BusyMode>("idle");
  const [caption, setCaption] = useState<CaptionPayload>({
    from: LABELS.idle,
    to: LABELS.idle,
  });

  async function run() {
    setCaption({ from: LABELS.idle, to: LABELS.busy });
    setMode("busy");
    await wait(4000);
    setCaption({ from: LABELS.busy, to: LABELS.idle });
    setMode("idle");
  }

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button
        variant="outline"
        motionState={mode}
        motionPayload={caption}
        motion={{ states, root: { pressIn: false } }}
        disabled={mode === "busy"}
        onClick={() => void run()}
      >
        {caption.to}
      </Button>
    </div>
  );
}
