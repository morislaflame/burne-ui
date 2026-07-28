import { Form, type FormSize } from "@/components/composite/Form";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";
import { Text } from "@/components/core/Text";

const SIZES: FormSize[] = ["small", "base", "mid", "large"];

export function FormSizesDemo() {
  return (
    <div className="grid w-full gap-2xlarge lg:grid-cols-2">
      {SIZES.map((size) => (
        <Form
          key={size}
          size={size}
          aria-label={`Profile form size ${size}`}
          className="rounded-mid border-token bg-tertiary/40 p-large"
          onSubmit={() => undefined}
        >
          <Form.Header>
            <Form.Title>size="{size}"</Form.Title>
            <Form.Description>
              Form chrome scales; fields stay at their own size (base).
            </Form.Description>
          </Form.Header>
          <Form.Section>
            <Form.Field name={`name-${size}`}>
              <Input name={`name-${size}`} label="Name" placeholder="Ivan" />
            </Form.Field>
            <Form.Field name={`email-${size}`}>
              <Input name={`email-${size}`} label="Email" placeholder="you@example.com" />
            </Form.Field>
          </Form.Section>
          <Form.Actions>
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </Form.Actions>
          <Text as="p" variant="xsmall" className="text-muted">
            Input / Button size is independent of Form size.
          </Text>
        </Form>
      ))}
    </div>
  );
}
