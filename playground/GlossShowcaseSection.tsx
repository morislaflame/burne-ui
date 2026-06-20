import { useState } from "react";
import { IoAdd, IoCheckmark } from "react-icons/io5";

import {
  AlertDialog,
  primaryButtonVariantForAlertTone,
} from "@/components/composite/AlertDialog";
import { Alert } from "@/components/core/Alert";
import { Avatar } from "@/components/core/Avatar";
import { Badge } from "@/components/core/Badge";
import { Button } from "@/components/core/Button";
import { Card } from "@/components/core/Card";
import { Dialog } from "@/components/core/Dialog";
import { Input } from "@/components/core/Input";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";
import { glossDottedGridStyle } from "@/components/core/utils/glossStoryChrome";
import { PIN_IMAGE1, PIN_IMAGE2, PIN_IMAGE3 } from "@/utils/mockImages";

const GLOSS_STATUSES = ["default", "danger", "success", "info", "warning"] as const;

export function GlossShowcaseSection() {
  const [glossDialogOpen, setGlossDialogOpen] = useState(false);
  const [glossAlertOpen, setGlossAlertOpen] = useState(false);
  const [cardPressCount, setCardPressCount] = useState(0);

  return (
    <div
      className="flex flex-col gap-xlarge rounded-mid p-mid"
      style={{ backgroundColor: "var(--color-background)", ...glossDottedGridStyle }}
    >
      <div className="flex flex-col gap-xsmall">
        <Text as="p" variant="small" className="text-muted">
          Универсальный <code className="text-primary">variant=&quot;gloss&quot;</code> — стеклянная
          поверхность с conic-обводкой, GSAP hover-lift и адаптивным бликом.
        </Text>
      </div>

      <div className="flex flex-col gap-small">
        <Text as="h3" variant="base" className="font-medium">
          Кнопки
        </Text>
        <div className="flex flex-wrap items-center gap-small">
          {GLOSS_STATUSES.map((status) => (
            <Button key={status} variant="gloss" status={status} className="capitalize">
              {status}
            </Button>
          ))}
          <Button variant="gloss" leftIcon={<IoAdd aria-hidden />}>
            С иконкой
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-small">
        <Text as="h3" variant="base" className="font-medium">
          Бейджи и алерты
        </Text>
        <div className="flex flex-wrap items-center gap-small">
          <Badge variant="gloss">Gloss</Badge>
          <Badge variant="gloss" status="success" icon={<IoCheckmark aria-hidden />}>
            Success
          </Badge>
          <Badge variant="gloss" status="danger">
            Danger
          </Badge>
          <Badge variant="gloss" status="info">
            Info
          </Badge>
        </div>
        <div className="flex flex-col gap-small">
          <Alert variant="gloss" status="info" title="Gloss alert" description="Стеклянная панель с hover-lift." />
          <Alert variant="gloss" status="danger" title="Ошибка" description="Статус — только цвет текста и иконки." />
        </div>
      </div>

      <div className="flex flex-col gap-small">
        <Text as="h3" variant="base" className="font-medium">
          Поля ввода
        </Text>
        <div className="grid max-w-md gap-small">
          <Input.Control variant="gloss" placeholder="you@example.com" autoComplete="email" />
          <Input.Control variant="gloss" prefix="https://" suffix=".com" placeholder="example" />
        </div>
      </div>

      <div className="flex flex-col gap-small">
        <Text as="h3" variant="base" className="font-medium">
          Поверхности
        </Text>
        <div className="grid gap-mid lg:grid-cols-2">
          <Surface variant="gloss" padding="plus" radius="mid">
            <Text as="p" variant="base" className="font-medium">
              Surface gloss
            </Text>
            <Text as="p" variant="small" className="text-muted">
              Статическая стеклянная панель.
            </Text>
          </Surface>
          <Card variant="gloss" pressable onPress={() => setCardPressCount((n) => n + 1)}>
            <Card.Header>
              <Card.Title>Card gloss + pressable</Card.Title>
              <Card.Description>
                Нажатий: {cardPressCount}. Hover-lift и squeeze как у кнопки.
              </Card.Description>
            </Card.Header>
            <Card.Footer className="flex justify-end gap-small">
              <Button variant="gloss" size="small">
                Gloss
              </Button>
              <Button variant="primary" size="small">
                Primary
              </Button>
            </Card.Footer>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-small">
        <Text as="h3" variant="base" className="font-medium">
          Аватары
        </Text>
        <div className="flex flex-wrap items-center gap-mid">
          <Avatar variant="gloss" size="small" label="Ada" src={PIN_IMAGE1} alt="" loading="lazy" />
          <Avatar variant="gloss" size="base" label="Grace" src={PIN_IMAGE2} alt="" loading="lazy" />
          <Avatar variant="gloss" size="mid" label="Alan" src={PIN_IMAGE3} alt="" loading="lazy" />
          <Avatar variant="gloss" size="large" label="Burne" />
        </div>
      </div>

      <div className="flex flex-col gap-small">
        <Text as="h3" variant="base" className="font-medium">
          Модальные окна
        </Text>
        <div className="flex flex-wrap gap-small">
          <Button variant="gloss" onClick={() => setGlossDialogOpen(true)}>
            Gloss Dialog
          </Button>
          <Button variant="gloss" status="danger" onClick={() => setGlossAlertOpen(true)}>
            Gloss AlertDialog
          </Button>
        </div>
      </div>

      <Dialog open={glossDialogOpen} onOpenChange={setGlossDialogOpen} variant="gloss">
        <Dialog.Header>
          <Dialog.HeadingBlock>
            <Dialog.Title>Gloss Dialog</Dialog.Title>
            <Dialog.Description>Стеклянная модальная панель с gloss-полями.</Dialog.Description>
          </Dialog.HeadingBlock>
          <Dialog.Close />
        </Dialog.Header>
        <Dialog.Body className="flex flex-col gap-plus">
          <Input>
            <Input.Label>Имя</Input.Label>
            <Input.Control variant="gloss" name="name" placeholder="Иван" autoComplete="name" />
          </Input>
          <Input>
            <Input.Label>Email</Input.Label>
            <Input.Control variant="gloss" name="email" placeholder="you@example.com" autoComplete="email" />
          </Input>
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="gloss" onClick={() => setGlossDialogOpen(false)}>
            Отмена
          </Button>
          <Button variant="primary" onClick={() => setGlossDialogOpen(false)}>
            Сохранить
          </Button>
        </Dialog.Footer>
      </Dialog>

      <AlertDialog open={glossAlertOpen} onOpenChange={setGlossAlertOpen} variant="gloss" status="danger">
        <AlertDialog.Header>
          <AlertDialog.HeadingBlock>
            <AlertDialog.Title>Удалить проект?</AlertDialog.Title>
            <AlertDialog.Description>
              Gloss AlertDialog — подтверждение на стеклянной панели.
            </AlertDialog.Description>
          </AlertDialog.HeadingBlock>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <Button type="button" variant="gloss" onClick={() => setGlossAlertOpen(false)}>
            Отмена
          </Button>
          <Button
            type="button"
            variant={primaryButtonVariantForAlertTone("danger")}
            status="danger"
            onClick={() => setGlossAlertOpen(false)}
          >
            Удалить
          </Button>
        </AlertDialog.Footer>
      </AlertDialog>
    </div>
  );
}
