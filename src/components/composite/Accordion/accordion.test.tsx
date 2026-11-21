import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { render } from "@/__tests__/helpers";

import { Accordion } from ".";

describe("Accordion fixes", () => {
  it("preserves user onClick on Enter key and blocks disabled asChild trigger", async () => {
    const onClick = vi.fn();
    const { user, rerender } = render(
      <Accordion>
        <Accordion.Item value="a">
          <Accordion.Heading>
            <Accordion.Trigger onClick={onClick}>First</Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>Body A</Accordion.Panel>
        </Accordion.Item>
      </Accordion>,
    );

    const trigger = screen.getByRole("button", { name: "First" });
    expect(trigger).toHaveAttribute("aria-controls");
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    const blocked = vi.fn();
    rerender(
      <Accordion>
        <Accordion.Item value="a" disabled>
          <Accordion.Heading>
            <Accordion.Trigger asChild onClick={blocked}>
              <a href="/secret">Blocked</a>
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>Body A</Accordion.Panel>
        </Accordion.Item>
      </Accordion>,
    );

    const link = screen.getByText("Blocked").closest("a")!;
    expect(link).not.toHaveAttribute("href");
    expect(link).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(link);
    expect(blocked).not.toHaveBeenCalled();
  });
});
