import { describe, expect, it } from "vitest";

import { Badge } from "@/components/core/Badge";
import { Button } from "@/components/core/Button";
import { Link } from "@/components/core/Link";
import { Tooltip } from "@/components/core/Tooltip";
import { cn } from "@/utils/cn";

import { render } from "./helpers";

function wrapClass(node: Element | null | undefined) {
  return node?.parentElement?.className ?? "";
}

describe("D3-19 icon slot size", () => {
  it("keeps one icon-slot size in cn", () => {
    expect(cn("icon-slot icon-slot-base", "icon-slot-large")).toBe(
      "icon-slot icon-slot-large",
    );
  });

  it("replaces the Button icon size from the slot", () => {
    const { container } = render(
      <Button icon={<svg data-testid="ico" />} classNames={{ icon: "icon-slot-large" }}>
        Save
      </Button>,
    );
    const className = wrapClass(container.querySelector("[data-testid=ico]"));
    expect(className).toContain("icon-slot");
    expect(className).toContain("icon-slot-large");
    expect(className).not.toContain("icon-slot-base");
    expect(className).not.toContain("[&_svg]:icon");
  });

  it("replaces the Badge icon size from the slot", () => {
    const { container } = render(
      <Badge icon={<svg data-testid="badge-ico" />} classNames={{ icon: "icon-slot-large" }}>
        New
      </Badge>,
    );
    const className = wrapClass(container.querySelector("[data-testid=badge-ico]"));
    expect(className).toContain("icon-slot-large");
    expect(className).not.toContain("icon-slot-small");
    expect(className).not.toContain("[&_svg]:icon");
  });

  it("replaces the Link end icon size from the slot", () => {
    const { container } = render(
      <Link href="#docs" showDefaultIcon classNames={{ iconEnd: "icon-slot-large" }}>
        Docs
      </Link>,
    );
    const className = wrapClass(container.querySelector("svg"));
    expect(className).toContain("icon-slot-large");
    expect(className).not.toContain("icon-slot-base");
    expect(className).not.toContain("[&_svg]:icon");
  });

  it("replaces the Tooltip icon size from the slot", () => {
    render(
      <Tooltip defaultOpen status="danger" classNames={{ icon: "icon-slot-large" }}>
        <Tooltip.Trigger>Hint</Tooltip.Trigger>
        <Tooltip.Content>Body</Tooltip.Content>
      </Tooltip>,
    );
    const svg = document.querySelector("[role=tooltip] svg, [data-side] svg");
    const className = wrapClass(svg);
    expect(className).toContain("icon-slot-large");
    expect(className).not.toContain("icon-slot-base");
    expect(className).not.toContain("[&_svg]:icon");
  });
});
