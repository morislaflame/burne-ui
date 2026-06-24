import { Expandable } from "@/components/core/Expandable";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

import { EXPANDABLE_INFO_ICON } from "../../shared/constants";

export function ExpandableOrderDetailsDemo() {
  return (
    <Surface variant="secondary" padding="mid" className="w-full max-w-md">
      <Text as="p" variant="small" className="mb-mid font-medium">
        Заказ #1042
      </Text>
      <Expandable defaultOpen title="Состав заказа" icon={EXPANDABLE_INFO_ICON} description="3 позиции">
        <ul className="flex flex-col gap-xsmall text-sm text-muted">
          <li>Парка Arctic — 1 шт.</li>
          <li>Шапка Wool — 1 шт.</li>
          <li>Перчатки Pro — 1 шт.</li>
        </ul>
      </Expandable>
    </Surface>
  );
}
