import type { ComponentType, ReactNode } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/components/core/Button";

import { Toast, type ToastPlacement, type ToastStatus } from ".";
import { useToast } from "./useToast";

const decorator = [
  (Story: ComponentType) => (
    <Toast.Provider>
      <div
        className="box-border flex min-h-[16rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <Story />
      </div>
    </Toast.Provider>
  ),
] as const;

const meta = {
  title: "Core Components/Toast",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Уведомления-тосты. **Императивный API** через `useToast()`. Стек до 3 видимых; новые сверху (для `top-*`) или снизу (для `bottom-*`). Поддерживает промис-состояния, 5 статусов, 6 плейсментов, кастомный таймаут.",
      },
    },
  },
  decorators: [...decorator],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Statuses ─────────────────────────────────────────────────────────────────

const STATUSES: ToastStatus[] = ["default", "success", "danger", "info", "warning"];

const TOAST_VARIANT_ITEMS: Array<{
  status: ToastStatus;
  title: string;
  description?: string;
  action?: ReactNode;
  isLoading?: boolean;
}> = [
  {
    status: "default",
    title: "default",
    description: "Нейтральное уведомление без иконки статуса.",
  },
  {
    status: "success",
    title: "profile updated successfully",
  },
  {
    status: "danger",
    title: "unable to connect to server",
    description: "We're experiencing connection issues.",
  },
  {
    status: "info",
    title: "Справка",
    description: "Дополнительная информация в нейтрально-информационном тоне.",
  },
  {
    status: "warning",
    title: "Scheduled maintenance",
    description: "Services will be unavailable Sunday from 2:00 AM to 6:00 AM UTC.",
  },
  {
    status: "info",
    title: "Доступно обновление",
    description: "Версия 2.4.0 готова к установке.",
    action: (
      <Button size="small" variant="info">
        Обновить
      </Button>
    ),
  },
  {
    status: "default",
    title: "Сохранение…",
    description: "Дождитесь завершения операции.",
    isLoading: true,
  },
];

function ToastVariantsDemo() {
  return (
    <div className="mx-auto flex w-full max-w-[360px] flex-col gap-plus">
      {TOAST_VARIANT_ITEMS.map((item) => (
        <Toast
          key={`${item.status}-${item.title}`}
          status={item.status}
          title={item.title}
          description={item.description}
          action={item.action}
          isLoading={item.isLoading}
          onClose={() => {}}
        />
      ))}
    </div>
  );
}

export const Variants: Story = {
  name: "Варианты",
  render: () => <ToastVariantsDemo />,
};

export const Statuses: Story = {
  name: "Статусы",
  render: function StatusesDemo() {
    const { toast } = useToast();
    return (
      <div className="flex flex-wrap gap-base">
        {STATUSES.map((s) => (
          <Button key={s} variant="outline" onClick={() => toast.show({ status: s, title: s, description: `Тост со статусом «${s}»` })}>
            {s}
          </Button>
        ))}
      </div>
    );
  },
};

// ─── Quick methods ────────────────────────────────────────────────────────────

export const QuickMethods: Story = {
  name: "Быстрые методы",
  render: function QuickDemo() {
    const { toast } = useToast();
    return (
      <div className="flex flex-wrap gap-base">
        <Button onClick={() => toast.success("Файл сохранён", { description: "Синхронизация выполнена" })}>
          success
        </Button>
        <Button variant="danger" onClick={() => toast.danger("Ошибка соединения", { description: "Проверьте сеть и повторите попытку" })}>
          danger
        </Button>
        <Button variant="outline" onClick={() => toast.info("Доступна новая версия")}>
          info
        </Button>
        <Button variant="outline" onClick={() => toast.warning("Хранилище почти заполнено")}>
          warning
        </Button>
      </div>
    );
  },
};

// ─── Promise ──────────────────────────────────────────────────────────────────

export const PromiseToast: Story = {
  name: "Промис (loading → success / error)",
  render: function PromiseDemo() {
    const { toast } = useToast();

    const handleSuccess = () => {
      const p = new Promise<string>((resolve) => setTimeout(() => resolve("Готово"), 2500));
      toast.promise(p, {
        loading: "Сохранение…",
        success: (v) => `${v}! Данные сохранены`,
        error: "Не удалось сохранить",
      });
    };

    const handleError = () => {
      const p = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Network error")), 2000),
      );
      toast.promise(p, {
        loading: "Загрузка файла…",
        success: "Файл загружен",
        error: (e) => `Ошибка: ${(e as Error).message}`,
      });
    };

    return (
      <div className="flex gap-base">
        <Button onClick={handleSuccess}>Promise → success</Button>
        <Button variant="danger" onClick={handleError}>Promise → error</Button>
      </div>
    );
  },
};

