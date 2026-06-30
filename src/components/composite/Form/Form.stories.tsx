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
  { value: "ru", label: "Русский", hint: "Интерфейс и письма на русском" },
  { value: "en", label: "English", hint: "UI and emails in English" },
  { value: "de", label: "Deutsch", hint: "Oberfläche und E-Mails auf Deutsch" },
];

const countryOptions: ComboBoxOption[] = [
  { value: "ru", label: "Россия" },
  { value: "kz", label: "Казахстан" },
  { value: "by", label: "Беларусь" },
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
      aria-label="Пример формы"
      defaultValues={{ locale: "ru" }}
      rules={{
        name: { required: "Введите имя" },
        email: {
          required: "Email обязателен",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Укажите корректный email",
          },
        },
        password: {
          required: "Пароль обязателен",
          minLength: { value: 8, message: "Не менее 8 символов" },
        },
      }}
    >
      <Form.Title>Профиль</Form.Title>
      <Form.Description>Данные аккаунта и уведомления.</Form.Description>
      <Form.Section>
        <Form.Field name="locale">
          <ComboBox name="locale" options={localeOptions}>
            <ComboBox.Label>Язык интерфейса</ComboBox.Label>
            <ComboBox.InputGroup>
              <ComboBox.Input placeholder="Выберите язык" />
              <ComboBox.Trigger />
            </ComboBox.InputGroup>
            <ComboBox.Popover />
            <ComboBox.Hint>В списке видно описание; в поле — только название.</ComboBox.Hint>
          </ComboBox>
        </Form.Field>
        <Form.Field name="name">
          <Input isRequired name="name" label="Имя" placeholder="Иван" autoComplete="name" />
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
            label="Пароль"
            inputType="password"
            autoComplete="new-password"
            hint="Не менее 8 символов."
          />
        </Form.Field>
        <Input name="avatar" label="Аватар" inputType="file" accept="image/*" placeholder="PNG или JPEG" />
      </Form.Section>
      <Form.Section>
        <CheckboxGroup selection="single" isRequired>
          <CheckboxGroup.Legend>
            <CheckboxGroup.Label>Уведомления</CheckboxGroup.Label>
            <CheckboxGroup.Hint>
              Один канал: при выборе другого предыдущий снимается.
            </CheckboxGroup.Hint>
          </CheckboxGroup.Legend>
          <CheckboxGroup.List>
            <Checkbox name="channels" value="email" label="Email" />
            <Checkbox name="channels" value="push" label="Push в приложении" />
          </CheckboxGroup.List>
        </CheckboxGroup>
      </Form.Section>
      <Form.Actions>
        <Button type="button" variant="outline" size="base">
          Отмена
        </Button>
        <Button type="submit" variant="primary" size="base">
          Сохранить
        </Button>
      </Form.Actions>
    </Form>
  );
}

export const Default: Story = {
  render: () => <ProfileForm />,
};

export const SubmitInteraction: Story = {
  name: "Interaction: отправка",
  render: () => <ProfileForm />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByPlaceholderText("Иван"), "Иван");
    await userEvent.click(canvas.getByRole("button", { name: "Сохранить" }));
    await expect(canvas.getByPlaceholderText("Иван")).toHaveValue("Иван");
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
      aria-label="Форма с ошибками валидации"
      rules={{
        email: {
          required: "Email обязателен",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Укажите корректный адрес.",
          },
        },
        consent: { required: "Необходимо принять условия." },
        locale: { required: "Выберите язык из списка." },
      }}
    >
      <Form.Title>Контакт</Form.Title>
      <Form.Section>
        <Form.Field name="email">
          <Input
            isRequired
            name="email"
            label="Email"
            autoComplete="email"
            placeholder="you@example.com"
            hint="Формат: name@domain.tld"
          />
        </Form.Field>
        <Form.Field name="locale">
          <ComboBox name="locale" isRequired options={localeOptions}>
            <ComboBox.Label>Язык интерфейса</ComboBox.Label>
            <ComboBox.InputGroup>
              <ComboBox.Input placeholder="Выберите язык" />
              <ComboBox.Trigger />
            </ComboBox.InputGroup>
            <ComboBox.Popover />
            <ComboBox.Error />
          </ComboBox>
        </Form.Field>
      </Form.Section>
      <Form.Section>
        <Form.Field name="consent">
          <Checkbox name="consent" label="Согласие на обработку данных" />
        </Form.Field>
      </Form.Section>
      <Form.Actions>
        <Button type="submit" variant="primary" size="base">
          Отправить
        </Button>
      </Form.Actions>
    </Form>
  );
}

export const Validation: Story = {
  name: "Валидация onBlur",
  render: () => <ValidationForm />,
};

