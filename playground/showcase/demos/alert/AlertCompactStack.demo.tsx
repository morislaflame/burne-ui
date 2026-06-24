import { Alert } from "@/components/core/Alert";

const ITEMS = [
  {
    status: "success" as const,
    title: "Деплой завершён",
    description: "Preview на Vercel обновлён.",
    className: "border-l-4 border-success bg-success/5",
  },
  {
    status: "info" as const,
    title: "Новый комментарий",
    description: "Алекс оставил ревью к PR #42.",
    className: "border-l-4 border-info bg-info/5",
  },
] as const;

export function AlertCompactStackDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-small">
      {ITEMS.map((item) => (
        <Alert
          key={item.title}
          status={item.status}
          title={item.title}
          description={item.description}
          className={item.className}
        />
      ))}
    </div>
  );
}
