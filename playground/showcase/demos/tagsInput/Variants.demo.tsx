import { TagsInput } from "@/components/core/TagsInput";

const VARIANTS = ["default", "outline", "secondary"] as const;

export function TagsInputVariantsDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-xlarge sm:grid-cols-2">
      {VARIANTS.map((variant) => (
        <TagsInput
          key={variant}
          label={variant}
          variant={variant}
          hint={`variant="${variant}"`}
          defaultValues={["design"]}
          placeholder="Add a tag"
          className="w-full"
        />
      ))}
    </div>
  );
}
