import type { ComponentType } from "react";
import { useCallback, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { IoSearchOutline } from "react-icons/io5";

import { Checkbox } from "@/components/core/Checkbox";
import { Button } from "@/components/core/Button/Button";
import { Input } from "@/components/core/Input";
import type { ComboBoxOption } from "@/components/core/ComboBox";
import { ComboBox } from "@/components/core/ComboBox";
import { CheckboxGroup } from "@/components/composite/CheckboxGroup";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";
import type { FormValues } from "./formTypes";
import { Form } from "./index";

const localeOptions: ComboBoxOption[] = [
  { value: "ru", label: "Russian", hint: "UI and emails in Russian" },
  { value: "en", label: "English", hint: "UI and emails in English" },
  { value: "de", label: "Deutsch", hint: "Oberfläche und E-Mails auf Deutsch" },
];

const countryOptions: ComboBoxOption[] = [
  { value: "ru", label: "Russia" },
  { value: "kz", label: "Kazakhstan" },
  { value: "by", label: "Belarus" },
];

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-xl">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Composite Components/Form",
  component: Form,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [...darkThemeDecorator],
} satisfies Meta<typeof Form>;

export default meta;

type Story = StoryObj<typeof meta>;

function ProfileForm() {
  const onSubmit = useCallback((values: FormValues) => {
    void values;
  }, []);

  return (
    <Form
      onSubmit={onSubmit}
      aria-label="Sample form"
      defaultValues={{ locale: "ru" }}
      rules={{
        name: { required: "Enter a name" },
        email: {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Enter a valid email",
          },
        },
        password: {
          required: "Password is required",
          minLength: { value: 8, message: "At least 8 characters" },
        },
      }}
    >
      <Form.Title>Profile</Form.Title>
      <Form.Description>Account details and notifications.</Form.Description>
      <Form.Section>
        <Form.Field name="locale">
          <ComboBox name="locale" options={localeOptions}>
            <ComboBox.Label>Interface language</ComboBox.Label>
            <ComboBox.InputGroup>
              <ComboBox.Input placeholder="Select language" />
              <ComboBox.Trigger />
            </ComboBox.InputGroup>
            <ComboBox.Popover />
            <ComboBox.Hint>Description is visible in the list; the field shows only the name.</ComboBox.Hint>
          </ComboBox>
        </Form.Field>
        <Form.Field name="name">
          <Input isRequired name="name" label="Name" placeholder="Ivan" autoComplete="name" />
        </Form.Field>
        <Form.Field name="email">
          <Input
            isRequired
            name="email"
            label="Email"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </Form.Field>
        <Form.Field name="password">
          <Input
            isRequired
            name="password"
            label="Password"
            inputType="password"
            autoComplete="new-password"
            hint="At least 8 characters."
          />
        </Form.Field>
        <Input name="avatar" label="Avatar" inputType="file" accept="image/*" placeholder="PNG or JPEG" />
      </Form.Section>
      <Form.Section>
        <CheckboxGroup selection="single" isRequired>
          <CheckboxGroup.Legend>
            <CheckboxGroup.Label>Notifications</CheckboxGroup.Label>
            <CheckboxGroup.Hint>
              Single channel: selecting another clears the previous one.
            </CheckboxGroup.Hint>
          </CheckboxGroup.Legend>
          <CheckboxGroup.List>
            <Checkbox name="channels" value="email" label="Email" />
            <Checkbox name="channels" value="push" label="In-app push" />
          </CheckboxGroup.List>
        </CheckboxGroup>
      </Form.Section>
      <Form.Actions>
        <Button type="button" variant="outline" size="base">
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="base">
          Save
        </Button>
      </Form.Actions>
    </Form>
  );
}

export const Default: Story = {
  render: () => <ProfileForm />,
};

