import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Form } from "@/components/composite/Form";
import { Checkbox } from "@/components/core/Checkbox";
import { Radio } from "@/components/core/Radio";
import { Switch } from "@/components/core/Switch";

import { render } from "./helpers";

describe("native inputRef", () => {
  it("points Checkbox at the input while root ref stays on the label", () => {
    const inputRef = createRef<HTMLInputElement>();
    const rootRef = createRef<HTMLLabelElement>();
    render(<Checkbox ref={rootRef} inputRef={inputRef} label="Agree" />);

    expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
    expect(inputRef.current?.type).toBe("checkbox");
    expect(rootRef.current?.tagName).toBe("LABEL");
    expect(rootRef.current).not.toBe(inputRef.current);
  });

  it("keeps the Checkbox inputRef when the field is bound to Form", () => {
    const inputRef = createRef<HTMLInputElement>();
    render(
      <Form>
        <Checkbox name="agree" label="Agree" inputRef={inputRef} />
      </Form>,
    );

    expect(inputRef.current?.type).toBe("checkbox");
    expect(inputRef.current?.name).toBe("agree");
  });

  it("points Radio at the input while root ref stays on the label", () => {
    const inputRef = createRef<HTMLInputElement>();
    const rootRef = createRef<HTMLLabelElement>();
    render(<Radio ref={rootRef} inputRef={inputRef} label="Card" value="card" />);

    expect(inputRef.current?.type).toBe("radio");
    expect(rootRef.current?.tagName).toBe("LABEL");
    expect(rootRef.current).not.toBe(inputRef.current);
  });

  it("points Switch inputRef at the switch and keeps Control ref on the visual control", () => {
    const inputRef = createRef<HTMLInputElement>();
    const rootRef = createRef<HTMLLabelElement>();
    const { unmount } = render(<Switch ref={rootRef} inputRef={inputRef} label="Alerts" />);

    expect(inputRef.current?.getAttribute("role")).toBe("switch");
    expect(rootRef.current?.tagName).toBe("LABEL");
    expect(rootRef.current).not.toBe(inputRef.current);
    unmount();

    const rootInputRef = createRef<HTMLInputElement>();
    const controlRef = createRef<HTMLElement>();
    render(
      <Switch inputRef={rootInputRef} label="Alerts">
        <Switch.Control ref={controlRef} />
        <Switch.Label>Alerts</Switch.Label>
      </Switch>,
    );

    expect(rootInputRef.current?.getAttribute("role")).toBe("switch");
    expect(controlRef.current?.tagName).toBe("LABEL");
    expect(controlRef.current).not.toBe(rootInputRef.current);
    expect(controlRef.current?.querySelector("input")).toBe(rootInputRef.current);
  });
});
