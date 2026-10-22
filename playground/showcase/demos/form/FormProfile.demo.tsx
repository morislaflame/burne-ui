import { useCallback } from "react";

import { CheckboxGroup } from "@/components/composite/CheckboxGroup";
import { Form, type FormValues } from "@/components/composite/Form";
import { Button } from "@/components/core/Button";
import { Checkbox } from "@/components/core/Checkbox";
import { ComboBox, type ComboBoxItem } from "@/components/core/ComboBox";
import { Input } from "@/components/core/Input";
import { Select, type SelectItem } from "@/components/core/Select";
import { Label } from "@/components/core/Label";

const localeOptions: ComboBoxItem[] = [
  { value: "ru", label: "Russian", hint: "UI and emails in Russian" },
  { value: "en", label: "English", hint: "UI and emails in English" },
  { value: "de", label: "Deutsch", hint: "Oberfläche und E-Mails auf Deutsch" },
];

const timezoneOptions: SelectItem[] = [
  { value: "europe/moscow", label: "Europe/Moscow (UTC+3)" },
  { value: "europe/berlin", label: "Europe/Berlin (UTC+1)" },
  { value: "utc", label: "UTC" },
];

export function FormProfileDemo() {
  const onSubmit = useCallback((values: FormValues) => {
    void values;
  }, []);

  return (
    <Form
      onSubmit={onSubmit}
      aria-label="Profile settings"
      className="max-w-lg"
      defaultValues={{ locale: "ru", timezone: "europe/moscow" }}
      rules={{
        name: { required: "Enter your name" },
        email: {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Enter a valid email",
          },
        },
        username: {
          required: "Username is required",
          minLength: { value: 3, message: "At least 3 characters" },
          pattern: {
            value: /^[a-z0-9_]+$/,
            message: "Only lowercase letters, digits and underscore",
          },
        },
      }}
    >
      <Form.Header>
        <Form.Title>Profile</Form.Title>
        <Form.Description>Account details, preferences and notification channels.</Form.Description>
      </Form.Header>

      <Form.Section>
        <Form.Field name="name">
          <Input required name="name" label="Full name" placeholder="Ivan Petrov" autoComplete="name" />
        </Form.Field>
        <Form.Field name="username">
          <Input
            required
            name="username"
            label="Username"
            placeholder="ivan_petrov"
            autoComplete="username"
            hint="Lowercase letters, digits and underscore."
          />
        </Form.Field>
        <Form.Field name="email">
          <Input
            required
            name="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </Form.Field>
      </Form.Section>

      <Form.Section>
        <Form.Field name="locale">
          <ComboBox name="locale" items={localeOptions}>
            <ComboBox.Label>Interface language</ComboBox.Label>
            <ComboBox.Shell>
              <ComboBox.Input placeholder="Select language" />
              <ComboBox.Trigger />
            </ComboBox.Shell>
            <ComboBox.Popover />
            <ComboBox.Hint>Used for UI and transactional emails.</ComboBox.Hint>
          </ComboBox>
        </Form.Field>
        <Form.Field name="timezone">
          <Select name="timezone" items={timezoneOptions} label="Timezone" />
        </Form.Field>
        <Input name="avatar" label="Avatar" type="file" accept="image/*" placeholder="PNG or JPEG" />
      </Form.Section>

      <Form.Section>
        <CheckboxGroup selectionMode="multiple" defaultValues={["email"]}>
          <CheckboxGroup.Legend>
            <Label>Notifications</Label>
            <CheckboxGroup.Hint>Choose one or more channels.</CheckboxGroup.Hint>
          </CheckboxGroup.Legend>
          <CheckboxGroup.List>
            <Checkbox name="channels" value="email" label="Email digest" />
            <Checkbox name="channels" value="push" label="In-app push" />
            <Checkbox name="channels" value="sms" label="SMS alerts" />
          </CheckboxGroup.List>
        </CheckboxGroup>
      </Form.Section>

      <Form.Actions>
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Save profile
        </Button>
      </Form.Actions>
    </Form>
  );
}
