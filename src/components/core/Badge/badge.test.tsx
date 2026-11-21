import { describe, expect, it } from "vitest";

import { render } from "@/__tests__/helpers";

import { Badge } from ".";

describe("Badge Phase 2E fixes", () => {
  it("keeps single-digit count badges accessible (not aria-hidden) while dot badges stay decorative", () => {
    const { container } = render(
      <div>
        <Badge>{1}</Badge>
        <Badge dot />
      </div>,
    );
    const badges = container.querySelectorAll("[data-badge-root]");
    expect(badges[0]).toHaveTextContent("1");
    expect(badges[0]).not.toHaveAttribute("aria-hidden", "true");
    expect(badges[1]).toHaveAttribute("aria-hidden", "true");
  });

  it("cleans up Badge.Anchor microtask safely on immediate unmount", async () => {
    const view = render(
      <Badge.Anchor>
        <span>Inbox</span>
        <Badge>{5}</Badge>
      </Badge.Anchor>,
    );
    view.unmount();
    await new Promise<void>((resolve) => queueMicrotask(resolve));
  });
});