export const SubmitInteraction: Story = {
  name: "Interaction: submit",
  render: () => <ProfileForm />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByPlaceholderText("Ivan"), "Ivan");
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await expect(canvas.getByPlaceholderText("Ivan")).toHaveValue("Ivan");
  },
};

function ValidationForm() {
  const onSubmit = useCallback((values: FormValues) => {
    void values;
  }, []);

  return (
    <Form
      onSubmit={onSubmit}
      validateMode="onBlur"
      aria-label="Form with validation errors"
      rules={{
        email: {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Enter a valid address.",
          },
        },
        consent: { required: "You must accept the terms." },
        locale: { required: "Select a language from the list." },
      }}
    >
      <Form.Title>Contact</Form.Title>
      <Form.Section>
        <Form.Field name="email">
          <Input
            isRequired
            name="email"
            label="Email"
            autoComplete="email"
            placeholder="you@example.com"
            hint="Format: name@domain.tld"
          />
        </Form.Field>
        <Form.Field name="locale">
          <ComboBox name="locale" isRequired options={localeOptions}>
            <ComboBox.Label>Interface language</ComboBox.Label>
            <ComboBox.InputGroup>
              <ComboBox.Input placeholder="Select language" />
              <ComboBox.Trigger />
            </ComboBox.InputGroup>
            <ComboBox.Popover />
            <ComboBox.Error />
          </ComboBox>
        </Form.Field>
      </Form.Section>
      <Form.Section>
        <Form.Field name="consent">
          <Checkbox name="consent" label="Consent to data processing" />
        </Form.Field>
      </Form.Section>
      <Form.Actions>
        <Button type="submit" variant="primary" size="base">
          Submit
        </Button>
      </Form.Actions>
    </Form>
  );
}

export const Validation: Story = {
  name: "Validation onBlur",
  render: () => <ValidationForm />,
};

function LoginForm() {
  return (
    <Surface variant="secondary" padding="mid" className="w-full max-w-sm">
      <Form
        aria-label="Sign in"
        size="mid"
        rules={{
          login: { required: "Enter email" },
          password: { required: "Enter password" },
        }}
        onSubmit={(values) => {
          void values;
        }}
      >
        <Form.Title>Sign in</Form.Title>
        <Form.Section>
          <Form.Field name="login">
            <Input isRequired name="login" label="Email" autoComplete="email" />
          </Form.Field>
          <Form.Field name="password">
            <Input
              isRequired
              name="password"
              label="Password"
              inputType="password"
              autoComplete="current-password"
            />
          </Form.Field>
        </Form.Section>
        <Form.Actions>
          <Button type="submit" variant="primary" className="w-full">
            Sign in
          </Button>
        </Form.Actions>
      </Form>
    </Surface>
  );
}

export const Login: Story = {
  name: "Login (compact)",
  render: () => <LoginForm />,
};

function ControlledForm() {
  const [values, setValues] = useState<FormValues>({ name: "Anna", email: "" });

  return (
    <div className="flex flex-col gap-mid">
      <Text as="p" variant="small" className="text-muted">
        Current values: {JSON.stringify(values)}
      </Text>
      <Form
        aria-label="Controlled form"
        values={values}
        onValuesChange={setValues}
        onSubmit={(next) => {
          void next;
        }}
      >
        <Form.Title>Controlled</Form.Title>
        <Form.Section>
          <Input name="name" label="Name" />
          <Input name="email" label="Email" placeholder="you@example.com" />
        </Form.Section>
        <Form.Actions>
          <Button type="submit">Save</Button>
        </Form.Actions>
      </Form>
    </div>
  );
}

export const Controlled: Story = {
  name: "Controlled values",
  render: () => <ControlledForm />,
};

