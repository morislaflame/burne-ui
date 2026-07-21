import type { ComponentType, ChangeEvent } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Button } from "@/components/core/Button";
import { Field } from "@/components/core/Field";
import { Input } from "@/components/core/Input";
import { Label } from "@/components/core/Label";
import { COMPONENT_SIZES } from "@/components/core/utils/componentSize";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Field",
  component: Field,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Form field primitives: **Field**, **Field.Label**, **Field.Hint**, **Field.Error**, **Field.Set** (+ **Field.Group**, **Field.Actions**). Used inside Input, ComboBox, Meter, etc.; you can also compose fields manually.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

export const RootWithHintAndError: Story = {
  name: "Root + Label + Hint + Error",
  render: () => (
    <Field className="max-w-sm">
      <Field.Label htmlFor="field-email">Email</Field.Label>
      <Input.Control id="field-email" placeholder="you@example.com" status="danger" />
      <Field.Hint>We do not share your address with third parties.</Field.Hint>
      <Field.Error>Enter a valid email.</Field.Error>
    </Field>
  ),
};

export const FieldSetGroup: Story = {
  name: "FieldSet + Group + Actions",
  render: () => (
    <Field.Set className="max-w-md">
      <Field.Legend>
        <Field.LegendHeader>
          <Label>Contact details</Label>
          <Field.Hint as="span">All fields are required</Field.Hint>
        </Field.LegendHeader>
      </Field.Legend>
      <Field.Group>
        <Input>
          <Input.Label>Phone</Input.Label>
          <Input.Control placeholder="+7 …" />
        </Input>
        <Input status="danger">
          <Input.Label>Email</Input.Label>
          <Input.Control defaultValue="bad@" />
          <Input.Error>Invalid address.</Input.Error>
        </Input>
        <Field.Error>Fix errors before continuing.</Field.Error>
      </Field.Group>
      <Field.Actions>
        <Button type="submit" size="base">
          Save
        </Button>
        <Button type="button" variant="ghost" size="base">
          Cancel
        </Button>
      </Field.Actions>
    </Field.Set>
  ),
};

function FieldSetSizeDemo({ size }: { size: (typeof COMPONENT_SIZES)[number] }) {
  return (
    <Field.Set size={size} className="max-w-md">
      <Field.Legend>
        <Field.LegendHeader>
          <Label>Contact details</Label>
          <Field.Hint as="span">size={size}</Field.Hint>
        </Field.LegendHeader>
      </Field.Legend>
      <Field.Group>
        <Input>
          <Input.Label>Phone</Input.Label>
          <Input.Control placeholder="+7 …" />
        </Input>
        <Input>
          <Input.Label>Email</Input.Label>
          <Input.Control placeholder="you@example.com" />
        </Input>
        <Field.Error>Example group error.</Field.Error>
      </Field.Group>
      <Field.Actions>
        <Button type="button" size="base">
          Save
        </Button>
        <Button type="button" variant="ghost" size="base">
          Cancel
        </Button>
      </Field.Actions>
    </Field.Set>
  );
}

export const FieldSetSizes: Story = {
  name: "FieldSet — sizes",
  render: () => (
    <div className="grid w-full max-w-5xl gap-xlarge md:grid-cols-2">
      {COMPONENT_SIZES.map((size) => (
        <div key={size} className="flex flex-col gap-base">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">{size}</span>
          <FieldSetSizeDemo size={size} />
        </div>
      ))}
    </div>
  ),
};

export const HintStatuses: Story = {
  name: "Hint — statuses",
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-mid">
      <Field>
        <Field.Label>Default</Field.Label>
        <Field.Hint>Neutral hint (muted).</Field.Hint>
      </Field>
      <Field>
        <Field.Label>Success</Field.Label>
        <Field.Hint status="success">Value saved.</Field.Hint>
      </Field>
      <Field>
        <Field.Label>Warning</Field.Label>
        <Field.Hint status="warning">Review data before submitting.</Field.Hint>
      </Field>
      <Field>
        <Field.Label>Error (Hint)</Field.Label>
        <Field.Hint status="danger">Hint with status=danger — for rare cases.</Field.Hint>
      </Field>
      <Field>
        <Field.Label>Error (Error)</Field.Label>
        <Field.Error>Field.Error — primary pattern for errors.</Field.Error>
      </Field>
    </div>
  ),
};

export const WithForm: Story = {
  name: "Inside Form",
  render: function WithFormStory() {
    const [email, setEmail] = useState("");
    const emailInvalid = email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    return (
      <form
        className="flex w-full max-w-sm flex-col gap-mid text-left"
        aria-label="Demo form"
        onSubmit={(e) => e.preventDefault()}
      >
        <Input label="Name" placeholder="Ivan" />
        <Input
          label="Email"
          placeholder="you@example.com"
          hint="Format: name@domain.tld"
          error={emailInvalid ? "Invalid address" : undefined}
          status={emailInvalid ? "danger" : "default"}
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <Button type="submit" size="base">
          Submit
        </Button>
      </form>
    );
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText("Name"), "Anna");
    await userEvent.click(canvas.getByRole("button", { name: "Submit" }));
    await expect(canvas.getByLabelText("Name")).toHaveValue("Anna");
  },
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story: "classNames customization for Field",
      },
    },
  },
  render: () => (
    <Field.Set
      className="max-w-md"
      classNames={{
        root: "max-w-md",
        legend: "text-primary",
        stack: "gap-xlarge",
        group: "gap-mid",
        actions: "pt-small",
      }}
    >
      <Field.Legend>
        <Field.LegendHeader>
          <Label>Contact details</Label>
          <Field.Hint as="span">Slots via classNames</Field.Hint>
        </Field.LegendHeader>
      </Field.Legend>
      <Field.Group>
        <Input>
          <Input.Label>Phone</Input.Label>
          <Input.Control placeholder="+7 …" />
        </Input>
      </Field.Group>
      <Field.Actions>
        <Button type="button" size="base">
          Save
        </Button>
      </Field.Actions>
    </Field.Set>
  ),
};
