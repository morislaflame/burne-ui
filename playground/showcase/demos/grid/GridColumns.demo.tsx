import { Grid } from "@/components/core/Grid";
import { Surface } from "@/components/core/Surface";

export function GridColumnsDemo() {
  return (
    <div className="flex w-full flex-col gap-large">
      <Grid columns={3} gap="mid">
        <Surface padding="mid">A</Surface>
        <Surface padding="mid">B</Surface>
        <Surface padding="mid">C</Surface>
      </Grid>
      <Grid columns="auto" minTrack="small" gap="small">
        <Surface padding="small">1</Surface>
        <Surface padding="small">2</Surface>
        <Surface padding="small">3</Surface>
        <Surface padding="small">4</Surface>
      </Grid>
    </div>
  );
}
