import { Grid } from "@/components/core/Grid";

export function GridMotionVarsDemo() {
  return (
    <Grid
      columns={3} gap="mid"
      motion={{ root: { enter: { y: -8, opacity: 0, duration: 0.35 } } }}
    >
      <span>Enter</span>
    </Grid>
  );
}
