import { useMemo, useRef, useState } from "react";

import { Button } from "@/components/core/Button";
import { Card } from "@/components/core/Card";
import { Dialog } from "@/components/core/Dialog";
import { Label } from "@/components/core/Label";
import { Popover } from "@/components/core/Popover";
import { Text } from "@/components/core/Text";
import { SkinProvider } from "@/skins/skinContext";
import {
  parseSkinDocument,
  renderSkinPackage,
  renderSkinStylesheet,
  SKIN_EDITOR_EXAMPLE,
  skinToJson,
  type SkinDocument,
} from "@/skins/skinDocument";
import { SKIN_SLOTS, type SkinDeclarativeLayers } from "@/skins/skinTypes";
import { cn } from "@/utils/cn";

const fieldClass =
  "min-w-0 flex-1 rounded-base border-token bg-surface px-small py-xsmall font-mono text-xsmall text-foreground focus-ring";

const LAYER_SLOTS = ["card.root", "surface.root", "dialog.panel", "drawer.panel"] as const;

type TokenRow = { id: string; key: string; value: string };
type TargetRow = { id: string; slot: string; className: string };

function readHashSkin(): SkinDocument {
  if (typeof window === "undefined") return SKIN_EDITOR_EXAMPLE;
  const hash = window.location.hash;
  if (!hash.startsWith("#skin=")) return SKIN_EDITOR_EXAMPLE;
  try {
    const parsed = parseSkinDocument(JSON.parse(decodeURIComponent(hash.slice("#skin=".length))));
    return parsed.ok ? parsed.skin : SKIN_EDITOR_EXAMPLE;
  } catch {
    return SKIN_EDITOR_EXAMPLE;
  }
}

function tokenRows(tokens: Record<string, string> | undefined): TokenRow[] {
  return Object.entries(tokens ?? {}).map(([key, value], index) => ({
    id: `token-${index}`,
    key,
    value,
  }));
}

function targetRows(targets: SkinDocument["targets"]): TargetRow[] {
  return Object.entries(targets ?? {}).map(([slot, className], index) => ({
    id: `target-${index}`,
    slot,
    className,
  }));
}

function mapTokens(rows: TokenRow[]): Record<string, string> | undefined {
  const map: Record<string, string> = {};
  for (const row of rows) {
    const key = row.key.trim();
    if (key) map[key] = row.value;
  }
  return Object.keys(map).length > 0 ? map : undefined;
}

function mapTargets(rows: TargetRow[]): SkinDocument["targets"] {
  const map: NonNullable<SkinDocument["targets"]> = {};
  for (const row of rows) {
    const slot = row.slot.trim();
    if (slot) map[slot as keyof typeof map] = row.className;
  }
  return Object.keys(map).length > 0 ? map : undefined;
}

function layerClass(layers: SkinDeclarativeLayers | undefined, place: "before" | "after" | "wrapper" | "content"): string {
  if (!layers) return "";
  if (place === "before" || place === "after") return layers[place]?.[0]?.className ?? "";
  return layers[place]?.className ?? "";
}

function withLayerClass(
  layers: SkinDeclarativeLayers | undefined,
  place: "before" | "after" | "wrapper" | "content",
  className: string,
): SkinDeclarativeLayers {
  const next: SkinDeclarativeLayers = { ...layers };
  if (place === "before" || place === "after") {
    const current = next[place]?.[0];
    next[place] = className || current?.style ? [{ ...current, className: className || undefined }] : undefined;
    return next;
  }
  next[place] = className || next[place]?.style ? { ...next[place], className: className || undefined } : undefined;
  return next;
}