function ValidateOnChangeForm() {
  return (
    <Form
      aria-label="Validation on input"
      validateMode="onChange"
      defaultValues={{ promo: "" }}
      rules={{
        promo: {
          minLength: { value: 4, message: "Code must be at least 4 characters" },
          pattern: { value: /^[A-Z0-9]+$/, message: "Uppercase letters and digits only" },
        },
      }}
      onSubmit={(values) => {
        void values;
      }}
    >
      <Form.Title>Promo code</Form.Title>
      <Form.Description>Error appears while typing.</Form.Description>
      <Form.Section>
        <Form.Field name="promo">
          <Input name="promo" label="Code" placeholder="SALE2026" />
        </Form.Field>
      </Form.Section>
      <Form.Actions>
        <Button type="submit">Apply</Button>
      </Form.Actions>
    </Form>
  );
}

export const ValidateOnChange: Story = {
  name: "Validation onChange",
  render: () => <ValidateOnChangeForm />,
};

function AsyncSubmitForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="flex flex-col gap-mid">
      {submitted ? (
        <Text as="p" variant="small" className="text-success">
          Submitted (demo)
        </Text>
      ) : null}
      <Form
        aria-label="Async submit"
        rules={{ message: { required: "Enter a message" } }}
        onSubmit={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1200));
          setSubmitted(true);
        }}
      >
        <Form.Title>Feedback</Form.Title>
        <Form.Section>
          <Form.Field name="message">
            <Input name="message" label="Message" placeholder="Text…" />
          </Form.Field>
        </Form.Section>
        <Form.Actions>
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </Form.Actions>
      </Form>
    </div>
  );
}

export const AsyncSubmit: Story = {
  name: "Async submit",
  render: () => <AsyncSubmitForm />,
};

function SearchToolbarForm() {
  return (
    <Form
      aria-label="Search"
      className="flex w-full max-w-xl flex-row items-center gap-small rounded-mid border-token bg-tertiary p-xsmall"
      onSubmit={(values) => {
        void values;
      }}
    >
      <Form.Section className="min-w-0 flex-1">
        <Input name="q" label="Search" placeholder="Search…" className="[&_label]:sr-only" />
      </Form.Section>
      <Button type="submit" variant="primary" iconOnly aria-label="Search">
        <IoSearchOutline aria-hidden />
      </Button>
    </Form>
  );
}

export const SearchToolbar: Story = {
  name: "Horizontal search",
  render: () => <SearchToolbarForm />,
};

function BillingForm() {
  return (
    <Form
      aria-label="Payment"
      defaultValues={{ country: "ru" }}
      rules={{
        cardName: { required: "Enter name on card" },
        cardNumber: {
          required: "Card number is required",
          pattern: { value: /^\d{16}$/, message: "16 digits without spaces" },
        },
        country: { required: "Select a country" },
      }}
      onSubmit={(values) => {
        void values;
      }}
    >
      <Form.Title>Payment</Form.Title>
      <Form.Description>Card details and address.</Form.Description>
      <Form.Section>
        <Text as="h3" variant="mid" className="font-medium">
          Card
        </Text>
        <Form.Field name="cardName">
          <Input name="cardName" label="Name on card" autoComplete="cc-name" />
        </Form.Field>
        <Form.Field name="cardNumber">
          <Input name="cardNumber" label="Number" inputType="text" placeholder="0000000000000000" />
        </Form.Field>
      </Form.Section>
      <Form.Section>
        <Text as="h3" variant="mid" className="font-medium">
          Address
        </Text>
        <Form.Field name="country">
          <ComboBox name="country" options={countryOptions} isRequired>
            <ComboBox.Label>Country</ComboBox.Label>
            <ComboBox.InputGroup>
              <ComboBox.Input />
              <ComboBox.Trigger />
            </ComboBox.InputGroup>
            <ComboBox.Popover />
            <ComboBox.Error />
          </ComboBox>
        </Form.Field>
        <Input name="city" label="City" />
        <Input name="zip" label="ZIP code" />
      </Form.Section>
      <Form.Actions>
        <Button type="button" variant="outline">
          Back
        </Button>
        <Button type="submit" variant="primary">
          Pay
        </Button>
      </Form.Actions>
    </Form>
  );
}

