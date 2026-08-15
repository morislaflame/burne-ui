import gsap from "gsap";

import { Form } from "@/components/composite/Form";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

const TL = { overwrite: "auto" as const, force3D: false };

export function FormMotionErrorChangeDemo() {
  return (
    <Form
      aria-label="Validate"
      onSubmit={() => {}}
      rules={{ email: { required: "Email is required" } }}
      motion={{
        root: {
          change: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { x: -3, duration: 0.08 }, 0);
            tl.to(ctx.el, { x: 0, duration: 0.12 }, 0.08);
            return tl;
          },
        },
        errorSummary: {
          enter: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.fromTo(ctx.el, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.24 }, 0);
            tweenCssColor(ctx.el, "var(--color-danger)");
            return tl;
          },
        },
      }}
    >
      <Form.Header>
        <Form.Title>Submit empty</Form.Title>
      </Form.Header>
      <Form.Field name="email">
        <Input>
          <Input.Label>Email</Input.Label>
          <Input.Control />
        </Input>
      </Form.Field>
      <Form.Actions>
        <Button type="submit">Validate</Button>
      </Form.Actions>
    </Form>
  );
}
