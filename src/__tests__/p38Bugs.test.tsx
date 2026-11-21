import { fireEvent, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Calendar } from "@/components/core/Calendar";
import { ComboBox } from "@/components/core/ComboBox";
import { Dropdown } from "@/components/core/Dropdown";
import { Resizable } from "@/components/core/Resizable";
import { Select } from "@/components/core/Select";
import { Table } from "@/components/core/Table";
import { Tabs } from "@/components/core/Tabs";
import { Toast, toast } from "@/components/core/Toast";
import { bindToastImperative } from "@/components/core/Toast/toastImperative";
import { Radio } from "@/components/core/Radio";
import { RadioGroup } from "@/components/composite/RadioGroup";

import { render, selectValueButton } from "./helpers";

const box = (width: number, height = 20) =>
  ({
    width,
    height,
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    bottom: height,
    right: width,
    toJSON() {
      return {};
    },
  }) as DOMRect;

describe("П38 bugs", () => {
  it("keeps one tab list when items and tabs are both passed", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <Tabs
        defaultValue="a"
        items={[{ value: "a", label: "From items", content: "Item panel" }]}
      >
        <Tabs.List>
          <Tabs.Tab value="a">From children</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Child panel</Tabs.Panel>
      </Tabs>,
    );
    expect(screen.getAllByRole("tablist")).toHaveLength(1);
    expect(screen.getByRole("tab", { name: "From children" })).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "From items" })).toBeNull();
    expect(screen.getByText("Child panel")).toBeInTheDocument();
    expect(screen.queryByText("Item panel")).toBeNull();
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });

  it("keeps one menu when items and a popover are both passed", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <Dropdown
        label="Menu"
        defaultOpen
        items={[{ value: "a", label: "From items" }]}
      >
        <Dropdown.Popover>
          <Dropdown.Item value="b">From children</Dropdown.Item>
        </Dropdown.Popover>
      </Dropdown>,
    );
    expect(screen.getAllByRole("menu")).toHaveLength(1);
    expect(screen.getByRole("menuitem", { name: "From children" })).toBeInTheDocument();
    expect(screen.queryByRole("menuitem", { name: "From items" })).toBeNull();
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });

  it("skips generated radios when children already include one", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <RadioGroup items={[{ value: "a", label: "From items" }]}>
        <Radio value="b" label="From children" />
      </RadioGroup>,
    );
    expect(screen.getByRole("radio", { name: "From children" })).toBeInTheDocument();
    expect(screen.queryByRole("radio", { name: "From items" })).toBeNull();
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });

  it("sizes panels from the track that is left after handles", () => {
    const original = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = function () {
      if (this.dataset.value) return box(100);
      return box(208);
    };
    HTMLElement.prototype.setPointerCapture = () => {};
    render(
      <Resizable>
        <Resizable.Panel defaultSize={50}>A</Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel defaultSize={50}>B</Resizable.Panel>
      </Resizable>,
    );
    const handle = screen.getByRole("separator", { name: "Resize panels" });
    expect(handle.className).toContain("touch-none");
    expect(handle).toHaveAttribute("aria-valuemin", "8");
    expect(handle).toHaveAttribute("aria-valuemax", "92");
    const panel = screen.getByText("A");
    expect(panel.style.flexBasis).toContain("calc(50 * (100% - var(--resizable-handles, 0)");
    expect(panel.parentElement?.style.getPropertyValue("--resizable-handles")).toBe("1");

    fireEvent.keyDown(handle, { key: "Home" });
    expect(handle).toHaveAttribute("aria-valuenow", "8");

    fireEvent.pointerDown(handle, { button: 0, pointerId: 1, clientX: 0 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 40 });
    const grown = handle.getAttribute("aria-valuenow");
    fireEvent.pointerCancel(handle, { pointerId: 1 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 200 });
    expect(handle.getAttribute("aria-valuenow")).toBe(grown);
    HTMLElement.prototype.getBoundingClientRect = original;
  });

  it("applies a custom filter when the list opens and ignores Enter while loading", async () => {
    const filtered = render(
      <ComboBox
        label="City"
        filter={(option) => option.value === "oslo"}
        items={[
          { value: "bergen", label: "Bergen" },
          { value: "oslo", label: "Oslo" },
        ]}
      />,
    );
    const city = filtered.getByRole("combobox", { name: "City" });
    city.focus();
    await filtered.user.keyboard("{ArrowDown}");
    expect(await filtered.findByRole("option", { name: "Oslo" })).toBeInTheDocument();
    expect(filtered.queryByRole("option", { name: "Bergen" })).toBeNull();
    expect(city.getAttribute("aria-activedescendant")).toContain("oslo");
    await filtered.user.keyboard("{Enter}");
    expect(city).toHaveValue("Oslo");

    const onValueChange = vi.fn();
    const loading = render(
      <ComboBox
        label="Port"
        loading
        defaultOpen
        allowsCustomValue
        defaultInputValue="bergen"
        onValueChange={onValueChange}
        items={[{ value: "oslo", label: "Oslo" }]}
      />,
    );
    expect(await loading.findByRole("status")).toHaveTextContent("Loading");
    loading.getByRole("combobox", { name: "Port" }).focus();
    await loading.user.keyboard("{Enter}");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(loading.getByRole("combobox", { name: "Port" })).toHaveValue("bergen");
  });

  it("commits a custom value on blur and keeps a clicked option", async () => {
    const blurred = render(
      <ComboBox
        label="City"
        allowsCustomValue
        items={[{ value: "oslo", label: "Oslo" }]}
      />,
    );
    await blurred.user.click(blurred.getByRole("combobox", { name: "City" }));
    await blurred.user.keyboard("bergen");
    await blurred.user.tab();
    expect(blurred.getByRole("combobox", { name: "City" })).toHaveValue("bergen");

    const picked = render(
      <ComboBox label="Town" items={[{ value: "oslo", label: "Oslo" }]} />,
    );
    await picked.user.click(picked.getByRole("combobox", { name: "Town" }));
    await picked.user.keyboard("os");
    await picked.user.click(picked.getByRole("option", { name: "Oslo" }));
    expect(picked.getByRole("combobox", { name: "Town" })).toHaveValue("Oslo");
  });

  it("returns focus to the select trigger after clear", async () => {
    const view = render(
      <Select
        clearable
        label="Snack"
        defaultValue="apple"
        items={[{ value: "apple", label: "Apple" }]}
      />,
    );
    selectValueButton().focus();
    await view.user.click(view.getByRole("button", { name: "Clear field" }));
    expect(selectValueButton()).toHaveFocus();
    expect(selectValueButton()).toHaveTextContent("Select a value");
  });

  it("keeps the outer toast provider after an inner one unmounts", async () => {
    function Harness() {
      const [inner, setInner] = useState(true);
      return (
        <Toast.Provider>
          <button type="button" onClick={() => toast.show({ title: "From outer" })}>
            show
          </button>
          {inner ? (
            <Toast.Provider>
              <button type="button" onClick={() => setInner(false)}>
                drop
              </button>
            </Toast.Provider>
          ) : null}
        </Toast.Provider>
      );
    }
    const view = render(<Harness />);
    await view.user.click(view.getByRole("button", { name: "drop" }));
    await view.user.click(view.getByRole("button", { name: "show" }));
    expect(await view.findByRole("group", { name: "From outer" })).toBeInTheDocument();
  });

  it("updates the toast that started a rejected promise with the label", async () => {
    const outer = {
      add: vi.fn(() => "outer"),
      update: vi.fn(),
      dismiss: vi.fn(),
      dismissAll: vi.fn(),
    };
    const inner = {
      add: vi.fn(() => "inner"),
      update: vi.fn(),
      dismiss: vi.fn(),
      dismissAll: vi.fn(),
    };
    const releaseOuter = bindToastImperative({
      api: outer,
      loading: "Loading",
      error: "An error occurred",
    });
    const releaseInner = bindToastImperative({
      api: inner,
      loading: "Loading",
      error: "An error occurred",
    });
    const pending = Promise.reject(new Error("fail"));
    toast.promise(pending, { success: "Saved" });
    releaseInner();
    await pending.catch(() => undefined);
    expect(inner.add).toHaveBeenCalledWith(expect.objectContaining({ title: "Loading" }));
    expect(inner.update).toHaveBeenCalledWith(
      "inner",
      expect.objectContaining({ title: "An error occurred", status: "danger" }),
    );
    expect(outer.update).not.toHaveBeenCalled();
    releaseOuter();

    const view = render(
      <Toast.Provider>
        <button
          type="button"
          onClick={() => toast.promise(Promise.reject(new Error("x")), { success: "Saved" })}
        >
          go
        </button>
      </Toast.Provider>,
    );
    await view.user.click(view.getByRole("button", { name: "go" }));
    expect(await view.findByRole("group", { name: "An error occurred" })).toBeInTheDocument();
  });

  it("rejects a range that crosses an unavailable day", async () => {
    const onValueChange = vi.fn();
    const view = render(
      <Calendar
        selectionMode="range"
        defaultMonth={new Date(2026, 0, 1)}
        isDateUnavailable={(date) => date.getDate() === 15}
        onValueChange={onValueChange}
      />,
    );
    await view.user.click(view.getByRole("button", { name: "10 January 2026" }));
    await view.user.click(view.getByRole("button", { name: "20 January 2026" }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    await view.user.click(view.getByRole("button", { name: "12 January 2026" }));
    expect(onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        start: expect.any(Date),
        end: expect.any(Date),
      }),
    );
    const range = onValueChange.mock.lastCall?.[0] as { start: Date; end: Date };
    expect(range.start.getDate()).toBe(10);
    expect(range.end.getDate()).toBe(12);
  });

  it("names a column resize handle and flips the arrow in RTL", async () => {
    const originalRect = HTMLElement.prototype.getBoundingClientRect;
    const originalStyle = window.getComputedStyle.bind(window);
    HTMLElement.prototype.getBoundingClientRect = function () {
      if (this.tagName === "TABLE") return box(320, 40);
      if (this.tagName === "TH") return box(100);
      return originalRect.call(this);
    };
    vi.spyOn(window, "getComputedStyle").mockImplementation((el) => {
      const style = originalStyle(el);
      if (!(el instanceof HTMLElement) || el.style.direction !== "rtl") return style;
      return new Proxy(style, {
        get(target, prop, receiver) {
          if (prop === "direction") return "rtl";
          const value = Reflect.get(target, prop, receiver);
          return typeof value === "function" ? value.bind(target) : value;
        },
      });
    });
    HTMLElement.prototype.setPointerCapture = () => {};
    const view = render(
      <Table columnResize aria-label="Files">
        <Table.Content>
          <Table.Header>
            <Table.Column id="name">Name</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row id="1">
              <Table.Cell>Notes</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table>,
    );
    const handle = view.getByRole("separator", { name: "Resize column Name" });
    expect(handle).toHaveAttribute("aria-valuemax", "320");
    const column = handle.parentElement as HTMLElement;
    handle.focus();
    await view.user.keyboard("{ArrowRight}");
    expect(column.style.width).toBe("108px");
    column.style.direction = "rtl";
    await view.user.keyboard("{ArrowRight}");
    expect(column.style.width).toBe("100px");

    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 0 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 20 });
    expect(column.style.width).toBe("80px");
    fireEvent.lostPointerCapture(handle, { pointerId: 1 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 80 });
    expect(column.style.width).toBe("80px");

    HTMLElement.prototype.getBoundingClientRect = originalRect;
    vi.restoreAllMocks();
  });
});
