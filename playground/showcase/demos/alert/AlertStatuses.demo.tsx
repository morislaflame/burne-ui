import { Alert } from "@/components/core/Alert";

export function AlertStatusesDemo() {
  return (
    <div className="flex flex-col gap-mid">
      <Alert title="Подсказка" description="Компоненты импортируются из библиотеки через alias @." />
      <Alert title="Внимание" description="Playground не входит в npm-пакет dist/." />
      <Alert title="Готово" description="Все статусы Alert доступны из коробки." />
      <Alert status="info" title="Информация" description="Нейтральное системное сообщение." />
      <Alert status="danger" title="Ошибка" description="Критическая проблема с подключением." />
    </div>
  );
}
