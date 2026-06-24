import { IoTrashOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";

export function ButtonDangerBannerDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-mid rounded-mid border border-danger/30 bg-danger/5 p-mid sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <Text as="p" variant="base" className="font-medium text-danger">
          Удалить все черновики?
        </Text>
        <Text as="p" variant="small" className="text-muted">
          Действие необратимо.
        </Text>
      </div>
      <div className="flex shrink-0 gap-xsmall">
        <Button variant="ghost" size="small" className="text-muted">
          Отмена
        </Button>
        <Button
          variant="primary"
          status="danger"
          size="small"
          leftIcon={<IoTrashOutline aria-hidden />}
          className="shadow-none"
        >
          Удалить
        </Button>
      </div>
    </div>
  );
}
