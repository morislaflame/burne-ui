import { Label } from "@/components/core/Label";

export function LabelPartsDemo() {
  return (
    <Label htmlFor="label-parts" required>
      <Label.Text className="text-primary">Email</Label.Text>
      <Label.Required className="text-warning" />
    </Label>
  );
}
