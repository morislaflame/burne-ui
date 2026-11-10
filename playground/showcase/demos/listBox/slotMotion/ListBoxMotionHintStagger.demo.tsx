import { ListBox } from "@/components/core/ListBox";
import { Surface } from "@/components/core/Surface";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

export function ListBoxMotionHintStaggerDemo() {
  return (
    <Surface variant="default" padding="mid" className="max-w-sm">
      <ListBox defaultValue="pro" aria-label="Plan with hints">
        <ListBox.Item value="starter" hint="For side projects">
          <ListBox.Label>Starter</ListBox.Label>
          <ListBox.Hint
            motion={{
              hoverIn: (ctx) => {
                const tl = ctx.timeline();
                tl.to(ctx.el, { x: 2, duration: 0.16 }, 0);
                tweenCssColor(ctx.el, "var(--color-primary)");
                return tl;
              },
              hoverOut: (ctx) => {
                const tl = ctx.timeline();
                tl.to(ctx.el, { x: 0, duration: 0.14 }, 0);
                tweenCssColor(ctx.el, "var(--color-muted-foreground)", {
                  clearOnComplete: true,
                });
                return tl;
              },
            }}
          >
            For side projects
          </ListBox.Hint>
        </ListBox.Item>
        <ListBox.Item value="pro" label="Pro" hint="Most teams start here" />
        <ListBox.Item value="enterprise" label="Enterprise" hint="SSO and audit log" />
      </ListBox>
    </Surface>
  );
}
