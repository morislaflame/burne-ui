import { Avatar } from "@/components/core/Avatar";
import { PIN_IMAGE1, PIN_IMAGE2 } from "@/utils/mockImages";

export function AvatarGlossDemo() {
  return (
    <div className="flex flex-wrap items-center gap-mid">
      <Avatar variant="gloss" size="base" label="Gloss" src={PIN_IMAGE1} alt="" loading="lazy" />
      <Avatar variant="gloss" size="mid" label="Glass" src={PIN_IMAGE2} alt="" loading="lazy" />
      <Avatar variant="gloss" size="large" label="Fallback" />
    </div>
  );
}