// ─── Stack ────────────────────────────────────────────────────────────────────

export const Stack: Story = {
  name: "Стек (несколько тостов)",
  render: function StackDemo() {
    const { toast } = useToast();
    const statuses: ToastStatus[] = ["success", "info", "warning", "danger"];
    let i = 0;
    const addToast = () => {
      const s = statuses[i % statuses.length];
      i++;
      toast.show({ status: s, title: `Уведомление #${i}`, description: "Появляются в стеке" });
    };
    return (
      <div className="flex gap-base">
        <Button onClick={addToast}>Добавить тост</Button>
        <Button variant="outline" onClick={addToast}>Ещё один</Button>
      </div>
    );
  },
};

// ─── All placements ───────────────────────────────────────────────────────────

const PLACEMENTS: ToastPlacement[] = [
  "top-left", "top-center", "top-right",
  "bottom-left", "bottom-center", "bottom-right",
];

export const AllPlacements: Story = {
  name: "Все плейсменты",
  render: function AllPlacementsDemo() {
    const { toast } = useToast();
    return (
      <div className="grid grid-cols-3 gap-base">
        {PLACEMENTS.map((p) => (
          <Button
            key={p}
            variant="outline"
            onClick={() =>
              toast.show({
                status: "info",
                title: p,
                description: "Это уведомление",
                placement: p,
              })
            }
          >
            {p}
          </Button>
        ))}
      </div>
    );
  },
};

// ─── With action ──────────────────────────────────────────────────────────────

export const WithAction: Story = {
  name: "С кнопкой действия",
  render: function WithActionDemo() {
    const { toast } = useToast();
    const show = () =>
      toast.show({
        status: "info",
        title: "Доступно обновление",
        description: "Версия 2.4.0 готова к установке",
        action: (
          <Button size="small" variant="info">
            Обновить
          </Button>
        ),
        timeout: 8000,
      });
    return <Button onClick={show}>Показать с действием</Button>;
  },
};

// ─── Custom timeout ───────────────────────────────────────────────────────────

export const CustomTimeout: Story = {
  name: "Кастомный таймаут",
  render: function CustomTimeoutDemo() {
    const { toast } = useToast();
    return (
      <div className="flex flex-wrap gap-base">
        <Button onClick={() => toast.success("Закроется через 1 сек", { timeout: 1000 })}>
          1 сек
        </Button>
        <Button onClick={() => toast.info("Закроется через 8 сек", { timeout: 8000 })}>
          8 сек
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.warning("Не закроется сам", { timeout: 0 })}
        >
          Без таймаута
        </Button>
      </div>
    );
  },
};

// ─── Compound API ─────────────────────────────────────────────────────────────

export const CompoundApi: Story = {
  name: "Compound API (управляемый)",
  render: function CompoundApiDemo() {
    const [show, setShow] = useState(false);
    return (
      <div className="flex gap-base">
        <Button onClick={() => setShow(true)}>Показать compound</Button>
        {show && (
          <div className="fixed bottom-4 right-4 z-[300] w-[360px]">
            <Toast status="success" onClose={() => setShow(false)}>
              <Toast.Indicator />
              <Toast.Title>Готово!</Toast.Title>
              <Toast.Description>Данные успешно сохранены</Toast.Description>
              <Toast.CloseButton />
            </Toast>
          </div>
        )}
      </div>
    );
  },
};

// ─── Dismiss programmatically ─────────────────────────────────────────────────

export const DismissProgrammatically: Story = {
  name: "Закрытие по ID",
  render: function DismissDemo() {
    const { toast } = useToast();
    const [lastId, setLastId] = useState<string | null>(null);
    return (
      <div className="flex gap-base">
        <Button
          onClick={() => {
            const id = toast.show({ status: "info", title: "Постоянный тост", timeout: 0 });
            setLastId(id);
          }}
        >
          Показать
        </Button>
        <Button
          variant="danger"
          disabled={!lastId}
          onClick={() => {
            if (lastId) toast.dismiss(lastId);
            setLastId(null);
          }}
        >
          Закрыть по ID
        </Button>
      </div>
    );
  },
};
