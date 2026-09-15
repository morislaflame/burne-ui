import { useState } from "react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

import { Badge } from "@/components/core/Badge";
import { Button } from "@/components/core/Button";
import { createMotionFactory, createMotionStates, type MotionContext, type MotionPayload } from "@/components/core/utils/slotMotion";

gsap.registerPlugin(ScrambleTextPlugin);

type LiveMode = "idle" | "syncing" | "live" | "error";

type CaptionPayload = MotionPayload & {
  from: string;
  to: string;
};

const LABELS: Record<LiveMode, string> = {
  idle: "Offline",
  syncing: "Syncing…",
  live: "Live",
  error: "Offline",
};

const STATUS: Record<LiveMode, "default" | "info" | "success" | "danger"> = {
  idle: "default",
  syncing: "info",
  live: "success",
  error: "danger",
};

function badgeLabelEl(ctx: MotionContext<CaptionPayload>): HTMLElement {
  const inner = ctx.el.querySelector("span");
  return inner instanceof HTMLElement ? inner : ctx.el;
}

function captionPayload(ctx: MotionContext<CaptionPayload>, fallback: HTMLElement): CaptionPayload {
  const to = ctx.payload?.to ?? fallback.textContent ?? "";
  return { from: ctx.payload?.from ?? to, to };
}

function scrambleLabel(ctx: MotionContext<CaptionPayload>, loop: boolean) {
  const label = badgeLabelEl(ctx);
  const { from, to } = captionPayload(ctx, label);
  if (ctx.reduced) {
    label.textContent = to;
    return;
  }
  ctx.onCleanup(() => {
    gsap.killTweensOf(label);
  });
  gsap.set(label, { scrambleText: { text: from, chars: "upperAndLowerCase" } });
  return gsap.to(label, {
    duration: loop ? 0.85 : 0.7,
    repeat: loop ? -1 : 0,
    scrambleText: {
      text: to,
      chars: loop ? "01" : "upperAndLowerCase",
      speed: loop ? 0.5 : 0.55,
      revealDelay: loop ? 0 : 0.1,
      tweenLength: false,
    },
  });
}

function liveRoot(ctx: MotionContext<CaptionPayload>, pose: LiveMode) {
  const tl = ctx.timeline();
  const scramble = scrambleLabel(ctx, pose === "syncing");
  if (scramble) tl.add(scramble, 0);
  if (ctx.reduced) {
    gsap.set(ctx.el, { x: 0, y: 0, scale: 1 });
    return tl;
  }
  if (pose === "syncing") {
    tl.to(ctx.el, { y: -2, scale: 1.02, duration: 0.36, yoyo: true, repeat: -1, ease: "sine.inOut" }, 0);
  } else if (pose === "live") {
    tl.to(ctx.el, { y: 0, scale: 1, duration: 0.28, ease: "back.out(1.6)" }, 0);
  } else if (pose === "error") {
    tl.fromRest(ctx.el, { x: 5, y: 0, scale: 1, duration: 0.07, yoyo: true, repeat: 5 }, 0);
  } else {
    tl.to(ctx.el, { x: 0, y: 0, scale: 1, duration: 0.22 }, 0);
  }
  return tl;
}

const states = createMotionStates({
  idle: { root: createMotionFactory<CaptionPayload>((ctx) => liveRoot(ctx, "idle")) },
  syncing: { root: createMotionFactory<CaptionPayload>((ctx) => liveRoot(ctx, "syncing")) },
  live: { root: createMotionFactory<CaptionPayload>((ctx) => liveRoot(ctx, "live")) },
  error: { root: createMotionFactory<CaptionPayload>((ctx) => liveRoot(ctx, "error")) },
});

function wait(ms: number) {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}

export function BadgeMotionStatesLiveDemo() {
  const [mode, setMode] = useState<LiveMode>("idle");
  const [caption, setCaption] = useState<CaptionPayload>({
    from: LABELS.idle,
    to: LABELS.idle,
  });

  async function run(ok: boolean) {
    setCaption({ from: caption.to, to: LABELS.syncing });
    setMode("syncing");
    await wait(1100);
    const next: LiveMode = ok ? "live" : "error";
    setCaption({ from: LABELS.syncing, to: LABELS[next] });
    setMode(next);
  }

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" disabled={mode === "syncing"} onClick={() => void run(true)}>
          Connect
        </Button>
        <Button size="small" variant="ghost" disabled={mode === "syncing"} onClick={() => void run(false)}>
          Fail
        </Button>
        <Button size="small" variant="ghost" disabled={mode !== "live"} onClick={() => setMode("live")}>
          Stay live
        </Button>
      </div>
      <Badge
        status={STATUS[mode]}
        hoverLift={false}
        motionState={mode}
        motionPayload={caption}
        motion={{ states }}
      >
        {caption.to}
      </Badge>
    </div>
  );
}