function LoginForm() {
  return (
    <Surface variant="secondary" padding="mid" className="w-full max-w-sm">
      <Form
        aria-label="Вход"
        size="mid"
        rules={{
          login: { required: "Укажите email" },
          password: { required: "Укажите пароль" },
        }}
        onSubmit={(values) => {
          void values;
        }}
      >
        <Form.Title>Вход</Form.Title>
        <Form.Section>
          <Form.Field name="login">
            <Input isRequired name="login" label="Email" autoComplete="email" />
          </Form.Field>
          <Form.Field name="password">
            <Input
              isRequired
              name="password"
              label="Пароль"
              inputType="password"
              autoComplete="current-password"
            />
          </Form.Field>
        </Form.Section>
        <Form.Actions>
          <Button type="submit" variant="primary" className="w-full">
            Войти
          </Button>
        </Form.Actions>
      </Form>
    </Surface>
  );
}

export const Login: Story = {
  name: "Логин (компактная)",
  render: () => <LoginForm />,
};

function ControlledForm() {
  const [values, setValues] = useState<FormValues>({ name: "Анна", email: "" });

  return (
    <div className="flex flex-col gap-mid">
      <Text as="p" variant="small" className="text-muted">
        Текущие значения: {JSON.stringify(values)}
      </Text>
      <Form
        aria-label="Контролируемая форма"
        values={values}
        onValuesChange={setValues}
        onSubmit={(next) => {
          void next;
        }}
      >
        <Form.Title>Контролируемая</Form.Title>
        <Form.Section>
          <Input name="name" label="Имя" />
          <Input name="email" label="Email" placeholder="you@example.com" />
        </Form.Section>
        <Form.Actions>
          <Button type="submit">Сохранить</Button>
        </Form.Actions>
      </Form>
    </div>
  );
}

export const Controlled: Story = {
  name: "Контролируемые values",
  render: () => <ControlledForm />,
};

function ValidateOnChangeForm() {
  return (
    <Form
      aria-label="Валидация при вводе"
      validateMode="onChange"
      defaultValues={{ promo: "" }}
      rules={{
        promo: {
          minLength: { value: 4, message: "Код не короче 4 символов" },
          pattern: { value: /^[A-Z0-9]+$/, message: "Только заглавные буквы и цифры" },
        },
      }}
      onSubmit={(values) => {
        void values;
      }}
    >
      <Form.Title>Промокод</Form.Title>
      <Form.Description>Ошибка появляется при вводе.</Form.Description>
      <Form.Section>
        <Form.Field name="promo">
          <Input name="promo" label="Код" placeholder="SALE2026" />
        </Form.Field>
      </Form.Section>
      <Form.Actions>
        <Button type="submit">Применить</Button>
      </Form.Actions>
    </Form>
  );
}

export const ValidateOnChange: Story = {
  name: "Валидация onChange",
  render: () => <ValidateOnChangeForm />,
};

function AsyncSubmitForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="flex flex-col gap-mid">
      {submitted ? (
        <Text as="p" variant="small" className="text-success">
          Отправлено (демо)
        </Text>
      ) : null}
      <Form
        aria-label="Асинхронная отправка"
        rules={{ message: { required: "Введите сообщение" } }}
        onSubmit={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1200));
          setSubmitted(true);
        }}
      >
        <Form.Title>Обратная связь</Form.Title>
        <Form.Section>
          <Form.Field name="message">
            <Input name="message" label="Сообщение" placeholder="Текст…" />
          </Form.Field>
        </Form.Section>
        <Form.Actions>
          <Button type="submit" variant="primary">
            Отправить
          </Button>
        </Form.Actions>
      </Form>
    </div>
  );
}

export const AsyncSubmit: Story = {
  name: "Асинхронный submit",
  render: () => <AsyncSubmitForm />,
};

function SearchToolbarForm() {
  return (
    <Form
      aria-label="Поиск"
      className="flex w-full max-w-xl flex-row items-center gap-small rounded-mid border-token bg-tertiary p-xsmall"
      onSubmit={(values) => {
        void values;
      }}
    >
      <Form.Section className="min-w-0 flex-1">
        <Input name="q" label="Поиск" placeholder="Найти…" className="[&_label]:sr-only" />
      </Form.Section>
      <Button type="submit" variant="primary" iconOnly aria-label="Искать">
        <IoSearchOutline aria-hidden />
      </Button>
    </Form>
  );
}

export const SearchToolbar: Story = {
  name: "Горизонтальный поиск",
  render: () => <SearchToolbarForm />,
};

