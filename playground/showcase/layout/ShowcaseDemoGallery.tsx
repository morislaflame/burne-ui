import { useCallback, useState, type ComponentType, type KeyboardEvent } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";
import type { SurfacePadding } from "@/components/core/Surface";
import { cn } from "@/utils/cn";

import type { ShowcaseDemoAlign } from "./ShowcaseDemoStage";

import {
  formatShowcaseSource,
  showcaseSourcePlaysEnter,
  type FormatShowcaseSourceOptions,
} from "../utils/formatShowcaseSource";
import { ShowcaseDemo } from "./ShowcaseDemo";

export type ShowcaseDemoGalleryItem = {
  id: string;
  title: string;
  Demo: ComponentType;
  source: string;
};

export type ShowcaseDemoGalleryProps = {
  items: readonly ShowcaseDemoGalleryItem[];
  format?: FormatShowcaseSourceOptions;
  className?: string;
  align?: ShowcaseDemoAlign;
  padding?: SurfacePadding;
  replay?: boolean;
  "aria-label"?: string;
};

export function ShowcaseDemoGallery({
  items,
  format,
  replay,
  className,
  align = "center",
  padding,
  "aria-label": ariaLabel = "Demo gallery",
}: ShowcaseDemoGalleryProps) {
  const [index, setIndex] = useState(0);
  const count = items.length;
  const item = items[index];

  const go = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  const onChromeKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(index - 1);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(index + 1);
      }
    },
    [go, index],
  );

  if (!item || count === 0) return null;

  const Demo = item.Demo;

  return (
    <div className={cn("flex w-full flex-col gap-mid", className)}>
      <div
        role="navigation"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={onChromeKeyDown}
        className="flex flex-col gap-small rounded-large focus-ring"
      >
        <div className="flex items-center gap-small">
          <Button
            type="button"
            size="small"
            variant="outline"
            iconOnly
            aria-label="Previous demo"
            icon={<IoChevronBack aria-hidden />}
            onClick={() => go(index - 1)}
          />
          <Text as="p" variant="small" className="min-w-0 flex-1 font-w-mid">
            {item.title}
          </Text>
          <Text as="span" variant="xsmall" className="shrink-0 text-muted">
            {index + 1} / {count}
          </Text>
          <Button
            type="button"
            size="small"
            variant="outline"
            iconOnly
            aria-label="Next demo"
            icon={<IoChevronForward aria-hidden />}
            onClick={() => go(index + 1)}
          />
        </div>
        <div className="flex flex-wrap gap-xsmall">
          {items.map((slide, slideIndex) => (
            <Button
              key={slide.id}
              type="button"
              size="small"
              variant={slideIndex === index ? "secondary" : "outline"}
              aria-current={slideIndex === index ? "true" : undefined}
              onClick={() => setIndex(slideIndex)}
            >
              {slide.title}
            </Button>
          ))}
        </div>
      </div>
      <ShowcaseDemo
        code={formatShowcaseSource(item.source, format)}
        replay={replay ?? showcaseSourcePlaysEnter(item.source)}
        align={align}
        padding={padding}
      >
        <Demo key={item.id} />
      </ShowcaseDemo>
    </div>
  );
}
