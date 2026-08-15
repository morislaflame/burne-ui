import { expect, screen, waitFor } from "storybook/test";

type Canvas = {
  getByRole: (
    role: string,
    options?: { name?: string | RegExp },
  ) => HTMLElement;
};

type UserEvent = {
  click: (element: Element) => Promise<void>;
  hover: (element: Element) => Promise<void>;
  unhover: (element: Element) => Promise<void>;
  keyboard: (text: string) => Promise<void>;
  tab: () => Promise<void>;
};

/** Open a modal/drawer from a button, then close it and wait for portal unmount. */
export async function playOpenCloseUnmounts(options: {
  canvas: Canvas;
  userEvent: UserEvent;
  openName: string;
  closeName: string;
  dialogName: string;
}): Promise<void> {
  const { canvas, userEvent, openName, closeName, dialogName } = options;
  await userEvent.click(canvas.getByRole("button", { name: openName }));
  await expect(
    await screen.findByRole("dialog", { name: dialogName }),
  ).toBeVisible();
  await userEvent.click(screen.getByRole("button", { name: closeName }));
  await waitFor(() => {
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
}

/**
 * Keyboard-open a `*.Trigger` host. Asserts focus moved into the panel and
 * the active element matches `:focus-visible` (kit ring contract).
 */
export async function playKeyboardOpensDialog(options: {
  canvas: Canvas;
  userEvent: UserEvent;
  triggerName: string;
  dialogName: string;
}): Promise<void> {
  const { canvas, userEvent, triggerName, dialogName } = options;
  await userEvent.tab();
  const trigger = canvas.getByRole("button", { name: triggerName });
  await expect(trigger).toHaveFocus();
  await userEvent.keyboard("{Enter}");
  const dialog = await screen.findByRole("dialog", { name: dialogName });
  await expect(dialog).toBeVisible();
  await waitFor(() => {
    const active = document.activeElement;
    expect(active != null && dialog.contains(active)).toBe(true);
  });
  expect(document.activeElement?.matches(":focus-visible")).toBe(true);
}
