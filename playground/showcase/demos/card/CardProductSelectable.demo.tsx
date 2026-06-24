import { useState } from "react";

import { Badge } from "@/components/core/Badge";
import { Card } from "@/components/core/Card";
import { Ripple } from "@/components/core/Ripple";
import { PIN_IMAGE4 } from "@/utils/mockImages";

export function CardProductSelectableDemo() {
  const [selected, setSelected] = useState(false);

  return (
    <Card
      pressable
      variant={selected ? "secondary" : "outline"}
      onPress={() => setSelected((v) => !v)}
      className="max-w-xs"
    >
      <Ripple color="neutral" />
      <div className="relative z-[1]">
        <Card.Body className="px-large pb-0 pt-plus">
          <div
            className="relative h-28 w-full overflow-hidden rounded-small bg-cover bg-center"
            style={{ backgroundImage: `url(${PIN_IMAGE4})` }}
          >
            {selected ? (
              <Badge status="success" size="small" className="absolute top-small right-small">
                Выбрано
              </Badge>
            ) : null}
          </div>
        </Card.Body>
        <Card.Header className="pt-small">
          <Card.Title>Парка Arctic</Card.Title>
          <Card.Description>Нажмите для выбора варианта.</Card.Description>
        </Card.Header>
      </div>
    </Card>
  );
}
