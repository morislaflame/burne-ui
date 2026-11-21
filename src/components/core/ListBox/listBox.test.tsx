import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { render, selectValueButton } from "@/__tests__/helpers";
import { ComboBox } from "@/components/core/ComboBox";
import { Select } from "@/components/core/Select";

import { ListBox } from ".";

describe("ListBox Phase 2C", () => {
  it("scrolls active option into view on keyboard navigation, NEVER on pointer hover", async () => {
    const scrollSpy = vi.fn();
    const origScroll = HTMLElement.prototype.scrollIntoView;
    HTMLElement.prototype.scrollIntoView = scrollSpy;

    try {
      const { user } = render(
        <ListBox aria-label="Cities">
          <ListBox.Item value="oslo" label="Oslo" />
          <ListBox.Item value="bergen" label="Bergen" />
          <ListBox.Item value="tromso" label="Tromso" />
        </ListBox>,
      );

      const list = screen.getByRole("listbox");
      list.focus();
      scrollSpy.mockClear();

      // Keyboard navigation MUST call scrollIntoView
      await user.keyboard("{ArrowDown}");
      expect(scrollSpy).toHaveBeenCalledWith({ block: "nearest" });

      scrollSpy.mockClear();
      // Pointer hover MUST NOT call scrollIntoView
      const tromso = screen.getByRole("option", { name: "Tromso" });
      fireEvent.pointerEnter(tromso);
      expect(tromso.classList.contains("listbox-option-active")).toBe(true);
      expect(scrollSpy).not.toHaveBeenCalled();
    } finally {
      HTMLElement.prototype.scrollIntoView = origScroll;
    }
  });

  it("supports disallowEmptySelection and preserves single selection on mouse click in Select & ComboBox", async () => {
    const onListChange = vi.fn();
    const { user, unmount } = render(
      <ListBox
        aria-label="Language"
        disallowEmptySelection
        defaultValue="en"
        onValueChange={onListChange}
      >
        <ListBox.Item value="en" label="English" />
        <ListBox.Item value="ru" label="Russian" />
      </ListBox>,
    );

    const enOpt = screen.getByRole("option", { name: "English" });
    expect(enOpt).toHaveAttribute("aria-selected", "true");
    await user.click(enOpt);
    expect(enOpt).toHaveAttribute("aria-selected", "true");
    expect(onListChange).not.toHaveBeenCalledWith(null);
    unmount();

    // Select: clicking the already-selected option keeps it selected and closes popover
    const onSelectChange = vi.fn();
    const selectView = render(
      <Select
        label="Framework"
        defaultValue="react"
        onValueChange={onSelectChange}
        items={[
          { value: "react", label: "React" },
          { value: "vue", label: "Vue" },
        ]}
      />,
    );
    const trigger = selectValueButton();
    trigger.focus();
    await selectView.user.keyboard("{ArrowDown}");
    await selectView.user.click(await screen.findByRole("option", { name: "React" }));
    expect(trigger).toHaveTextContent("React");
    expect(onSelectChange).not.toHaveBeenCalledWith(null);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    selectView.unmount();

    // ComboBox: clicking the already-selected option keeps it selected and closes popover
    const onComboChange = vi.fn();
    const comboView = render(
      <ComboBox
        label="City"
        defaultValue="oslo"
        onValueChange={onComboChange}
        items={[
          { value: "oslo", label: "Oslo" },
          { value: "bergen", label: "Bergen" },
        ]}
      />,
    );
    const input = screen.getByRole("combobox", { name: "City" });
    input.focus();
    await comboView.user.keyboard("{ArrowDown}");
    await comboView.user.click(await screen.findByRole("option", { name: "Oslo" }));
    expect(input).toHaveValue("Oslo");
    expect(onComboChange).not.toHaveBeenCalledWith(null);
  });

  it("re-applies active highlight when a virtualized ListBox scrolls away and back", async () => {
    const many = Array.from({ length: 60 }, (_, idx) => ({
      value: `v${idx + 1}`,
      label: `Row ${idx + 1}`,
    }));

    const { user } = render(
      <ListBox
        aria-label="Virtual rows"
        virtualized
        virtualItemSize={36}
        style={{ height: 144 }}
      >
        {many.map((row) => (
          <ListBox.Item key={row.value} value={row.value} label={row.label} />
        ))}
      </ListBox>,
    );

    const list = screen.getByRole("listbox");
    Object.defineProperty(list, "clientHeight", { configurable: true, value: 144 });
    fireEvent.scroll(list);

    act(() => {
      list.focus();
    });
    expect(screen.getByRole("option", { name: "Row 1" })).toHaveClass("listbox-option-active");

    // Scroll far down so Row 1 unmounts from the virtual window
    list.scrollTop = 1200;
    fireEvent.scroll(list);
    expect(screen.queryByRole("option", { name: "Row 1" })).toBeNull();

    // Scroll back to top so Row 1 re-enters the virtual window -> still highlighted!
    list.scrollTop = 0;
    fireEvent.scroll(list);
    expect(screen.getByRole("option", { name: "Row 1" })).toHaveClass("listbox-option-active");

    // Hovering an item in virtualized list does not jump scrollTop
    list.scrollTop = 18;
    fireEvent.scroll(list);
    const row2 = screen.getByRole("option", { name: "Row 2" });
    fireEvent.pointerEnter(row2);
    expect(list.scrollTop).toBe(18);
    expect(row2).toHaveClass("listbox-option-active");
    void user;
  });
});
