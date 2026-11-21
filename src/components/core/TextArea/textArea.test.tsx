import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { render, setReducedMotion } from "@/__tests__/helpers";

import { TextArea } from "./index";

describe("TextArea", () => {
  it("falls back to scrollHeight auto-grow when CSS field-sizing: content is unsupported", async () => {
    const cssProto = Object.getPrototypeOf(window.CSS) as { supports: (prop: string, val: string) => boolean };
    const supportsSpy = vi.spyOn(cssProto, "supports").mockReturnValue(false);
    try {
      const { user, container } = render(<TextArea label="Notes" defaultValue="Line 1" />);
      const shell = container.querySelector<HTMLElement>('[data-slot="textarea-shell"]');
      const textarea = screen.getByRole("textbox", { name: "Notes" }) as HTMLTextAreaElement;

      Object.defineProperty(textarea, "scrollHeight", {
        configurable: true,
        get: () => 92,
      });

      await user.type(textarea, "\nLine 2");
      expect(supportsSpy).toHaveBeenCalledWith("field-sizing", "content");
      expect(shell?.style.height).toBe("");
      expect(textarea.style.height).toBe("92px");
    } finally {
      supportsSpy.mockRestore();
    }
  });

  it("does not run shell pressSqueeze on touch or direct textarea pointerdown", () => {
    setReducedMotion(false);
    const pressIn = vi.fn();
    const { container } = render(
      <TextArea label="Bio" motion={{ shell: { pressIn } }} />,
    );
    const shell = container.querySelector('[data-slot="textarea-shell"]')!;
    const textarea = screen.getByRole("textbox", { name: "Bio" });

    fireEvent.pointerDown(textarea, { pointerType: "touch", button: 0 });
    fireEvent.pointerDown(shell, { pointerType: "touch", button: 0 });
    fireEvent.pointerDown(textarea, { pointerType: "mouse", button: 0 });
    expect(pressIn).not.toHaveBeenCalled();
  });
});
