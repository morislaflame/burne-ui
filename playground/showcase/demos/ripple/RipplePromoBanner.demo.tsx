import { Button } from "@/components/core/Button";
import { Ripple } from "@/components/core/Ripple";
import { Text } from "@/components/core/Text";

export function RipplePromoBannerDemo() {
  return (
    <div className="relative w-full max-w-lg overflow-hidden rounded-mid bg-gradient-to-r from-blue-500 via-info to-primary p-large">
      <Ripple color="rgba(255,255,255,0.35)" />
      <div className="relative z-[1] flex flex-col gap-small sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Text as="p" variant="header-2" className="text-white">
            Summer promotion
          </Text>
          <Text as="p" variant="small" className="text-white/80">
            −30% for everything gloss-components by the end of the month.
          </Text>
        </div>
        <Button variant="secondary" className="shrink-0">
          Find out more
        </Button>
      </div>
    </div>
  );
}
