import { useCallback, useState, type ReactNode } from "react";
import { IoCheckmark, IoCopyOutline, IoRefreshOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Disclosure } from "@/components/core/Disclosure";
import { Surface, type SurfacePadding } from "@/components/core/Surface";
import { cn } from "@/utils/cn";

import { ShowcaseDemoStage, type ShowcaseDemoAlign } from "./ShowcaseDemoStage";

function ShowcaseCodePanel({ code }: { code: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }, [code]);

  return (
    <Disclosure
      open={open}
      onOpenChange={setOpen}
      variant="ghost"
      size="small"
      className="border-t-token bg-surface"
    >
      <div className="flex items-center justify-between gap-small p-large">
        <Disclosure.Trigger asChild chevron={null}>
          <Button
            type="button"
            variant="outline"
            size="small"
            className="h-8 shrink-0 gap-xsmall px-small text-muted hover:text-foreground"
          >
            {open ? "Hide code" : "Show code"}
          </Button>
        </Disclosure.Trigger>
        {open ? (
          <Button
            type="button"
            variant="outline"
            size="small"
            className="h-8 shrink-0 gap-xsmall px-small text-muted hover:text-foreground"
            onClick={onCopy}
            icon={copied ? <IoCheckmark aria-hidden className="text-success" /> : <IoCopyOutline aria-hidden />}
          >
            {copied ? "Copied" : "Copy"}
          </Button>
        ) : null}
      </div>
      <Disclosure.Content className="text-foreground p-0">
        <pre className="max-h-80 overflow-auto p-large text-xs leading-relaxed">
          <code className="block whitespace-pre font-mono text-foreground/90">{code.trim()}</code>
        </pre>
      </Disclosure.Content>
    </Disclosure>
  );
}

export function ShowcaseDemo({
  children,
  code,
  className,
  align = "start",
  padding = "mid",
  replay = false,
}: {
  children: ReactNode;
  /** JSX/TSX-snippet corresponding to the demo above. */
  code?: string;
  className?: string;
  align?: ShowcaseDemoAlign;
  padding?: SurfacePadding;
  /** Remount the demo to replay mount `enter` animations. */
  replay?: boolean;
}) {
  const [play, setPlay] = useState(0);

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-large border-token",
        className,
      )}
    >
      <Surface
        variant="default"
        padding={padding}
        className={cn(
          "rounded-none border-0 shadow-none bg-transparent min-h-72 p-large relative flex flex-col",
          replay ? "gap-mid" : "justify-center",
        )}
      >
        {replay ? (
          <div className="flex w-full shrink-0 justify-end absolute top-large right-large">
            <Button
              type="button"
              variant="outline"
              size="small"
              className="h-8 shrink-0 gap-xsmall px-small text-muted hover:text-foreground"
              icon={<IoRefreshOutline aria-hidden />}
              onClick={() => setPlay((n) => n + 1)}
            >
              Replay
            </Button>
          </div>
        ) : null}
        <ShowcaseDemoStage key={play} align={align}>
          {children}
        </ShowcaseDemoStage>
      </Surface>
      {code ? <ShowcaseCodePanel code={code} /> : null}
    </div>
  );
}
