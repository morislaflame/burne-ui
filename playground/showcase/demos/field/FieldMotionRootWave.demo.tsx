import gsap from "gsap";

import { Field } from "@/components/core/Field";
import { Input } from "@/components/core/Input";

const TL = { overwrite: "auto" as const, force3D: false };

export function FieldMotionRootWaveDemo() {
  return (
    <Field
      motion={{
        root: {
          enter: (ctx) =>
            gsap.fromTo(ctx.el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, ...TL }),
        },
        hint: {
          enter: (ctx) => gsap.fromTo(ctx.el, { x: -6 }, { x: 0, duration: 0.22, ...TL }),
        },
      }}
    >
      <Field.Label>Email</Field.Label>
      <Input>
        <Input.Control placeholder="you@burne.dev" />
      </Input>
      <Field.Hint>Does not steal Input motion</Field.Hint>
    </Field>
  );
}
