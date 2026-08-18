import { Select } from "@/components/core/Select";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

const options = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

export function SelectMotionValueTintDemo() {
  return (
    <Select className="w-64" options={options} defaultValue="vue">
      <Select.Label>Value tint</Select.Label>
      <Select.TriggerGroup>
        <Select.Value
          motion={{
            hoverIn: (ctx) => {
              const tl = ctx.timeline();
              tl.to(ctx.el, { y: -1, duration: 0.18 }, 0);
              tweenCssColor(ctx.el, "var(--color-primary)");
              return tl;
            },
            hoverOut: (ctx) => {
              const tl = ctx.timeline();
              tl.to(ctx.el, { y: 0, duration: 0.16 }, 0);
              tweenCssColor(ctx.el, "var(--color-foreground)", { clearOnComplete: true });
              return tl;
            },
          }}
        />
        <Select.Trigger
          motion={{
            pressIn: (ctx) =>
              ctx.to({ rotate: 90, scale: 0.88, duration: 0.16, ease: "back.out(1.8)" }),
            pressOut: (ctx) =>
              ctx.to({ rotate: 0, scale: 1, duration: 0.18, ease: "power2.inOut" }),
          }}
        />
      </Select.TriggerGroup>
      <Select.Hint>Compound motion on Value + Trigger</Select.Hint>
      <Select.Popover />
    </Select>
  );
}
