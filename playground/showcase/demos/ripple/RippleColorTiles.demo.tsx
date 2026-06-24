import { Ripple } from "@/components/core/Ripple";
import { Text } from "@/components/core/Text";

const TILES = [
  { label: "Mint", ripple: "rgba(16, 185, 129, 0.45)", bg: "bg-success/15 text-success" },
  { label: "Sky", ripple: "rgba(56, 189, 248, 0.5)", bg: "bg-info/15 text-info" },
  { label: "Rose", ripple: "rgba(244, 63, 94, 0.45)", bg: "bg-danger/15 text-danger" },
] as const;

export function RippleColorTilesDemo() {
  return (
    <div className="grid w-full max-w-md grid-cols-3 gap-small">
      {TILES.map((tile) => (
        <button
          key={tile.label}
          type="button"
          className={`relative overflow-hidden rounded-mid border-token p-mid ${tile.bg}`}
        >
          <Ripple color={tile.ripple} />
          <Text as="span" variant="small" className="relative z-[1] font-medium">
            {tile.label}
          </Text>
        </button>
      ))}
    </div>
  );
}
