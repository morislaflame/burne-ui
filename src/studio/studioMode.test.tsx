import { render } from "@testing-library/react";
import { useRef } from "react";
import { describe, expect, it } from "vitest";

import { createMotionScope } from "@/components/core/utils/slotMotion";
import { useMotionPart } from "@/components/core/utils/slotMotion/useMotionPart";

import { StudioModeProvider } from "./studioMode";

const { MotionScopeProvider, useMotionScope } = createMotionScope("Button");

function Probe() {
  const scope = useMotionScope();
  const ref = useRef<HTMLButtonElement>(null);
  const { setRef } = useMotionPart({ scope, slot: "root", forwardedRef: ref });
  return <button ref={setRef} type="button">Go</button>;
}

describe("studio slot marker", () => {
  it("marks a live slot with and without StudioModeProvider", () => {
    const { rerender, getByRole } = render(
      <MotionScopeProvider>
        <Probe />
      </MotionScopeProvider>,
    );
    expect(getByRole("button").getAttribute("data-skin-slot")).toBe("button.root");
    rerender(
      <StudioModeProvider>
        <MotionScopeProvider>
          <Probe />
        </MotionScopeProvider>
      </StudioModeProvider>,
    );
    expect(getByRole("button").getAttribute("data-skin-slot")).toBe("button.root");
  });

  it("marks a host root registered through registerTarget", () => {
    function Host({ on }: { on: boolean }) {
      const scope = useMotionScope();
      return on ? <button ref={(node) => scope.registerTarget("root", node)} type="button">Host</button> : null;
    }
    const { rerender, getByRole, queryByRole } = render(
      <MotionScopeProvider>
        <Host on />
      </MotionScopeProvider>,
    );
    expect(getByRole("button").getAttribute("data-skin-slot")).toBe("button.root");
    rerender(
      <MotionScopeProvider>
        <Host on={false} />
      </MotionScopeProvider>,
    );
    expect(queryByRole("button")).toBeNull();
  });

  it("follows a swapped node", () => {
    function Swap({ which }: { which: "a" | "b" }) {
      const scope = useMotionScope();
      const { setRef } = useMotionPart<HTMLButtonElement>({ scope, slot: "root" });
      if (which === "a") return <button key="a" ref={setRef} type="button">A</button>;
      return <button key="b" ref={setRef} type="button">B</button>;
    }
    const { rerender, getByRole } = render(
      <StudioModeProvider>
        <MotionScopeProvider>
          <Swap which="a" />
        </MotionScopeProvider>
      </StudioModeProvider>,
    );
    expect(getByRole("button", { name: "A" }).getAttribute("data-skin-slot")).toBe("button.root");
    rerender(
      <StudioModeProvider>
        <MotionScopeProvider>
          <Swap which="b" />
        </MotionScopeProvider>
      </StudioModeProvider>,
    );
    expect(getByRole("button", { name: "B" }).getAttribute("data-skin-slot")).toBe("button.root");
  });
});
