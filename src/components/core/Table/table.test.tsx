import { fireEvent, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { render } from "@/__tests__/helpers";
import { Button } from "@/components/core/Button";

import { Table, type Selection } from ".";

describe("Table Phase 2E fixes", () => {
  it("materializes remaining selectable keys when unchecking one row from selectedKeys='all'", async () => {
    const onSelectionChange = vi.fn();
    const { user } = render(
      <Table
        selectionMode="multiple"
        defaultSelectedKeys="all"
        disabledKeys={["b"]}
        onSelectionChange={onSelectionChange}
      >
        <Table.Content aria-label="Users">
          <Table.Header>
            <Table.Column rowHeader>Name</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row id="a"><Table.Cell>Ada</Table.Cell></Table.Row>
            <Table.Row id="b"><Table.Cell>Bob</Table.Cell></Table.Row>
            <Table.Row id="c"><Table.Cell>Cara</Table.Cell></Table.Row>
          </Table.Body>
        </Table.Content>
      </Table>,
    );

    const ada = screen.getByRole("row", { name: "Ada" });
    const cara = screen.getByRole("row", { name: "Cara" });
    expect(ada).toHaveAttribute("aria-selected", "true");
    expect(cara).toHaveAttribute("aria-selected", "true");

    await user.click(ada);
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    const next = onSelectionChange.mock.calls[0]?.[0] as Set<string>;
    expect(Array.from(next)).toEqual(["c"]);
    expect(ada).toHaveAttribute("aria-selected", "false");
    expect(cara).toHaveAttribute("aria-selected", "true");
  });

  it("handles selectionMode='single' with disallowEmptySelection and selectedKeys='all' without bogus calls", async () => {
    const onSelectionChange = vi.fn();
    function Harness({ initial }: { initial: Selection }) {
      const [sel, setSel] = useState<Selection>(initial);
      return (
        <Table
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={sel}
          onSelectionChange={(next) => {
            onSelectionChange(next);
            setSel(next);
          }}
        >
          <Table.Content aria-label="Single">
            <Table.Header>
              <Table.Column rowHeader>Name</Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row id="a"><Table.Cell>Ada</Table.Cell></Table.Row>
              <Table.Row id="b"><Table.Cell>Cara</Table.Cell></Table.Row>
            </Table.Body>
          </Table.Content>
        </Table>
      );
    }

    const { user } = render(<Harness initial="all" />);
    const ada = screen.getByRole("row", { name: "Ada" });
    await user.click(ada);
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(Array.from(onSelectionChange.mock.calls[0]?.[0] as Set<string>)).toEqual(["a"]);

    // Clicking already-selected row with disallowEmptySelection should not fire bogus onSelectionChange
    await user.click(ada);
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
  });

  it("ignores clicks and Space/Enter from nested interactive elements in cells", async () => {
    const onSelectionChange = vi.fn();
    const onDelete = vi.fn();
    const { user } = render(
      <Table selectionMode="multiple" onSelectionChange={onSelectionChange}>
        <Table.Content aria-label="Actions">
          <Table.Header>
            <Table.Column rowHeader>Name</Table.Column>
            <Table.Column>Action</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row id="1">
              <Table.Cell>Ada</Table.Cell>
              <Table.Cell>
                <Button onClick={onDelete}>Delete</Button>
                <input aria-label="Note" />
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table>,
    );

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onSelectionChange).not.toHaveBeenCalled();

    const input = screen.getByLabelText("Note");
    await user.type(input, "hi there");
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("applies stickyHeader class on thead only when stickyHeader is true, clamps columnMax, and flips RTL sort arrows", async () => {
    const originalStyle = window.getComputedStyle.bind(window);
    vi.spyOn(window, "getComputedStyle").mockImplementation((el) => {
      const style = originalStyle(el);
      if (!(el instanceof HTMLElement) || !el.closest("[dir='rtl']")) return style;
      return new Proxy(style, {
        get(target, prop, receiver) {
          if (prop === "direction") return "rtl";
          const value = Reflect.get(target, prop, receiver);
          return typeof value === "function" ? value.bind(target) : value;
        },
      });
    });

    const { rerender, container, user } = render(
      <div dir="rtl">
        <Table columnResize>
          <Table.Content aria-label="RTL">
            <Table.Header>
              <Table.Column id="a" sortable>Alpha</Table.Column>
              <Table.Column id="b" sortable>Beta</Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row id="1"><Table.Cell>1</Table.Cell><Table.Cell>2</Table.Cell></Table.Row>
            </Table.Body>
          </Table.Content>
        </Table>
      </div>,
    );

    const thead = container.querySelector("thead")!;
    expect(thead.className).not.toContain("z-sticky");

    const alphaBtn = screen.getByRole("button", { name: "Alpha" });
    const betaBtn = screen.getByRole("button", { name: "Beta" });
    alphaBtn.focus();
    await user.keyboard("{ArrowLeft}");
    expect(betaBtn).toHaveFocus();

    rerender(
      <div dir="rtl">
        <Table stickyHeader columnResize>
          <Table.Content aria-label="RTL">
            <Table.Header>
              <Table.Column id="a" sortable>Alpha</Table.Column>
              <Table.Column id="b" sortable>Beta</Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row id="1"><Table.Cell>1</Table.Cell><Table.Cell>2</Table.Cell></Table.Row>
            </Table.Body>
          </Table.Content>
        </Table>
      </div>,
    );
    expect(container.querySelector("thead")!.className).toContain("z-sticky");
    expect(alphaBtn.querySelector("span")?.className).toContain("overflow-hidden");
    vi.restoreAllMocks();
  });

  it("virtualized body renders empty state, uses >=100 colSpan spacers, skips disabled rows on ArrowDown, and preserves user scrollTop", async () => {
    const empty = render(
      <Table>
        <Table.ScrollContainer className="overflow-y-auto" style={{ maxHeight: 160 }}>
          <Table.Content aria-label="Empty virtual">
            <Table.Header>
              <Table.Column rowHeader>Name</Table.Column>
            </Table.Header>
            <Table.Body
              virtualized
              items={[]}
              renderEmptyState={() => <span>Nothing here</span>}
            >
              {(row: { id: string; name: string }) => (
                <Table.Row id={row.id}><Table.Cell>{row.name}</Table.Cell></Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>,
    );
    expect(empty.getByText("Nothing here")).toBeInTheDocument();
    empty.unmount();

    const items = Array.from({ length: 30 }, (_, idx) => ({
      id: String(idx + 1),
      name: `Item ${idx + 1}`,
    }));
    const { container, user, rerender } = render(
      <Table selectionMode="single" disabledKeys={["2"]}>
        <Table.ScrollContainer className="overflow-y-auto" style={{ maxHeight: 160 }}>
          <Table.Content aria-label="Virtual list">
            <Table.Header>
              <Table.Column rowHeader>Name</Table.Column>
            </Table.Header>
            <Table.Body virtualized virtualItemSize={40} items={items}>
              {(row) => (
                <Table.Row id={row.id}><Table.Cell>{row.name}</Table.Cell></Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>,
    );

    const spacerTd = container.querySelector("tbody tr[aria-hidden='true'] td");
    expect(Number(spacerTd?.getAttribute("colspan"))).toBeGreaterThanOrEqual(100);

    const row1 = screen.getByRole("row", { name: "Item 1" });
    row1.focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("row", { name: "Item 3" })).toHaveFocus();

    const scrollContainer = container.querySelector(".overflow-y-auto") as HTMLElement;
    Object.defineProperty(scrollContainer, "clientHeight", { configurable: true, value: 160 });
    scrollContainer.scrollTop = 240;
    fireEvent.scroll(scrollContainer);
    rerender(
      <Table selectionMode="single" disabledKeys={["2", "4"]}>
        <Table.ScrollContainer className="overflow-y-auto" style={{ maxHeight: 160 }}>
          <Table.Content aria-label="Virtual list">
            <Table.Header>
              <Table.Column rowHeader>Name</Table.Column>
            </Table.Header>
            <Table.Body virtualized virtualItemSize={40} items={items}>
              {(row) => (
                <Table.Row id={row.id}><Table.Cell>{row.name}</Table.Cell></Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>,
    );
    expect(scrollContainer.scrollTop).toBe(240);
  });

  it("does not set overscroll-none on Table.ScrollContainer so page scroll chains naturally", () => {
    const { container } = render(
      <Table>
        <Table.ScrollContainer data-testid="table-scroll">
          <Table.Content aria-label="Scrollable page check">
            <Table.Header>
              <Table.Column rowHeader>Name</Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row id="1"><Table.Cell>Ada</Table.Cell></Table.Row>
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>,
    );

    const scrollEl = container.querySelector("[data-testid='table-scroll']") as HTMLElement;
    expect(scrollEl.className).not.toContain("overscroll-none");
    expect(scrollEl.className).not.toContain("overscroll-y-none");
  });
});
