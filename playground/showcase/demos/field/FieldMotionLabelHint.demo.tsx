import { Field } from "@/components/core/Field";
import { Input } from "@/components/core/Input";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

export function FieldMotionLabelHintDemo() {
  return (
    <Field
      className="w-72"
      motion={{
        label: {
          enter: (ctx) =>
            ctx.fromTo({ y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.26 }),
          hoverIn: (ctx) => tweenCssColor(ctx.el, "var(--color-primary)", { duration: 0.2 }),
          hoverOut: (ctx) =>
            tweenCssColor(ctx.el, "var(--color-foreground)", {
              duration: 0.18,
              clearOnComplete: true,
            }),
        },
        hint: {
          enter: (ctx) =>
            ctx.fromTo(
              { y: 8, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.28, delay: 0.06 },
            ),
        },
      }}
    >
      <Field.Label>Display name</Field.Label>
      <Input>
        <Input.Control placeholder="Ada Lovelace" />
      </Input>
      <Field.Hint>Shown on invoices and receipts.</Field.Hint>
    </Field>
  );
}
