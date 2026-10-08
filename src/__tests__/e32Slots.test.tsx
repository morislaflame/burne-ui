import { createRef } from "react";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Avatar } from "@/components/core/Avatar";
import { SelectionIndicator } from "@/components/core/SelectionIndicator";
import { SelectionThumb } from "@/components/core/SelectionThumb";
import { Table } from "@/components/core/Table";

import { render } from "./helpers";

describe("Э3.2 className slots", () => {
  it("keeps Avatar className on the circle", () => {
    const { container } = render(
      <Avatar
        variant="default"
        label="Ada"
        className="user-root"
        classNames={{
          root: "slot-root",
        }}
      />);

    const circle = container.querySelector(".user-root");
    expect(circle).toBeTruthy();
    expect(circle?.className).toContain("slot-root");
  });

  it("puts columnButton only on a sortable header", () => {
    render(
      <Table classNames={{ columnInner: "shared-inner", columnButton: "only-button" }}>
        <Table.Content>
          <Table.Header>
            <Table.Column allowsSorting>Name</Table.Column>
            <Table.Column>Role</Table.Column>
          </Table.Header>
        </Table.Content>
      </Table>);

    const name = screen.getByRole("columnheader", { name: "Name" });
    const role = screen.getByRole("columnheader", { name: "Role" });
    expect(name.querySelector("button")?.className).toContain("sort-btn");
    expect(name.querySelector("button")?.className).toContain("shared-inner");
    expect(name.querySelector("button")?.className).toContain("only-button");
    expect(role.querySelector(".sort-btn")).toBeNull();
    expect(role.querySelector(".only-button")).toBeNull();
    expect(role.querySelector(".shared-inner")).toBeTruthy();
  });
});

describe("D3-16 selection refs", () => {
  it("forwards ref to the indicator, thumb, and thumb icon", () => {
    const indicatorRef = createRef<HTMLSpanElement>();
    const thumbRef = createRef<HTMLSpanElement>();
    const iconRef = createRef<HTMLSpanElement>();

    render(
      <>
        <SelectionIndicator ref={indicatorRef} selected />
        <SelectionThumb ref={thumbRef}>
          <SelectionThumb.Icon ref={iconRef} />
        </SelectionThumb>
      </>,
    );

    expect(indicatorRef.current?.tagName).toBe("SPAN");
    expect(indicatorRef.current?.getAttribute("data-selected")).toBe("true");
    expect(thumbRef.current?.tagName).toBe("SPAN");
    expect(iconRef.current?.tagName).toBe("SPAN");
    expect(thumbRef.current?.contains(iconRef.current)).toBe(true);
  });
});