function BillingForm() {
  return (
    <Form
      aria-label="Оплата"
      defaultValues={{ country: "ru" }}
      rules={{
        cardName: { required: "Укажите имя на карте" },
        cardNumber: {
          required: "Номер карты обязателен",
          pattern: { value: /^\d{16}$/, message: "16 цифр без пробелов" },
        },
        country: { required: "Выберите страну" },
      }}
      onSubmit={(values) => {
        void values;
      }}
    >
      <Form.Title>Оплата</Form.Title>
      <Form.Description>Данные карты и адрес.</Form.Description>
      <Form.Section>
        <Text as="h3" variant="mid" className="font-medium">
          Карта
        </Text>
        <Form.Field name="cardName">
          <Input name="cardName" label="Имя на карте" autoComplete="cc-name" />
        </Form.Field>
        <Form.Field name="cardNumber">
          <Input name="cardNumber" label="Номер" inputType="text" placeholder="0000000000000000" />
        </Form.Field>
      </Form.Section>
      <Form.Section>
        <Text as="h3" variant="mid" className="font-medium">
          Адрес
        </Text>
        <Form.Field name="country">
          <ComboBox name="country" options={countryOptions} isRequired>
            <ComboBox.Label>Страна</ComboBox.Label>
            <ComboBox.InputGroup>
              <ComboBox.Input />
              <ComboBox.Trigger />
            </ComboBox.InputGroup>
            <ComboBox.Popover />
            <ComboBox.Error />
          </ComboBox>
        </Form.Field>
        <Input name="city" label="Город" />
        <Input name="zip" label="Индекс" />
      </Form.Section>
      <Form.Actions>
        <Button type="button" variant="outline">
          Назад
        </Button>
        <Button type="submit" variant="primary">
          Оплатить
        </Button>
      </Form.Actions>
    </Form>
  );
}

export const Billing: Story = {
  name: "Многосекционная (оплата)",
  render: () => <BillingForm />,
};

function ReadOnlyForm() {
  return (
    <Form
      aria-label="Только чтение"
      readOnly
      defaultValues={{ name: "Иван", role: "admin" }}
      onSubmit={(values) => {
        void values;
      }}
    >
      <Form.Title>Просмотр профиля</Form.Title>
      <Form.Description>Режим readOnly — поля недоступны для редактирования.</Form.Description>
      <Form.Section>
        <Input name="name" label="Имя" readOnly />
        <Input name="role" label="Роль" readOnly />
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
      aria-label="Кастомизация classNames"
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
      <Form.Description>Слоты root, section, field, actions.</Form.Description>
      <Form.Section>
        <Form.Field name="topic">
          <Input name="topic" label="Тема" />
        </Form.Field>
      </Form.Section>
      <Form.Actions>
        <Button type="submit">Отправить</Button>
      </Form.Actions>
    </Form>
  );
}

export const ClassNames: Story = {
  name: "Кастомизация classNames",
  render: () => <ClassNamesForm />,
};

function ResolverForm() {
  return (
    <Form
      aria-label="Форма с resolver"
      defaultValues={{ login: "" }}
      resolver={async (values) => {
        const errors: Record<string, string> = {};
        if (typeof values.login !== "string" || values.login.length < 3) {
          errors.login = "Логин не короче 3 символов";
        }
        return Object.keys(errors).length > 0 ? { errors } : { values };
      }}
      onSubmit={(values) => {
        void values;
      }}
    >
      <Form.Title>Resolver</Form.Title>
      <Form.Field name="login">
        <Input name="login" label="Логин" placeholder="user" />
      </Form.Field>
      <Form.Actions>
        <Button type="submit">Проверить</Button>
      </Form.Actions>
    </Form>
  );
}

export const WithResolver: Story = {
  name: "С resolver",
  render: () => <ResolverForm />,
};

function CompoundLayoutForm() {
  return (
    <Form
      aria-label="Compound layout"
      rules={{ title: { required: "Заголовок обязателен" } }}
      onSubmit={(values) => {
        void values;
      }}
    >
      <Form.Section>
        <Form.Field name="title">
          <Input name="title" label="Заголовок" />
        </Form.Field>
      </Form.Section>
      <Form.Actions>
        <Button type="button" variant="outline">
          Черновик
        </Button>
        <Button type="submit" variant="primary">
          Опубликовать
        </Button>
      </Form.Actions>
      <Form.Description className="text-center text-small">
        Описание и действия можно переставлять compound-частями.
      </Form.Description>
    </Form>
  );
}

export const CompoundLayout: Story = {
  name: "Compound: порядок частей",
  render: () => <CompoundLayoutForm />,
};

function InlineSubscribeForm() {
  return (
    <Form
      aria-label="Подписка inline"
      className="flex w-full max-w-lg flex-col gap-small sm:flex-row sm:items-end"
      rules={{
        email: {
          required: "Email обязателен",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Некорректный email",
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
        Подписаться
      </Button>
    </Form>
  );
}

export const InlineSubscribe: Story = {
  name: "Inline подписка",
  render: () => <InlineSubscribeForm />,
};
