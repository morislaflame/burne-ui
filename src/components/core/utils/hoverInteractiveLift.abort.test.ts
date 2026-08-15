import { describe, expect, it, vi } from "vitest";

import { animateInteractivePressSqueeze } from "@/components/core/utils/hoverInteractiveLift";

function fakeEl(): HTMLElement {
  return { style: { willChange: "" } } as HTMLElement;
}

describe("animateInteractivePressSqueeze abort", () => {
  it("resolves immediately and skips onReleaseStart when the signal is already aborted", async () => {
    const onReleaseStart = vi.fn();
    const abort = new AbortController();
    abort.abort();

    await expect(
      animateInteractivePressSqueeze(fakeEl(), { onReleaseStart, signal: abort.signal }),
    ).resolves.toBeUndefined();
    expect(onReleaseStart).not.toHaveBeenCalled();
  });
});
