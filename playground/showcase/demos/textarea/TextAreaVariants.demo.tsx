import { TextArea } from "@/components/core/TextArea";

const VARIANTS = ["default", "outline", "secondary", "gloss"] as const;

export function TextAreaVariantsDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-xlarge sm:grid-cols-2">
      {VARIANTS.map((variant) => (
        <TextArea
          key={variant}
          label={variant}
          variant={variant}
          placeholder={`variant="${variant}"`}
          rows={3}
          hint={`variant="${variant}"`}
          className="w-full"
        />
      ))}
    </div>
  );
}
