import { Grid } from "@/components/core/Grid";

export function GridMotionFactoryDemo() {
  return (
    <Grid
      columns={3} gap="mid"
      motion={{
        root: {
          enter: (ctx) => ctx.fromTo({ y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }),
        },
      }}
    >
      <span>Factory</span>
    </Grid>
  );
}
