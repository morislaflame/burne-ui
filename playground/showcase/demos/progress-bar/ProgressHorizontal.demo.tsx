import { ProgressBar } from "@/components/core/ProgressBar";

export function ProgressHorizontalDemo() {
  return (
    <div className="flex flex-col gap-mid">
      <ProgressBar label="Загрузка" value={62} className="w-120" />
      <ProgressBar label="Неопределённый" indeterminate className="w-120" />
      <ProgressBar label="Успех" value={100} color="var(--color-success)" className="w-120" />
    </div>
  );
}