export const Billing: Story = {
  name: "Multi-section (billing)",
  render: () => <BillingForm />,
};

function ReadOnlyForm() {
  return (
    <Form
      aria-label="Read only"
      readOnly
      defaultValues={{ name: "Ivan", role: "admin" }}
      onSubmit={(values) => {
        void values;
      }}
    >
      <Form.Title>Profile view</Form.Title>
      <Form.Description>readOnly mode — fields cannot be edited.</Form.Description>
      <Form.Section>
        <Input name="name" label="Name" readOnly />
        <Input name="role" label="Role" readOnly />
      </Form.Section>
    </Form>
  );
}

export const ReadOnly: Story = {
  name: "Read only",
  render: () => <ReadOnlyForm />,
};

function ClassNamesForm() {
  return (
    <Form
      aria-label="classNames customization"
      classNames={{
        root: "rounded-mid border border-primary/20 bg-tertiary/50 p-mid",
        title: "text-primary",
        description: "text-info",
        section: "gap-small",
        actions: "justify-start border-t border-token pt-mid",
        field: "rounded-base bg-background/40 p-small",
      }}
      onSubmit={(values) => {
        void values;
      }}
    >
      <Form.Title>classNames</Form.Title>
      <Form.Description>Slots root, section, field, actions.</Form.Description>
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

export const ClassNames: Story = {
  name: "classNames customization",
  render: () => <ClassNamesForm />,
};

function ResolverForm() {
  return (
    <Form
      aria-label="Form with resolver"
      defaultValues={{ login: "" }}
      resolver={async (values) => {
        const errors: Record<string, string> = {};
        if (typeof values.login !== "string" || values.login.length < 3) {
          errors.login = "Login must be at least 3 characters";
        }
        return Object.keys(errors).length > 0 ? { errors } : { values };
      }}
      onSubmit={(values) => {
        void values;
      }}
    >
      <Form.Title>Resolver</Form.Title>
      <Form.Field name="login">
        <Input name="login" label="Login" placeholder="user" />
      </Form.Field>
      <Form.Actions>
        <Button type="submit">Verify</Button>
      </Form.Actions>
    </Form>
  );
}

export const WithResolver: Story = {
  name: "With resolver",
  render: () => <ResolverForm />,
};

function CompoundLayoutForm() {
  return (
    <Form
      aria-label="Compound layout"
      rules={{ title: { required: "Title is required" } }}
      onSubmit={(values) => {
        void values;
      }}
    >
      <Form.Section>
        <Form.Field name="title">
          <Input name="title" label="Title" />
        </Form.Field>
      </Form.Section>
      <Form.Actions>
        <Button type="button" variant="outline">
          Draft
        </Button>
        <Button type="submit" variant="primary">
          Publish
        </Button>
      </Form.Actions>
      <Form.Description className="text-center text-small">
        Description and actions can be reordered with compound parts.
      </Form.Description>
    </Form>
  );
}

export const CompoundLayout: Story = {
  name: "Compound: part order",
  render: () => <CompoundLayoutForm />,
};

function InlineSubscribeForm() {
  return (
    <Form
      aria-label="Inline subscription"
      className="flex w-full max-w-lg flex-col gap-small sm:flex-row sm:items-end"
      rules={{
        email: {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Invalid email",
          },
        },
      }}
      onSubmit={(values) => {
        void values;
      }}
    >
      <Form.Section className="min-w-0 flex-1">
        <Form.Field name="email">
          <Input name="email" label="Email" placeholder="you@example.com" autoComplete="email" />
        </Form.Field>
      </Form.Section>
      <Button type="submit" variant="primary" className="w-full shrink-0 sm:w-auto">
        Subscribe
      </Button>
    </Form>
  );
}

export const InlineSubscribe: Story = {
  name: "Inline subscription",
  render: () => <InlineSubscribeForm />,
};
