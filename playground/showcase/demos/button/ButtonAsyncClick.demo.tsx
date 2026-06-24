import { Button } from "@/components/core/Button";

export function ButtonAsyncClickDemo() {
  return (
    <Button
      ripple
      onAsyncClick={() =>
        new Promise<boolean>((resolve) => {
          window.setTimeout(() => resolve(true), 1400);
        })
      }
      className="cursor-progress w-fit"
    >
      Async сохранение
    </Button>
  );
}
