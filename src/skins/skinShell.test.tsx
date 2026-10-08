import { fireEvent } from "@testing-library/react";
import { useState, type ComponentProps, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createMotionScope, type MotionScopeValue } from "@/components/core/utils/slotMotion";
import { render } from "@/__tests__/helpers";

import { resolveSkinLayer } from "./resolveSkinLayer";
import { unregisterSkin, registerSkin } from "./skinRegistry";
import { SkinShell } from "./skinShell";
import type { SkinLayerProps } from "./skinTypes";

const { MotionScopeProvider, useMotionScope } = createMotionScope("SkinShellTest");

let scope: MotionScopeValue | null = null;

function Host({ children }: { children: ReactNode }) {
  return <MotionScopeProvider>{children}</MotionScopeProvider>;
}

function Probe(props: Omit<ComponentProps<typeof SkinShell>, "scope">) {
  scope = useMotionScope();
  return <SkinShell scope={scope} {...props} />;
}

const LAYER_DECL_FIXTURE = {
  name: "layer-decl",
  styleUrl: "skin-fixture/styles.css",
  layersDeclarative: {
    "surface.root": {
      wrapper: { className: "skin-panel skin-wrap" },
      before: [{ className: "skin-shadow" }],
      content: { className: "skin-content" },
    },
    "card.root": {
      wrapper: { className: "skin-panel skin-wrap" },
      before: [{ className: "skin-shadow" }],
      content: { className: "skin-content" },
    },
  },
};

afterEach(() => {
  unregisterSkin("layer-code");
  unregisterSkin("layer-decl");
  scope = null;
});

describe("SkinShell", () => {
  it("forwards ref, rest, and pointer handlers onto the motion node", () => {
    const ref = vi.fn();
    const onPointerOver = vi.fn();
    registerSkin({
      name: "layer-code",
      styleUrl: "skin-fixture/styles.css",
      layers: {
        "card.root": (props: SkinLayerProps) => (
          <div
            data-layer="code"
            {...(props as HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> })}
          />
        ),
      },
    });

    const { getByTestId } = render(
      <Host>
        <Probe
          part="card.root"
          variant="layer-code"
          ref={ref}
          data-testid="shell"
          data-rest="kept"
          onPointerOver={onPointerOver}
        >
          body
        </Probe>
      </Host>);

    const node = getByTestId("shell");
    expect(node).toHaveAttribute("data-layer", "code");
    expect(node).toHaveAttribute("data-rest", "kept");
    expect(node).toHaveTextContent("body");
    expect(ref).toHaveBeenCalledWith(node);
    expect(scope?.getTarget("root")).toBe(node);
    node.dispatchEvent(new PointerEvent("pointerover", { bubbles: true }));
    expect(onPointerOver).toBeCalled();
  });

  it("renders a declarative layer as panel → shadow + content", () => {
    registerSkin(LAYER_DECL_FIXTURE);

    const { container } = render(
      <Host>
        <Probe part="card.root" variant="layer-decl">
          pane
        </Probe>
      </Host>);

    const panel = container.querySelector(".skin-panel");
    expect(panel).toBeTruthy();
    expect(panel?.querySelector(".skin-shadow")).toBeTruthy();
    expect(panel?.querySelector(".skin-content")?.textContent).toBe("pane");
    expect(scope?.getTarget("root")).toBe(panel);
    expect(resolveSkinLayer("default", "card.root")).toBeNull();
  });

  it("variant default does not mount declarative layers", () => {
    registerSkin({
      name: "layer-decl",
      styleUrl: "skin-fixture/styles.css",
      layersDeclarative: {
        "card.root": {
          wrapper: { className: "skin-panel" },
          before: [{ className: "skin-shadow" }],
          content: { className: "skin-content" },
        },
      },
    });

    const { container } = render(
      <Host>
        <Probe part="card.root" variant="default">
          plain
        </Probe>
      </Host>);

    expect(container.querySelector(".skin-shadow")).toBeNull();
    expect(container.querySelector(".skin-content")).toBeNull();
    expect(container).toHaveTextContent("plain");
  });

  it("keeps the slot registration when the layer re-renders", () => {
    registerSkin(LAYER_DECL_FIXTURE);

    function Flip() {
      const [text, setText] = useState("one");
      scope = useMotionScope();
      return (
        <SkinShell
          part="card.root"
          variant="layer-decl"
          scope={scope}
          onClick={() => setText("two")}
        >
          {text}
        </SkinShell>
      );
    }

    const { getByText } = render(
      <Host>
        <Flip />
      </Host>);
    const first = scope?.getTarget("root");
    fireEvent.click(getByText("one"));
    expect(scope?.getTarget("root")).toBe(first);
    expect(getByText("two")).toBeTruthy();
  });

  it("keeps duplicate before layers and paints wrapper, content, and after", () => {
    registerSkin({
      name: "layer-decl",
      styleUrl: "skin-fixture/styles.css",
      layersDeclarative: {
        "card.root": {
          wrapper: { className: "skin-panel", style: { padding: "4px" } },
          before: [
            { className: "skin-shadow", style: { opacity: "0.4" } },
            { className: "skin-shadow", style: { opacity: "0.8" } },
          ],
          content: { className: "skin-content", style: { gap: "8px" } },
          after: [{ className: "skin-after" }],
        },
      },
    });

    const { container } = render(
      <Host>
        <Probe part="card.root" variant="layer-decl">
          pane
        </Probe>
      </Host>);

    const panel = container.querySelector(".skin-panel");
    const shadows = panel?.querySelectorAll(":scope > .skin-shadow");
    const content = panel?.querySelector(":scope > .skin-content");
    expect(shadows).toHaveLength(2);
    expect(shadows?.[0]).toHaveStyle({ opacity: "0.4" });
    expect(shadows?.[1]).toHaveStyle({ opacity: "0.8" });
    expect(panel).toHaveStyle({ padding: "4px" });
    expect(content).toHaveStyle({ gap: "8px" });
    expect(content?.textContent).toBe("pane");
    expect(panel?.lastElementChild).toHaveClass("skin-after");
  });
});
