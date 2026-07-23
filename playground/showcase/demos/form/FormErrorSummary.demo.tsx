import { Form } from "@/components/composite/Form";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";

export function FormErrorSummaryDemo() {
  return (
    <Form
      aria-label="Form with custom error summary"
      validateMode="onSubmit"
      className="max-w-sm"
      classNames={{
        errorSummary:
          "not-sr-only mb-base rounded-base border border-danger/30 bg-danger/5 p-base text-danger",
      }}
      rules={{
        email: { required: "Email is required" },
        name: { required: "Name is required" },
      }}
      errorSummary={(entries) => (
        <ul className="list-disc ps-large">
          {entries.map(([field, message]) => (
            <li key={field}>
              <a href={`#${field}`} className="underline">
                {message}
              </a>
            </li>
          ))}
        </ul>
      )}
      onSubmit={() => undefined}
    >
      <Form.Title>Profile</Form.Title>
      <Form.Section>
        <Form.Field name="name">
          <Input required name="name" id="name" label="Name" />
        </Form.Field>
        <Form.Field name="email">
          <Input required name="email" id="email" label="Email" autoComplete="email" />
        </Form.Field>
      </Form.Section>
      <Form.Actions>
        <Button type="submit" variant="primary">
          Submit
        </Button>
      </Form.Actions>
    </Form>
  );
}
