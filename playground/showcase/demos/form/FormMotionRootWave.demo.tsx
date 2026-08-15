import gsap from "gsap";

import { Form } from "@/components/composite/Form";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";

const TL = { overwrite: "auto" as const, force3D: false };

export function FormMotionRootWaveDemo() {
  return (
    <Form
      aria-label="Wave"
      onSubmit={() => {}}
      motion={{
        root: {
          enter: (ctx) =>
            gsap.fromTo(ctx.el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.32, ...TL }),
        },
        title: {
          enter: (ctx) => gsap.fromTo(ctx.el, { x: -8 }, { x: 0, duration: 0.24, ...TL }),
        },
      }}
    >
      <Form.Header>
        <Form.Title>Wave</Form.Title>
      </Form.Header>
      <Form.Field name="title">
        <Input>
          <Input.Label>Title</Input.Label>
          <Input.Control />
        </Input>
      </Form.Field>
      <Form.Actions>
        <Button type="submit">Save</Button>
      </Form.Actions>
    </Form>
  );
}
