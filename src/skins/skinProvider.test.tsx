import { useEffect, useMemo } from "react";
import { act } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ButtonGroup } from "@/components/composite/ButtonGroup";
import { resolveButtonMotionDefaults } from "@/components/core/Button/buttonAnimations";
import { Button } from "@/components/core/Button";
import { Card } from "@/components/core/Card";
import { Table } from "@/components/core/Table";
import { Dialog } from "@/components/core/Dialog";
import { SkinProvider, useSkin, useSkinRegistryRevision } from "@/skins/skinContext";
import { clearSkinsForTests, getSkinRevision, registerKitSkin, registerSkin } from "@/skins/skinRegistry";
import type { SkinDefinition } from "@/skins/skinTypes";

import { render } from "../__tests__/helpers";

const html = document.documentElement;

function seedKit() {
  html.style.setProperty("--radius", "8px");
  html.style.setProperty("--border-width", "1px");
  html.style.setProperty("--color-primary", "blue");
  html.style.setProperty("--color-focus-ring", "Highlight");
}

const brutal: SkinDefinition = {
  name: "brutal",
  tokens: { "--radius": "0px", "--border-width": "3px", "--color-primary": "red" },
  targets: {
    "button.root": "skin-brutal-button",
    "card.root": "skin-brutal-card",
  },
};

const soft: SkinDefinition = {
  name: "soft",
  tokens: { "--radius": "12px" },
};

function Read({ id }: { id: string }) {
  const skin = useSkin();
  return (
    <span
      data-testid={id}
      data-skin-name={skin?.name ?? ""}
      data-targets={skin?.targets["button.root"] ?? ""}
      data-radius={skin?.effective["--radius"] ?? ""}
      data-border={skin?.effective["--border-width"] ?? ""}
      data-primary={skin?.effective["--color-primary"] ?? ""}
      data-ring={skin?.effective["--color-focus-ring"] ?? ""}
    >
      {id}
    </span>
  );
}

function host(name: string) {
  return document.querySelector(`[data-skin="${name}"]`) as HTMLElement;
}

