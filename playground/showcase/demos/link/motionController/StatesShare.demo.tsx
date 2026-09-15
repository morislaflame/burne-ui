import { useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { IoShareOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Link } from "@/components/core/Link";
import { createMotionStates, type MotionContext } from "@/components/core/utils/slotMotion";

import { preventNav } from "../../../shared/utils";

gsap.registerPlugin(SplitText);

type ShareMode = "idle" | "sharing" | "copied" | "failed";

const LABELS: Record<ShareMode, string> = {
  idle: "Share docs",
  sharing: "Sharing…",
  copied: "Copied",
  failed: "Try again",
};

function linkTextEl(ctx: MotionContext): HTMLElement {
  const inner = ctx.el.firstElementChild;
  return inner instanceof HTMLElement ? inner : ctx.el;
}

function splitReveal(ctx: MotionContext, loop: boolean) {
  const el = linkTextEl(ctx);
  if (ctx.reduced) return;
  const split = SplitText.create(el, { type: "chars" });
  ctx.onCleanup(() => {
    gsap.killTweensOf(split.chars);
    const stillSplit = split.chars.some((node) => node instanceof Node && ctx.el.contains(node));
    if (stillSplit) split.revert();
  });
  const tl = gsap.timeline();
  tl.fromTo(
    split.chars,
    { y: 10, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 0.34, stagger: 0.028, ease: "back.out(1.5)" },
  );
  if (loop) {
    tl.to(split.chars, {
      y: -3,
      duration: 0.42,
      yoyo: true,
      repeat: -1,
      stagger: { each: 0.045, from: "start" },
      ease: "sine.inOut",
    });
  }
  return tl;
}

function shareIcon(ctx: MotionContext, spinning: boolean) {
  if (ctx.reduced) {
    gsap.set(ctx.el, { rotation: 0, scale: 1 });
    return;
  }
  if (spinning) {
    return ctx.fromRest({ rotation: 14, scale: 1.12, duration: 0.45, yoyo: true, repeat: -1, ease: "sine.inOut" });
  }
  return ctx.to({ rotation: 0, scale: 1, duration: 0.22 });
}

const states = createMotionStates({
  idle: {
    text: (ctx) => splitReveal(ctx, false),
    icon: (ctx) => shareIcon(ctx, false),
    root: { x: 0, y: 0, duration: 0.2 },
  },
  sharing: {
    text: (ctx) => splitReveal(ctx, true),
    icon: (ctx) => shareIcon(ctx, true),
    root: { x: 0, y: 0, duration: 0.2 },
  },
  copied: {
    text: (ctx) => splitReveal(ctx, false),
    icon: (ctx) => shareIcon(ctx, false),
    root: { x: 0, y: 0, duration: 0.2 },
  },
  failed: {
    text: (ctx) => splitReveal(ctx, false),
    icon: (ctx) => shareIcon(ctx, false),
    root: (ctx) => ctx.fromRest({ x: 6, duration: 0.07, yoyo: true, repeat: 5 }),
  },
});

function wait(ms: number) {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}

export function LinkMotionStatesShareDemo() {
  const [mode, setMode] = useState<ShareMode>("idle");
  const [caption, setCaption] = useState(LABELS.idle);

  async function run(ok: boolean) {
    setCaption(LABELS.sharing);
    setMode("sharing");
    await wait(1200);
    const next: ShareMode = ok ? "copied" : "failed";
    setCaption(LABELS[next]);
    setMode(next);
  }

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="ghost" disabled={mode === "sharing"} onClick={() => void run(false)}>
          Fail
        </Button>
        <Button
          size="small"
          variant="ghost"
          disabled={mode === "sharing" || mode === "idle"}
          onClick={() => {
            setCaption(LABELS.idle);
            setMode("idle");
          }}
        >
          Reset
        </Button>
      </div>
      <Link
        href="#"
        onClick={(event) => {
          preventNav(event);
          if (mode === "sharing") return;
          void run(true);
        }}
        underline
        icon={<IoShareOutline aria-hidden />}
        iconPosition="end"
        classNames={{ text: "overflow-visible" }}
        motionState={mode}
        motion={{ states, root: { pressIn: false } }}
      >
        {caption}
      </Link>
    </div>
  );
}
