import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { render, selectValueButton } from "@/__tests__/helpers";

import { Select } from ".";

const OPTIONS = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

describe("Select multiple", () => {
  it("toggles values, keeps the menu open, and lists labels in option order", async () => {
    const { user } = render(
      <Select multiple label="Frameworks" options={OPTIONS} defaultValues={["vue"]} />,
    );
    const trigger = selectValueButton();
    expect(trigger).toHaveTextContent("Vue");

    trigger.focus();
    await user.keyboard("{ArrowDown}");
    const list = await screen.findByRole("listbox");
    expect(list).toHaveAttribute("aria-multiselectable", "true");

    await user.click(screen.getByRole("option", { name: "React" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(trigger).toHaveTextContent("React, Vue");
    expect(screen.getByRole("option", { name: "React" })).toHaveAttribute("aria-selected", "true");

    await user.click(screen.getByRole("option", { name: "Vue" }));
    expect(trigger).toHaveTextContent("React");
    expect(screen.getByRole("option", { name: "Vue" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("toggles the active option with Enter and stays open", async () => {
    const { user } = render(
      <Select multiple label="Frameworks" options={OPTIONS} defaultValues={["react"]} />,
    );
    const trigger = selectValueButton();
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    await screen.findByRole("listbox");
    await user.keyboard("{Enter}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(trigger).toHaveTextContent("Select a value");
  });

  it("commits a single value and closes the menu", async () => {
    const { user } = render(<Select label="Frameworks" options={OPTIONS} />);
    const trigger = selectValueButton();
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    await user.click(await screen.findByRole("option", { name: "Vue" }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger).toHaveTextContent("Vue");
  });
});

describe("Select virtualized", () => {
  const many = Array.from({ length: 80 }, (_, index) => ({
    value: String(index + 1),
    label: `Item ${index + 1}`,
  }));

  it("mounts a window and keeps the active option in the document", async () => {
    const { user } = render(<Select virtualized label="Item" options={many} defaultValue="1" />);
    const trigger = selectValueButton();
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    const list = await screen.findByRole("listbox");
    expect(list.querySelectorAll('[role="option"]').length).toBeLessThan(80);

    for (let step = 0; step < 25; step += 1) {
      await user.keyboard("{ArrowDown}");
    }

    const activeId = trigger.getAttribute("aria-activedescendant");
    expect(activeId).toBeTruthy();
    expect(document.getElementById(activeId!)).toBeTruthy();
    expect(screen.getByRole("option", { name: "Item 26" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Item 80" })).toBeNull();
  });
});
