import { IoArrowForward, IoRocketOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";

export function ButtonCtaCardDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-mid rounded-mid border-token bg-secondary p-mid">
      <div className="flex flex-col gap-xsmall">
        <Text as="p" variant="header-2">
          Запустить проект
        </Text>
        <Text as="p" variant="small" className="text-muted">
          Деплой за минуту — без кредитной карты.
        </Text>
      </div>
      <div className="flex flex-col gap-small">
        <Button variant="primary" className="w-full" leftIcon={<IoRocketOutline aria-hidden />}>
          Создать workspace
        </Button>
        <Button variant="ghost" className="w-full text-muted hover:text-primary">
          <span className="inline-flex w-full items-center justify-center gap-xsmall">
            Смотреть документацию
            <IoArrowForward aria-hidden />
          </span>
        </Button>
      </div>
    </div>
  );
}
