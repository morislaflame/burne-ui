import { Form } from "@/components/composite/Form";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";

export function FormMotionInstantEnterDemo() {
  return (
    <Form aria-label="Skip enter" motion={{ root: { enter: false } }} onSubmit={() => {}}>
      <Form.Header>
        <Form.Title>Skip enter</Form.Title>
      </Form.Header>
      <Form.Field name="name">
        <Input>
          <Input.Label>Name</Input.Label>
          <Input.Control />
        </Input>
      </Form.Field>
      <Form.Actions>
        <Button type="submit">Save</Button>
      </Form.Actions>
    </Form>
  );
}
