import { Field } from "@/components/core/Field";
import { Input } from "@/components/core/Input";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

export function FieldMotionErrorTintDemo() {
  return (
    <Field
      motion={{
        error: {
          enter: (ctx) => {
            const tl = ctx.timeline();
            tl.fromTo(ctx.el, { y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.24 }, 0);
            tweenCssColor(ctx.el, "var(--color-danger)");
            return tl;
          },
        },
      }}
    >
      <Field.Label>Token</Field.Label>
      <Input>
        <Input.Control defaultValue="oops" />
      </Input>
      <Field.Error>Invalid token</Field.Error>
    </Field>
  );
}