describe("SkinProvider", () => {
  afterEach(() => {
    clearSkinsForTests();
    for (const key of ["--radius", "--border-width", "--color-primary", "--color-focus-ring"]) {
      html.style.removeProperty(key);
    }
    delete html.dataset.skin;
  });

  it("restores kit variables and drops classes under skin={null}", () => {
    seedKit();
    const { getByTestId, getByRole } = render(
      <SkinProvider skin={brutal} root={html}>
        <SkinProvider skin={null}>
          <Read id="plain" />
          <Button type="button">Kit</Button>
          <Button type="button" variant="brutal">Named</Button>
        </SkinProvider>
      </SkinProvider>);
    const node = getByTestId("plain");
    const reset = host("none");
    const kitButton = getByRole("button", { name: "Kit" });
    const namedButton = getByRole("button", { name: "Named" });
    expect(reset.style.getPropertyValue("--radius").trim()).toBe("8px");
    expect(reset.style.getPropertyValue("--border-width").trim()).toBe("1px");
    expect(node.dataset.skinName).toBe("");
    expect(node.dataset.targets).toBe("");
    expect(kitButton.dataset.variant).toBe("default");
    expect(kitButton.className).not.toContain("skin-brutal-button");
    expect(namedButton.dataset.variant).toBe("brutal");
    expect(namedButton.className).toContain("skin-brutal-button");
    expect(html.style.getPropertyValue("--radius").trim()).toBe("0px");
  });

  it("lets the inner skin win and keeps unspecified tokens", () => {
    seedKit();
    const { getByTestId } = render(
      <SkinProvider skin={brutal}>
        <Read id="outer" />
        <SkinProvider skin={soft}>
          <Read id="inner" />
        </SkinProvider>
      </SkinProvider>);
    const outer = getByTestId("outer");
    const inner = getByTestId("inner");
    expect(host("brutal").style.getPropertyValue("--radius").trim()).toBe("0px");
    expect(host("brutal").style.getPropertyValue("--border-width").trim()).toBe("3px");
    expect(host("soft").style.getPropertyValue("--radius").trim()).toBe("12px");
    expect(host("soft").style.getPropertyValue("--border-width").trim()).toBe("");
    expect(outer.dataset.radius).toBe("0px");
    expect(outer.dataset.border).toBe("3px");
    expect(inner.dataset.radius).toBe("12px");
    expect(inner.dataset.border).toBe("3px");
  });

  it("paints the kit baseline on a dialog opened from skin={null}", async () => {
    seedKit();
    render(
      <SkinProvider skin={brutal} root={html}>
        <SkinProvider skin={null}>
          <Dialog defaultOpen>
            <Dialog.Panel>
              <Dialog.Title>Title</Dialog.Title>
            </Dialog.Panel>
          </Dialog>
        </SkinProvider>
      </SkinProvider>);
    const dialog = document.querySelector("dialog");
    expect(dialog).not.toBeNull();
    expect(getComputedStyle(dialog!).getPropertyValue("--radius").trim()).toBe("8px");
    expect(getComputedStyle(html).getPropertyValue("--radius").trim()).toBe("0px");
  });

  it("uses the active skin when variant is omitted and resets palette on default", () => {
    seedKit();
    const { getByRole, getByTestId } = render(
      <SkinProvider skin={brutal}>
        <Button type="button">Open</Button>
        <Button type="button" variant="default">Plain</Button>
        <Button type="button" variant="outline">Line</Button>
        <ButtonGroup>
          <Button type="button">Grouped</Button>
        </ButtonGroup>
        <Card data-testid="card-skin">Skin card</Card>
        <Card variant="default" data-testid="card-plain">Plain card</Card>
        <SkinProvider skin={soft}>
          <Button type="button">Inner</Button>
        </SkinProvider>
      </SkinProvider>);
    const open = getByRole("button", { name: "Open" });
    const plain = getByRole("button", { name: "Plain" });
    const line = getByRole("button", { name: "Line" });
    const grouped = getByRole("button", { name: "Grouped" });
    const inner = getByRole("button", { name: "Inner" });
    const skinCard = getByTestId("card-skin");
    const plainCard = getByTestId("card-plain");

    expect(host("brutal").style.getPropertyValue("--radius").trim()).toBe("0px");
    expect(open.dataset.variant).toBe("brutal");
    expect(open.className).toContain("skin-brutal-button");
    expect(open.style.getPropertyValue("--color-primary").trim()).toBe("");
    expect(open.style.getPropertyValue("--radius").trim()).toBe("");

    expect(plain.dataset.variant).toBe("default");
    expect(plain.className).not.toContain("skin-brutal-button");
    expect(plain.style.getPropertyValue("--color-primary").trim()).toBe("blue");
    expect(plain.style.getPropertyValue("--radius").trim()).toBe("");

    expect(line.dataset.variant).toBe("outline");
    expect(line.className).not.toContain("skin-brutal-button");
    expect(line.style.getPropertyValue("--color-primary").trim()).toBe("");

    expect(grouped.dataset.variant).toBe("brutal");
    expect(grouped.className).toContain("skin-brutal-button");

    expect(skinCard.className).toContain("skin-brutal-card");
    expect(skinCard.style.getPropertyValue("--radius").trim()).toBe("");
    expect(plainCard.className).not.toContain("skin-brutal-card");
    expect(plainCard.style.getPropertyValue("--color-primary").trim()).toBe("blue");
    expect(plainCard.style.getPropertyValue("--radius").trim()).toBe("");

    expect(inner.dataset.variant).toBe("soft");
    expect(inner.className).not.toContain("skin-brutal-button");
  });

  it("swaps tokens without remounting children", () => {
    seedKit();
    let mounts = 0;
    function Mark() {
      useEffect(() => {
        mounts += 1;
      }, []);
      return <Read id="live" />;
    }
    const { rerender } = render(
      <SkinProvider skin={brutal}>
        <Mark />
      </SkinProvider>);
    expect(mounts).toBe(1);
    expect(host("brutal").style.getPropertyValue("--radius").trim()).toBe("0px");
    rerender(
      <SkinProvider skin={soft}>
        <Mark />
      </SkinProvider>);
    expect(mounts).toBe(1);
    expect(host("soft").style.getPropertyValue("--radius").trim()).toBe("12px");
  });

  it("drops a forbidden focus-ring token and keeps the kit ring", () => {
    seedKit();
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const bad: SkinDefinition = {
      name: "bad",
      tokens: { "--color-focus-ring": "red", "--radius": "0px" },
    };
    const { getByTestId } = render(
      <SkinProvider skin={bad}>
        <Read id="ring" />
      </SkinProvider>);
    const node = getByTestId("ring");
    expect(host("bad").style.getPropertyValue("--color-focus-ring").trim()).toBe("");
    expect(host("bad").style.getPropertyValue("--radius").trim()).toBe("0px");
    expect(html.style.getPropertyValue("--color-focus-ring").trim()).toBe("Highlight");
    expect(node.dataset.ring).toBe("");
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });

  it("registers kit and app skins, and refuses a silent kit override", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    registerKitSkin({ name: "kit", tokens: { "--radius": "1px" } });
    registerSkin({ name: "app", tokens: { "--radius": "2px" } });
    registerSkin({ name: "kit", tokens: { "--radius": "9px" } });
    render(
      <SkinProvider skin="kit">
        <Read id="kit" />
      </SkinProvider>);
    expect(host("kit").style.getPropertyValue("--radius").trim()).toBe("1px");
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("updates tokens and classes when the skins prop changes", () => {
    const first: SkinDefinition = {
      name: "live",
      tokens: { "--radius": "1px" },
    };
    const { rerender, getByRole } = render(
      <SkinProvider skin="live" skins={[first]}>
        <Button type="button">Live</Button>
      </SkinProvider>,
    );
    const button = getByRole("button", { name: "Live" });
    expect(host("live").style.getPropertyValue("--radius").trim()).toBe("1px");
    expect(button.className).not.toContain("skin-live");
    rerender(
      <SkinProvider
        skin="live"
        skins={[{
          name: "live",
          tokens: { "--radius": "4px" },
          targets: { "button.root": "skin-live" },
        }]}
      >
        <Button type="button">Live</Button>
      </SkinProvider>,
    );
    expect(host("live").style.getPropertyValue("--radius").trim()).toBe("4px");
    expect(button.className).toContain("skin-live");
  });

  it("repaints provider tokens when registerSkin replaces the active skin", () => {
    registerSkin({ name: "live", tokens: { "--radius": "1px" } });
    render(
      <SkinProvider skin="live">
        <Read id="live" />
      </SkinProvider>,
    );
    expect(host("live").style.getPropertyValue("--radius").trim()).toBe("1px");
    act(() => {
      registerSkin({ name: "live", tokens: { "--radius": "4px" } });
    });
    expect(host("live").style.getPropertyValue("--radius").trim()).toBe("4px");
  });

  it("repaints a memoized table row when the registry changes", () => {
    const { container } = render(
      <Table variant="late">
        <Table.Content aria-label="Late">
          <Table.Header>
            <Table.Column isRowHeader>Name</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>A</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table>,
    );
    const row = container.querySelector("tbody tr");
    expect(row?.className).not.toContain("skin-row");
    act(() => {
      registerSkin({ name: "late", targets: { "table.row": "skin-row", "table.cell": "skin-cell" } });
    });
    const cell = container.querySelector("tbody td");
    expect(row?.className).toContain("skin-row");
    expect(cell?.className).toContain("skin-cell");
  });

  it("does not bump the revision when the same skin is written again", () => {
    registerSkin({ name: "late", targets: { "button.root": "skin-a" } });
    const revision = getSkinRevision();
    registerSkin({ name: "late", targets: { "button.root": "skin-a" } });
    expect(getSkinRevision()).toBe(revision);
  });

  it("repaints a mounted button when the registry changes", () => {
    const { getByRole } = render(<Button type="button" variant="late">Late</Button>);
    const button = getByRole("button", { name: "Late" });
    expect(button.className).not.toContain("skin-a");
    act(() => {
      registerSkin({ name: "late", targets: { "button.root": "skin-a" } });
    });
    expect(button.className).toContain("skin-a");
    expect(button.className).not.toContain("skin-b");
    act(() => {
      registerSkin({ name: "late", targets: { "button.root": "skin-b" } });
    });
    expect(button.className).toContain("skin-b");
    expect(button.className).not.toContain("skin-a");
  });

  it("refreshes skin motion when the registry changes", () => {
    function HoverProbe() {
      const revision = useSkinRegistryRevision();
      const hover = useMemo(() => {
        void revision;
        return resolveButtonMotionDefaults({ variant: "late" }).root?.hoverIn;
      }, [revision]);
      const label = typeof hover === "string" ? hover : "";
      return <span data-testid="hover">{label}</span>;
    }
    const { getByTestId } = render(<HoverProbe />);
    expect(getByTestId("hover").textContent).not.toBe("cyberGlowIn");
    act(() => {
      registerSkin({
        name: "late",
        motion: { "button.root": { hoverIn: "cyberGlowIn" } },
      });
    });
    expect(getByTestId("hover").textContent).toBe("cyberGlowIn");
  });
});
