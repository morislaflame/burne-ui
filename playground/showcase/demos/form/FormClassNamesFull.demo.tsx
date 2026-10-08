import { Form } from "@/components/composite/Form";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";

export function FormClassNamesFullDemo() {
  return (
    <Form
      aria-label="classNames customization"
      className="max-w-sm"
      classNames={{
        root: "rounded-large border border-primary/20 bg-tertiary/50 p-large",
        header: "gap-xsmall",
        title: "text-primary",
        description: "text-info",
        section: "gap-small",
        actions: "justify-start border-t border-token pt-large",
        field: "rounded-base bg-background/40 p-small",
        errorSummary: "not-sr-only mb-base rounded-base border border-danger/30 bg-danger/5 p-base text-danger",
        announce: "not-sr-only mt-small text-small text-info",
      }}
      rules={{ topic: { required: "Topic is required" } }}
      onSubmit={() => undefined}
    >
      <Form.Header>
        <Form.Title>classNames</Form.Title>
        <Form.Description>Slots include errorSummary and announce.</Form.Description>
      </Form.Header>
      <Form.Section>
        <Form.Field name="topic">
          <Input name="topic" label="Topic" />
        </Form.Field>
      </Form.Section>
      <Form.Actions>
        <Button type="submit">Submit</Button>
      </Form.Actions>
    </Form>
  );
}