function download(filename: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function SkinEditor() {
  const initial = useMemo(readHashSkin, []);
  const [name, setName] = useState(initial.name);
  const [baseVariant, setBaseVariant] = useState<SkinDocument["baseVariant"]>(initial.baseVariant ?? "outline");
  const [tokens, setTokens] = useState<TokenRow[]>(() => tokenRows(initial.tokens));
  const [targets, setTargets] = useState<TargetRow[]>(() => targetRows(initial.targets));
  const [layers, setLayers] = useState(initial.layersDeclarative ?? {});
  const [layerSlot, setLayerSlot] = useState<string>("card.root");
  const [jsonText, setJsonText] = useState(() => JSON.stringify(initial.layersDeclarative ?? {}, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [portal, setPortal] = useState<HTMLDivElement | null>(null);
  const rowId = useRef(100);

  const draft = useMemo<SkinDocument>(() => {
    const document: SkinDocument = {
      name: name.trim() || "skin",
      meta: { title: name.trim() || "Skin", description: "Edited in the skin editor." },
      baseVariant,
      styleUrl: `burne-ui-skin-${name.trim() || "skin"}/styles.css`,
    };
    const tokenMap = mapTokens(tokens);
    const targetMap = mapTargets(targets);
    if (tokenMap) document.tokens = tokenMap;
    if (targetMap) document.targets = targetMap;
    if (Object.keys(layers).length > 0) document.layersDeclarative = layers;
    return document;
  }, [baseVariant, layers, name, targets, tokens]);

  const parsed = parseSkinDocument(draft);
  const validSkin = useRef(initial);
  if (parsed.ok) validSkin.current = parsed.skin;
  const preview = validSkin.current;
  const activeLayers = layers[layerSlot as keyof typeof layers];

  async function copy(label: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
  }

  function share() {
    const url = new URL(window.location.href);
    url.hash = `skin=${encodeURIComponent(JSON.stringify(preview))}`;
    window.history.replaceState(null, "", url);
    void copy("link", url.toString());
  }

  function applyJson() {
    try {
      const value = JSON.parse(jsonText) as unknown;
      const next = parseSkinDocument({ ...draft, layersDeclarative: value });
      if (!next.ok) {
        setJsonError(next.errors.join(" "));
        return;
      }
      setLayers(next.skin.layersDeclarative ?? {});
      setJsonError(null);
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : "Invalid JSON");
    }
  }

  return (
    <div className="grid items-start gap-large lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
      <div className="flex min-w-0 flex-col gap-large">
        <section className="flex flex-col gap-small">
          <Text as="h2" variant="mid">
            Skin
          </Text>
          <Label className="text-small text-muted">Name</Label>
          <input
            className={fieldClass}
            value={name}
            aria-label="Skin name"
            onChange={(event) => setName(event.target.value)}
          />
          <Label className="text-small text-muted">Base variant</Label>
          <select
            className={fieldClass}
            value={baseVariant}
            aria-label="Base variant"
            onChange={(event) => setBaseVariant(event.target.value as SkinDocument["baseVariant"])}
          >
            <option value="default">default</option>
            <option value="outline">outline</option>
            <option value="secondary">secondary</option>
          </select>
        </section>

        <section className="flex flex-col gap-small">
          <Text as="h2" variant="mid">
            Tokens
          </Text>
          {tokens.map((row) => (
            <div key={row.id} className="flex items-center gap-small">
              <input
                className={fieldClass}
                value={row.key}
                aria-label="Token name"
                onChange={(event) =>
                  setTokens((current) => current.map((item) => (item.id === row.id ? { ...item, key: event.target.value } : item)))
                }
              />
              {/^#[0-9a-f]{6}$/i.test(row.value) ? (
                <input
                  type="color"
                  className="size-8 shrink-0 cursor-pointer rounded-small bg-transparent p-0.5"
                  value={row.value}
                  aria-label={`${row.key} color`}
                  onChange={(event) =>
                    setTokens((current) => current.map((item) => (item.id === row.id ? { ...item, value: event.target.value } : item)))
                  }
                />
              ) : null}
              <input
                className={fieldClass}
                value={row.value}
                aria-label={`${row.key} value`}
                onChange={(event) =>
                  setTokens((current) => current.map((item) => (item.id === row.id ? { ...item, value: event.target.value } : item)))
                }
              />
              <Button
                type="button"
                size="small"
                variant="secondary"
                onClick={() => setTokens((current) => current.filter((item) => item.id !== row.id))}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            size="small"
            variant="outline"
            onClick={() => {
              rowId.current += 1;
              setTokens((current) => [...current, { id: `token-new-${rowId.current}`, key: "--color-border", value: "#111111" }]);
            }}
          >
            Add token
          </Button>
        </section>

        <section className="flex flex-col gap-small">
          <Text as="h2" variant="mid">
            Targets
          </Text>
          {targets.map((row) => (
            <div key={row.id} className="flex items-center gap-small">
              <input
                className={fieldClass}
                list="skin-slots"
                value={row.slot}
                aria-label="Target slot"
                onChange={(event) =>
                  setTargets((current) => current.map((item) => (item.id === row.id ? { ...item, slot: event.target.value } : item)))
                }
              />
              <input
                className={fieldClass}
                value={row.className}
                aria-label={`${row.slot} classes`}
                onChange={(event) =>
                  setTargets((current) => current.map((item) => (item.id === row.id ? { ...item, className: event.target.value } : item)))
                }
              />
              <Button
                type="button"
                size="small"
                variant="secondary"
                onClick={() => setTargets((current) => current.filter((item) => item.id !== row.id))}
              >
                Remove
              </Button>
            </div>
          ))}
          <datalist id="skin-slots">
            {SKIN_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </datalist>
          <Button
            type="button"
            size="small"
            variant="outline"
            onClick={() => {
              rowId.current += 1;
              setTargets((current) => [...current, { id: `target-new-${rowId.current}`, slot: "surface.root", className: "" }]);
            }}
          >
            Add target
          </Button>
        </section>

        <section className="flex flex-col gap-small">
          <Text as="h2" variant="mid">
            Layers
          </Text>
          <select
            className={fieldClass}
            value={layerSlot}
            aria-label="Layer slot"
            onChange={(event) => setLayerSlot(event.target.value)}
          >
            {LAYER_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {(["before", "after", "wrapper", "content"] as const).map((place) => (
            <div key={place} className="flex flex-col gap-xsmall">
              <Label className="text-small text-muted">{place}</Label>
              <input
                className={fieldClass}
                value={layerClass(activeLayers, place)}
                aria-label={`${layerSlot} ${place} class`}
                onChange={(event) => {
                  const nextLayers = {
                    ...layers,
                    [layerSlot]: withLayerClass(activeLayers, place, event.target.value),
                  };
                  setLayers(nextLayers);
                  setJsonText(JSON.stringify(nextLayers, null, 2));
                }}
              />
            </div>
          ))}
          <Label className="text-small text-muted">JSON</Label>
          <textarea
            className={cn(fieldClass, "min-h-32 font-mono")}
            value={jsonText}
            aria-label="layersDeclarative JSON"
            onChange={(event) => setJsonText(event.target.value)}
          />
          <Button type="button" size="small" variant="outline" onClick={applyJson}>
            Apply JSON
          </Button>
          {jsonError ? (
            <Text as="p" variant="small" className="text-danger">
              {jsonError}
            </Text>
          ) : null}
        </section>

        {parsed.ok ? null : (
          <ul className="flex flex-col gap-xsmall">
            {parsed.errors.map((error) => (
              <li key={error}>
                <Text as="span" variant="small" className="text-danger">
                  {error}
                </Text>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-small">
          <Button type="button" size="small" onClick={() => download(`${draft.name}.json`, skinToJson(preview))}>
            JSON
          </Button>
          <Button type="button" size="small" variant="secondary" onClick={() => download(`${draft.name}.css`, renderSkinStylesheet(preview))}>
            CSS
          </Button>
          <Button type="button" size="small" variant="secondary" onClick={() => void copy("package", renderSkinPackage(preview))}>
            {copied === "package" ? "Copied" : "Copy package"}
          </Button>
          <Button type="button" size="small" variant="outline" onClick={share}>
            {copied === "link" ? "Copied" : "Share link"}
          </Button>
        </div>
      </div>

      <SkinProvider skin={preview} root={portal}>
        <div
          ref={setPortal}
          data-testid="skin-preview"
          className="relative flex min-h-64 flex-col gap-mid overflow-auto rounded-large border-token bg-background p-large"
        >
          <Text as="p" variant="small" className="text-muted">
            Preview stays in this box. Dialog and popover use it as the portal.
          </Text>
          <div className="flex flex-wrap gap-small">
            <Button type="button">Save</Button>
            <Dialog portalContainer={portal}>
              <Dialog.Trigger>Open</Dialog.Trigger>
              <Dialog.Panel>
                <Dialog.Header>
                  <Dialog.HeadingBlock>
                    <Dialog.Title>Inside the preview</Dialog.Title>
                  </Dialog.HeadingBlock>
                  <Dialog.Close />
                </Dialog.Header>
                <Dialog.Body>
                  <Text as="p" variant="base">
                    The panel is portaled into the preview, so it keeps the skin.
                  </Text>
                </Dialog.Body>
              </Dialog.Panel>
            </Dialog>
            <Popover portalContainer={portal}>
              <Popover.Trigger>Hint</Popover.Trigger>
              <Popover.Content>Popover inside the preview</Popover.Content>
            </Popover>
          </div>
          <Card>
            <Card.Header>
              <Card.HeadingBlock>
                <Card.Title>{preview.name}</Card.Title>
                <Card.Description>Card picks up targets and layers.</Card.Description>
              </Card.HeadingBlock>
            </Card.Header>
            <Card.Body>
              <Text as="p" variant="base">
                Foreground on the surface is the pair the validator measures.
              </Text>
            </Card.Body>
          </Card>
        </div>
      </SkinProvider>
    </div>
  );
}
