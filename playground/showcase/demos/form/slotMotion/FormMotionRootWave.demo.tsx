import { Form } from "@/components/composite/Form";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";

export function FormMotionRootWaveDemo() {
  return (
    <Form
      aria-label="Wave"
      onSubmit={() => {}}
      motion={{
        root: {
          enter: (ctx) =>
            ctx.fromTo({ opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.32 }),
        },
        title: {
          enter: (ctx) => ctx.fromTo({ x: -8 }, { x: 0, duration: 0.24 }),
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
