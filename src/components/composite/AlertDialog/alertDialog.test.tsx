import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { render } from "@/__tests__/helpers";

import { AlertDialog, type AlertDialogOverlayProps } from ".";

describe("AlertDialog Phase 2C alignment", () => {
  it("wires AlertDialog.Overlay dismiss props and className, and exports AlertDialogOverlayProps", async () => {
    const onInteractOutside = vi.fn();
    const overlayProps: AlertDialogOverlayProps = {
      closeOnInteractOutside: true,
      onInteractOutside,
      className: "custom-alert-overlay",
    };

    const { user } = render(
      <AlertDialog defaultOpen>
        <AlertDialog.Panel>
          <AlertDialog.Overlay {...overlayProps} />
          <AlertDialog.Header>
            <AlertDialog.HeadingBlock>
              <AlertDialog.Title>Discard draft?</AlertDialog.Title>
            </AlertDialog.HeadingBlock>
          </AlertDialog.Header>
        </AlertDialog.Panel>
      </AlertDialog>,
    );

    const dialog = await screen.findByRole("alertdialog", { name: "Discard draft?" });
    expect(dialog.className).toContain("overflow-hidden");

    const overlay = dialog.querySelector("[aria-hidden]") as HTMLElement;
    expect(overlay.className).toContain("touch-none");
    expect(overlay.className).toContain("custom-alert-overlay");

    await user.click(overlay);
    expect(onInteractOutside).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
  });

  it("propagates variant from Panel to Header/Indicator and renders Body without an extra wrapper div", async () => {
    render(
      <AlertDialog defaultOpen>
        <AlertDialog.Panel variant="outline">
          <AlertDialog.Header>
            <AlertDialog.HeadingBlock data-testid="heading-block">
              <AlertDialog.Title>Outline confirm</AlertDialog.Title>
            </AlertDialog.HeadingBlock>
          </AlertDialog.Header>
          <AlertDialog.Body data-testid="alert-body">
            <span data-testid="direct-child">Details</span>
          </AlertDialog.Body>
        </AlertDialog.Panel>
      </AlertDialog>,
    );

    const dialog = await screen.findByRole("alertdialog", { name: "Outline confirm" });
    const panel = dialog.querySelector("[data-variant]") as HTMLElement;
    expect(panel).toHaveAttribute("data-variant", "outline");

    // variant="outline" renders the default question indicator inside Header
    expect(dialog.querySelector("svg")).toBeTruthy();

    // HeadingBlock stays display: contents
    expect(screen.getByTestId("heading-block").className).toContain("contents");

    // Body renders children directly without an intermediate Text wrapper div
    const body = screen.getByTestId("alert-body");
    const child = screen.getByTestId("direct-child");
    expect(child.parentElement).toBe(body);
  });
});
