import { fireEvent, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { render } from "@/__tests__/helpers";

import { Resizable } from ".";

describe("Resizable Phase 2E fixes", () => {
  it("computes aria-valuemax from adjacent pair sum in 3-panel groups, initializes aria-valuenow on mount, and respects maxSize", () => {
    render(
      <Resizable orientation="vertical">
        <Resizable.Panel id="p1" defaultSize={30} minSize={10} maxSize={45}>One</Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel id="p2" defaultSize={30} minSize={10}>Two</Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel id="p3" defaultSize={40} minSize={10}>Three</Resizable.Panel>
      </Resizable>,
    );

    const handles = screen.getAllByRole("separator");
    // Vertical orientation adds h-full on root
    expect(handles[0]?.parentElement?.className).toContain("h-full");
    // Initialized on mount before first drag
    expect(handles[0]).toHaveAttribute("aria-valuenow", "30");
    // Pair sum is 30 + 30 = 60; min(maxSize=45, 60 - 10 = 50) -> 45!
    expect(handles[0]).toHaveAttribute("aria-valuemax", "45");
    // Second handle: pair sum is 30 + 40 = 70; 70 - 10 = 60 (NOT 90!)
    expect(handles[1]).toHaveAttribute("aria-valuemax", "60");

    fireEvent.keyDown(handles[0]!, { key: "End" });
    expect(handles[0]).toHaveAttribute("aria-valuenow", "45");
  });

  it("re-normalizes panel sizes when panels mount and unmount dynamically", async () => {
    function DynamicPanels() {
      const [showThird, setShowThird] = useState(true);
      return (
        <div>
          <button type="button" onClick={() => setShowThird((v) => !v)}>Toggle</button>
          <Resizable>
            <Resizable.Panel id="left" defaultSize={30}>Left</Resizable.Panel>
            <Resizable.Handle />
            <Resizable.Panel id="mid" defaultSize={30}>Mid</Resizable.Panel>
            {showThird ? (
              <>
                <Resizable.Handle />
                <Resizable.Panel id="right" defaultSize={40}>Right</Resizable.Panel>
              </>
            ) : null}
          </Resizable>
        </div>
      );
    }

    const { user } = render(<DynamicPanels />);
    expect(screen.getByText("Left").style.flexBasis).toContain("calc(30 *");
    await user.click(screen.getByRole("button", { name: "Toggle" }));
    // Remaining [30, 30] re-normalizes to [50, 50]
    expect(screen.getByText("Left").style.flexBasis).toContain("calc(50 *");
    expect(screen.getByText("Mid").style.flexBasis).toContain("calc(50 *");
  });
});
