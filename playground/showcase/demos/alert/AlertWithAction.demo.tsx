import { Alert } from "@/components/core/Alert";
import { Button } from "@/components/core/Button";

export function AlertWithActionDemo() {
  return (
    <Alert
      status="warning"
      title="Сессия скоро истечёт"
      description="Сохраните черновик или продолжите работу — через 5 минут вы будете разлогинены."
      className="max-w-lg border-warning/30"
      action={
        <Button variant="outline" size="small" className="shrink-0">
          Продлить
        </Button>
      }
    />
  );
}
