import { Grid } from "@/components/core/Grid";

export function GridClassNamesFullDemo() {
  return (
    <Grid columns={3} gap="small" classNames={{ root: "rounded-mid bg-surface p-mid" }}>
      <span>A</span>
      <span>B</span>
      <span>C</span>
    </Grid>
  );
}
