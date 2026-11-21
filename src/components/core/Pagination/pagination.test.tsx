import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { render } from "@/__tests__/helpers";

import { getPaginationRange } from "./paginationAPI";
import { Pagination } from ".";

describe("Pagination fixes", () => {
  it("never replaces a single page gap with an ellipsis and guards invalid numbers", () => {
    expect(getPaginationRange(4, 8, 1)).toEqual([1, 2, 3, 4, 5, "ellipsis", 8]);
    expect(getPaginationRange(5, 8, 1)).toEqual([1, "ellipsis", 4, 5, 6, 7, 8]);
    expect(getPaginationRange(5, 9, 1)).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 9]);
    expect(getPaginationRange(1, 0, 1)).toEqual([]);
    expect(getPaginationRange(1, -5, 1)).toEqual([]);
    expect(getPaginationRange(1, Number.NaN, 1)).toEqual([]);
    expect(getPaginationRange(1, Number.POSITIVE_INFINITY, 1)).toEqual([]);
    expect(getPaginationRange(-10, 5, 1)).toEqual([1, 2, 3, 4, 5]);
    expect(getPaginationRange(99, 5, 1)).toEqual([1, 2, 3, 4, 5]);
  });

  it("defaults uncontrolled defaultPage to 1 and guards Previous/Next when totalPages <= 0", () => {
    const onPageChange = vi.fn();
    const { rerender } = render(
      <Pagination totalPages={4} onPageChange={onPageChange}>
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.Previous />
          </Pagination.Item>
          <Pagination.Pages />
          <Pagination.Item>
            <Pagination.Next />
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>,
    );

    expect(screen.getByText("1")).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: /Previous|Back/i })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: /Next|Forward/i }));
    expect(onPageChange).toHaveBeenCalledWith(2);

    rerender(
      <Pagination totalPages={0} onPageChange={onPageChange}>
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.Previous />
          </Pagination.Item>
          <Pagination.Pages />
          <Pagination.Item>
            <Pagination.Next />
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>,
    );
    expect(screen.getByRole("button", { name: /Previous|Back/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Next|Forward/i })).toBeDisabled();
  });

  it("blocks <Pagination.Page href='...' disabled> and adds rtl:rotate-180 on chevrons", () => {
    const onClick = vi.fn();
    const { container } = render(
      <Pagination page={1} totalPages={5}>
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.Previous />
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Page page={2} href="/page/2" disabled onClick={onClick} />
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Next />
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>,
    );

    const disabledAnchor = screen.getByText("2").closest("a")!;
    expect(disabledAnchor).not.toHaveAttribute("href");
    expect(disabledAnchor).toHaveAttribute("aria-disabled", "true");
    expect(disabledAnchor).toHaveAttribute("data-disabled", "");
    expect(disabledAnchor).toHaveAttribute("tabindex", "-1");

    fireEvent.click(disabledAnchor);
    expect(onClick).not.toHaveBeenCalled();

    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBe(2);
    for (const svg of svgs) {
      expect(svg.getAttribute("class")).toContain("rtl:rotate-180");
    }
  });
});
