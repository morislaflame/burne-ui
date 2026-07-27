import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Label } from "@/components/core/Label";
import { Separator } from "@/components/core/Separator";
import { Switch } from "@/components/core/Switch";
import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

import { COLOR_LABELS, FONT_WEIGHT_DEFAULTS, FONT_WEIGHT_LABELS, MOTION_DEFAULTS, SCALE_DEFAULTS, STATUS_FOREGROUND_LABELS, type ThemeColorKey, type ThemeFontWeightKey, type ThemeStatusForegroundKey } from "./themeDefaults";
import { FONT_PRESETS, MONO_FONT_PRESETS } from "./themePresets";
import { buildTintValue, parseTintValue, TINT_MIX_MODE_LABELS, type ParsedTint, type TintMixMode } from "./tintMix";
import type { ThemeTokensApi } from "./useThemeTokens";

const TINT_COLOR_KEYS = new Set<ThemeColorKey>(["primaryTint", "primaryTintStrong"]);

const FONT_WEIGHT_OPTIONS = [300, 400, 500, 600, 700, 800] as const;

const TINT_DEFAULT_PERCENT: Record<"primaryTint" | "primaryTintStrong", number> = {
  primaryTint: 20,
  primaryTintStrong: 25,
};

const COLOR_GROUPS: { label: string; keys: ThemeColorKey[] }[] = [
  {
    label: "surface tokens",
    keys: [
      "background",
      "surface",
      "secondary",
      "secondaryForeground",
      "tertiary",
      "tertiaryForeground",
    ],
  },
  {
    label: "content tokens",
    keys: ["foreground", "muted", "border"],
  },
  {
    label: "primary tokens",
    keys: [
      "primary",
      "primaryForeground",
      "primaryTint",
      "primaryTintStrong",
      "indicator",
      "indicatorForeground",
    ],
  },
  {
    label: "focus ring tokens",
    keys: [
      "focusRing",
      "focusRingDanger",
      "focusRingSuccess",
      "focusRingInfo",
      "focusRingWarning",
    ],
  },
  {
    label: "status tokens",
    keys: ["danger", "success", "info", "warning"],
  },
  {
    label: "hover tokens",
    keys: [
      "primaryHover",
      "defaultHover",
      "secondaryHover",
      "tertiaryHover",
      "surfaceTintDanger",
      "surfaceTintDangerHover",
      "dangerFillHover",
      "surfaceTintSuccess",
      "surfaceTintSuccessHover",
      "successFillHover",
      "surfaceTintInfo",
      "surfaceTintInfoHover",
      "infoFillHover",
      "surfaceTintWarning",
      "surfaceTintWarningHover",
      "warningFillHover",
    ],
  },
  {
    label: "ripple tokens",
    keys: [
      "convergeRipplePrimaryFill",
      "convergeRippleNeutral",
      "convergeRippleNeutralMuted",
      "convergeRippleDanger",
      "convergeRippleSuccess",
      "convergeRippleInfo",
      "convergeRippleWarning",
    ],
  },
];

const STATUS_FOREGROUND_KEYS = Object.keys(
  STATUS_FOREGROUND_LABELS,
) as ThemeStatusForegroundKey[];

function SectionTitle({ children }: { children: string }) {
  return (
    <Text as="span" variant="base" className="font-w-mid">
      {children}
    </Text>
  );
}

function ScaleControl({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-small">
      <div className="flex items-center justify-between gap-small">
        <Label className="text-small text-muted">{label}</Label>
        <Text as="span" variant="xsmall" className="tabular-nums text-muted">
          {value.toFixed(step < 0.05 ? 2 : step < 1 ? 1 : 0)}
          {unit}
        </Text>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer accent-primary"
      />
    </div>
  );
}

function ColorControl({
  label,
  value,
  onChange,
  previewBackground,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** When `value` — formula, preview via CSS var (For example `var(--color-border)`). */
  previewBackground?: string;
}) {
  const isHex = /^#[0-9a-f]{6}$/i.test(value.trim());
  const pickerValue = isHex ? value.trim() : "#000000";
  const preview = previewBackground ?? value;

  return (
    <div className="flex flex-col gap-small">
      <Label className="text-small text-muted">{label}</Label>
      <div className="flex items-center gap-small">
        <div
          className="size-8 shrink-0 rounded-small border-token"
          style={{ background: preview }}
          title="preview"
        />
        {isHex ? (
          <input
            type="color"
            value={pickerValue}
            onChange={(e) => onChange(e.target.value)}
            aria-label={`${label} — picker`}
            className="size-8 shrink-0 cursor-pointer rounded-small bg-transparent p-0.5"
          />
        ) : null}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`${label} — CSS`}
          className={cn(
            "min-w-0 flex-1 rounded-base border-token bg-surface px-small py-xsmall font-mono text-xsmall text-foreground outline-none",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          )}
        />
      </div>
    </div>
  );
}

function TintColorControl({
  label,
  value,
  defaultPercent,
  onChange,
}: {
  label: string;
  value: string;
  defaultPercent: number;
  onChange: (value: string) => void;
}) {
  const parsed = parseTintValue(value);

  const apply = (patch: Partial<ParsedTint>) => {
    const next: ParsedTint = { ...parsed, ...patch };
    if (patch.mode != null && patch.mode !== "custom" && parsed.mode === "custom") {
      next.percent = defaultPercent;
    }
    onChange(buildTintValue(next));
  };

  const mixColorHex = /^#[0-9a-f]{6}$/i.test(parsed.mixColor) ? parsed.mixColor : "#4361ee";

  return (
    <div className="flex flex-col gap-small rounded-base border-token bg-secondary p-small">
      <div className="flex items-center gap-small">
        <div
          className="size-8 shrink-0 rounded-small border-token"
          style={{ background: value }}
          title="tint preview"
        />
        <Label className="text-small text-muted">{label}</Label>
      </div>

      <select
        value={parsed.mode}
        onChange={(e) => apply({ mode: e.target.value as TintMixMode })}
        aria-label={`${label} — mix mode`}
        className={cn(
          "w-full rounded-base border-token bg-surface px-small py-xsmall text-small text-foreground outline-none",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        )}
      >
        {(Object.keys(TINT_MIX_MODE_LABELS) as TintMixMode[]).map((mode) => (
          <option key={mode} value={mode}>
            {TINT_MIX_MODE_LABELS[mode]}
          </option>
        ))}
      </select>

      {parsed.mode !== "custom" ? (
        <>
          <div className="flex flex-col gap-small">
            <div className="flex items-center justify-between gap-small">
              <Text as="span" variant="xsmall" className="text-muted">mix %</Text>
              <Text as="span" variant="xsmall" className="tabular-nums text-muted">
                {parsed.percent}%
              </Text>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              step={1}
              value={parsed.percent}
              onChange={(e) => apply({ percent: Number(e.target.value) })}
              aria-label={`${label} — mix percent`}
              className="h-2 w-full cursor-pointer accent-primary"
            />
          </div>

          {parsed.mode === "color-surface" ? (
            <div className="flex items-center gap-small">
              <input
                type="color"
                value={mixColorHex}
                onChange={(e) => apply({ mixColor: e.target.value })}
                aria-label={`${label} — mix color`}
                className="size-8 shrink-0 cursor-pointer rounded-small bg-transparent p-0.5"
              />
              <Text as="span" variant="xsmall" className="font-mono text-muted">
                {parsed.mixColor}
              </Text>
            </div>
          ) : null}
        </>
      ) : (
        <input
          type="text"
          value={parsed.custom}
          onChange={(e) => apply({ custom: e.target.value })}
          aria-label={`${label} — custom CSS`}
          className={cn(
            "w-full rounded-base border-token bg-surface px-small py-xsmall font-mono text-xsmall text-foreground outline-none",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          )}
        />
      )}

      <Text as="span" variant="xsmall" className="truncate font-mono text-muted" title={value}>
        {value}
      </Text>
    </div>
  );
}

function FontWeightSelect({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-small">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          "w-full rounded-base border-token bg-surface px-small py-xsmall text-small text-foreground outline-none",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        )}
      >
        {FONT_WEIGHT_OPTIONS.map((weight) => (
          <option key={weight} value={weight}>
            {weight}
          </option>
        ))}
      </select>
    </div>
  );
}

function FontSelect({
  id,
  label,
  value,
  presets,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  presets: readonly { id: string; label: string; value: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-small">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={presets.find((p) => p.value === value)?.id ?? "custom"}
        onChange={(e) => {
          const preset = presets.find((p) => p.id === e.target.value);
          if (preset) onChange(preset.value);
        }}
        className={cn(
          "w-full rounded-base border-token bg-surface px-small py-xsmall text-small text-foreground outline-none",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        )}
      >
        {presets.map((preset) => (
          <option key={preset.id} value={preset.id}>
            {preset.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function SpacingPreview({ space }: { space: number }) {
  const steps = [
    { name: "xsmall", mult: 0.5 },
    { name: "small", mult: 0.75 },
    { name: "base", mult: 1 },
    { name: "mid", mult: 2 },
    { name: "large", mult: 2.5 },
  ] as const;

  return (
    <div className="flex items-end gap-xsmall rounded-small border-token bg-background p-small">
      {steps.map(({ name, mult }) => (
        <div key={name} className="flex flex-1 flex-col items-center gap-xsmall">
          <div
            className="w-full rounded-xsmall bg-primary/30"
            style={{ height: `${space * mult * 16}px` }}
            title={`--space-${name}`}
          />
          <Text as="span" variant="xsmall" className="text-muted">
            {name}
          </Text>
        </div>
      ))}
    </div>
  );
}

export function ThemeControls({ tokens }: { tokens: ThemeTokensApi }) {
  const {
    state,
    setTheme,
    setScale,
    setFontFamily,
    setFontFamilyMono,
    setFontWeight,
    setShadowStrength,
    setShadowSize,
    setToastScrimSize,
    setToastScrimDensity,
    setMotionDuration,
    setAnimationFlag,
    setColor,
    setStatusForeground,
    applyColorPreset,
    applyLayoutPreset,
    reset,
    copyCss,
  } = tokens;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyCss();
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-large">
      <div>
        <Text as="h2" variant="header-2">
          Theme tokens
        </Text>
        <Text as="p" variant="small" className="mt-xsmall text-muted">
          Change CSS-variables on <code className="text-primary">:root</code> — preview on the right
          updated immediately.
        </Text>
      </div>

      <div className="flex flex-col gap-small">
        <Text as="span" variant="small" className="text-muted">
          Color presets
        </Text>
        <div className="flex flex-wrap gap-xsmall">
          {(
            [
              { id: "default", label: "Default" },
              { id: "contrast", label: "Contrast" },
              { id: "ocean", label: "Ocean" },
              { id: "violet", label: "Violet" },
              { id: "emerald", label: "Emerald" },
              { id: "rose", label: "Rose" },
              { id: "amber", label: "Amber" },
              { id: "slate", label: "Slate" },
              { id: "toffee", label: "Toffee" },
              { id: "berry", label: "Berry" },
              { id: "paprika", label: "Paprika" },
              { id: "cherry", label: "Cherry" },
              { id: "rustic", label: "Rustic" },
              { id: "earthy", label: "Earthy" },
              { id: "peach", label: "Peach" },
              { id: "sand", label: "Sand" },
              { id: "bold", label: "Bold" },
              { id: "autumn", label: "Autumn" },
              { id: "dreamland", label: "Dreamland" },
              { id: "harvest", label: "Harvest" },
              { id: "mystic", label: "Mystic" },
              { id: "lavender", label: "Lavender" },
            ] as const
          ).map(({ id, label }) => (
            <Button
              key={id}
              type="button"
              size="small"
              variant="outline"
              onClick={() => applyColorPreset(id)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-small">
        <Text as="span" variant="small" className="text-muted">
          Layout
        </Text>
        <div className="flex flex-wrap gap-xsmall">
          <Button type="button" size="small" variant="outline" onClick={() => applyLayoutPreset("compact")}>
            Compact
          </Button>
          <Button type="button" size="small" variant="outline" onClick={() => applyLayoutPreset("spacious")}>
            Spacious
          </Button>
          <Button type="button" size="small" variant="outline" onClick={() => applyLayoutPreset("flat")}>
            Flat
          </Button>
          <Button type="button" size="small" variant="ghost" onClick={reset}>
            Reset
          </Button>
          <Button type="button" size="small" variant="secondary" onClick={handleCopy}>
            {copied ? "Copied" : "Copy CSS"}
          </Button>
        </div>
      </div>

      <Separator />

      <Switch
        checked={state.theme === "light"}
        onChange={(e) => setTheme(e.target.checked ? "light" : "dark")}
        label="Light theme"
        hint={
          state.colorPreset
            ? `Preset «${state.colorPreset}» — ${state.theme}`
            : "Custom colors"
        }
      />

      <div className="flex flex-col gap-small">
        <SectionTitle>Scale</SectionTitle>
        <ScaleControl
          label="--space"
          value={state.space}
          min={0.3}
          max={0.8}
          step={0.025}
          unit="rem"
          onChange={(v) => setScale("space", v)}
        />
        <SpacingPreview space={state.space} />
        <ScaleControl
          label="--size"
          value={state.size}
          min={0.8}
          max={1.25}
          step={0.025}
          unit="rem"
          onChange={(v) => setScale("size", v)}
        />
        <ScaleControl
          label="--radius"
          value={state.radius}
          min={0}
          max={1}
          step={0.025}
          unit="rem"
          onChange={(v) => setScale("radius", v)}
        />
        <ScaleControl
          label="--border-width"
          value={state.borderWidth}
          min={0}
          max={3}
          step={0.5}
          unit="px"
          onChange={(v) => setScale("borderWidth", v)}
        />
        <ScaleControl
          label="--focus-ring-width"
          value={state.focusRingWidth}
          min={0}
          max={3}
          step={0.5}
          unit="px"
          onChange={(v) => setScale("focusRingWidth", v)}
        />
        <ScaleControl
          label="--focus-ring-offset"
          value={state.focusRingOffset}
          min={0}
          max={6}
          step={1}
          unit="px"
          onChange={(v) => setScale("focusRingOffset", v)}
        />
        <ScaleControl
          label="--text-scale (multiplier)"
          value={state.textScale}
          min={0.85}
          max={1.2}
          step={0.025}
          unit="×"
          onChange={(v) => setScale("textScale", v)}
        />
        <Button
          type="button"
          size="small"
          variant="ghost"
          className="self-start text-muted"
          onClick={() => {
            setScale("space", SCALE_DEFAULTS.space);
            setScale("size", SCALE_DEFAULTS.size);
            setScale("radius", SCALE_DEFAULTS.radius);
            setScale("borderWidth", SCALE_DEFAULTS.borderWidth);
            setScale("focusRingWidth", SCALE_DEFAULTS.focusRingWidth);
            setScale("focusRingOffset", SCALE_DEFAULTS.focusRingOffset);
            setScale("textScale", SCALE_DEFAULTS.textScale);
          }}
        >
          Default scale
        </Button>
      </div>

      <Separator />

      <div className="flex flex-col gap-small">
        <SectionTitle>Fonts</SectionTitle>
        <FontSelect
          id="theme-font-sans"
          label="Sans (--font-family-sans)"
          value={state.fontFamily}
          presets={FONT_PRESETS}
          onChange={setFontFamily}
        />
        <FontSelect
          id="theme-font-mono"
          label="Mono (--font-family-mono)"
          value={state.fontFamilyMono}
          presets={MONO_FONT_PRESETS}
          onChange={setFontFamilyMono}
        />
        <Text as="p" variant="xsmall" className="rounded-small border-token bg-background p-small text-muted">
          <span className="font-sans">Aa Bb 123 — sans</span>
          <br />
          <span className="font-mono">{`{ code: true }`}</span>
        </Text>
      </div>

      <div className="flex flex-col gap-small">
        <SectionTitle>Typeface</SectionTitle>
        {(Object.keys(FONT_WEIGHT_LABELS) as ThemeFontWeightKey[]).map((key) => (
          <FontWeightSelect
            key={key}
            id={`theme-font-weight-${key}`}
            label={FONT_WEIGHT_LABELS[key]}
            value={state.fontWeights[key]}
            onChange={(value) => setFontWeight(key, value)}
          />
        ))}
        <Text as="p" variant="xsmall" className="rounded-small border-token bg-background p-small text-muted">
          <span className="font-w-small">Small — small and official text</span>
          <br />
          <span className="font-w-base">Base — main text</span>
          <br />
          <span className="font-w-mid">Mid — controls</span>
          <br />
          <span className="font-w-strong">Strong — headers</span>
          <br />
          <span className="font-w-bold">Bold — accent</span>
        </Text>
        <Button
          type="button"
          size="small"
          variant="ghost"
          className="self-start text-muted"
          onClick={() => {
            (Object.keys(FONT_WEIGHT_DEFAULTS) as ThemeFontWeightKey[]).forEach((key) => {
              setFontWeight(key, FONT_WEIGHT_DEFAULTS[key]);
            });
          }}
        >
          Default style
        </Button>
      </div>

      <Separator />

      <div className="flex flex-col gap-small">
        <SectionTitle>Motion (GSAP)</SectionTitle>
        <ScaleControl
          label="interactiveDuration"
          value={state.interactiveDuration}
          min={120}
          max={600}
          step={10}
          unit="ms"
          onChange={(v) => setMotionDuration("interactiveDuration", v)}
        />
        <ScaleControl
          label="pressSqueezeDurationFactor"
          value={state.pressSqueezeDurationFactor}
          min={1}
          max={2}
          step={0.05}
          unit="×"
          onChange={(v) => setMotionDuration("pressSqueezeDurationFactor", v)}
        />
        <ScaleControl
          label="modalDuration"
          value={state.modalDuration}
          min={120}
          max={600}
          step={10}
          unit="ms"
          onChange={(v) => setMotionDuration("modalDuration", v)}
        />
        <ScaleControl
          label="tooltipDuration"
          value={state.tooltipDuration}
          min={80}
          max={400}
          step={10}
          unit="ms"
          onChange={(v) => setMotionDuration("tooltipDuration", v)}
        />
        <ScaleControl
          label="expandDuration"
          value={state.expandDuration}
          min={200}
          max={800}
          step={10}
          unit="ms"
          onChange={(v) => setMotionDuration("expandDuration", v)}
        />
        <ScaleControl
          label="progressFillDuration"
          value={state.progressFillDuration}
          min={120}
          max={1200}
          step={10}
          unit="ms"
          onChange={(v) => setMotionDuration("progressFillDuration", v)}
        />
        <ScaleControl
          label="progressIndeterminateDuration"
          value={state.progressIndeterminateDuration}
          min={400}
          max={3000}
          step={50}
          unit="ms"
          onChange={(v) => setMotionDuration("progressIndeterminateDuration", v)}
        />
        <ScaleControl
          label="loadingDotsDuration"
          value={state.loadingDotsDuration}
          min={300}
          max={2400}
          step={50}
          unit="ms"
          onChange={(v) => setMotionDuration("loadingDotsDuration", v)}
        />
        <ScaleControl
          label="surfaceTransitionDuration (CSS)"
          value={state.surfaceTransitionDuration}
          min={120}
          max={1200}
          step={20}
          unit="ms"
          onChange={(v) => setMotionDuration("surfaceTransitionDuration", v)}
        />
        <ScaleControl
          label="toastDismissDuration"
          value={state.toastDismissDuration}
          min={80}
          max={600}
          step={10}
          unit="ms"
          onChange={(v) => setMotionDuration("toastDismissDuration", v)}
        />
        <Button
          type="button"
          size="small"
          variant="ghost"
          className="self-start text-muted"
          onClick={() => {
            setMotionDuration("interactiveDuration", MOTION_DEFAULTS.interactiveDuration);
            setMotionDuration(
              "pressSqueezeDurationFactor",
              MOTION_DEFAULTS.pressSqueezeDurationFactor,
            );
            setMotionDuration("modalDuration", MOTION_DEFAULTS.modalDuration);
            setMotionDuration("tooltipDuration", MOTION_DEFAULTS.tooltipDuration);
            setMotionDuration("expandDuration", MOTION_DEFAULTS.expandDuration);
            setMotionDuration("progressFillDuration", MOTION_DEFAULTS.progressFillDuration);
            setMotionDuration(
              "progressIndeterminateDuration",
              MOTION_DEFAULTS.progressIndeterminateDuration,
            );
            setMotionDuration("loadingDotsDuration", MOTION_DEFAULTS.loadingDotsDuration);
            setMotionDuration("surfaceTransitionDuration", MOTION_DEFAULTS.surfaceTransitionDuration);
            setMotionDuration("toastDismissDuration", MOTION_DEFAULTS.toastDismissDuration);
          }}
        >
          Motion default
        </Button>
      </div>

      <Separator />

      <div className="flex flex-col gap-small">
        <SectionTitle>Shadows and glass</SectionTitle>
        <ScaleControl
          label="Shadow intensity (opacity)"
          value={state.shadowStrength}
          min={0.5}
          max={1.75}
          step={0.05}
          unit="×"
          onChange={setShadowStrength}
        />
        <ScaleControl
          label="--shadow-size (blur / offset)"
          value={state.shadowSize}
          min={0.5}
          max={2}
          step={0.05}
          unit="×"
          onChange={setShadowSize}
        />
        <ScaleControl
          label="--toast-scrim-size (substrate size Toast)"
          value={state.toastScrimSize}
          min={0.5}
          max={2}
          step={0.05}
          unit="×"
          onChange={setToastScrimSize}
        />
        <ScaleControl
          label="--toast-scrim-density (substrate density Toast)"
          value={state.toastScrimDensity}
          min={0}
          max={2}
          step={0.05}
          unit="×"
          onChange={setToastScrimDensity}
        />
        <div className="flex gap-small">
          {(["sm", "md", "lg"] as const).map((level) => (
            <div
              key={level}
              className="flex flex-1 flex-col items-center gap-xsmall rounded-small border-token bg-surface p-small"
              style={{ boxShadow: `var(--shadow-${level})` }}
            >
              <Text as="span" variant="xsmall" className="text-muted">
                {level}
              </Text>
            </div>
          ))}
        </div>
        <Button
          type="button"
          size="small"
          variant="ghost"
          className="self-start text-muted"
          onClick={() => {
            setShadowStrength(SCALE_DEFAULTS.shadowStrength);
            setShadowSize(SCALE_DEFAULTS.shadowSize);
            setToastScrimSize(SCALE_DEFAULTS.toastScrimSize);
            setToastScrimDensity(SCALE_DEFAULTS.toastScrimDensity);
          }}
        >
          Default shadows
        </Button>
      </div>

      <Separator />

      <div className="flex flex-col gap-small">
        <SectionTitle>Animations</SectionTitle>
        <div className="flex flex-col gap-small rounded-base border-token bg-secondary p-small">
          <Switch
            checked={state.enableAnimations}
            onChange={(e) => setAnimationFlag("enableAnimations", e.target.checked)}
            label="Enable all animations (master)"
          />
          <Separator className="my-xsmall opacity-50" />
          <Switch
            checked={state.enableHoverLift}
            onChange={(e) => setAnimationFlag("enableHoverLift", e.target.checked)}
            label="Hover Lift (rise on hover)"
          />
          <Switch
            checked={state.enablePressSqueeze}
            onChange={(e) => setAnimationFlag("enablePressSqueeze", e.target.checked)}
            label="Press Squeeze (compression on click)"
          />
          <Switch
            checked={state.enableToggleButtonFill}
            onChange={(e) => setAnimationFlag("enableToggleButtonFill", e.target.checked)}
            label="Toggle & Calendar Fill (filling)"
          />
          <Switch
            checked={state.enableRipple}
            onChange={(e) => setAnimationFlag("enableRipple", e.target.checked)}
            label="Press Ripple (ripple waves)"
          />
          <Switch
            checked={state.enableExpandable}
            onChange={(e) => setAnimationFlag("enableExpandable", e.target.checked)}
            label="Expandable / Accordion"
          />
          <Switch
            checked={state.enableToastStack}
            onChange={(e) => setAnimationFlag("enableToastStack", e.target.checked)}
            label="Toast stack"
          />
          <Switch
            checked={state.enableAsyncButtonCrossfade}
            onChange={(e) => setAnimationFlag("enableAsyncButtonCrossfade", e.target.checked)}
            label="Button async crossfade"
          />
          <Switch
            checked={state.enableContentFade}
            onChange={(e) => setAnimationFlag("enableContentFade", e.target.checked)}
            label="Content fade (Avatar etc..)"
          />
          <Switch
            checked={state.enableFeedbackExpand}
            onChange={(e) => setAnimationFlag("enableFeedbackExpand", e.target.checked)}
            label="Button feedback ring"
          />
          <Switch
            checked={state.enableProgressFill}
            onChange={(e) => setAnimationFlag("enableProgressFill", e.target.checked)}
            label="ProgressBar fill (smooth filling)"
          />
          <Switch
            checked={state.enableLoadingDots}
            onChange={(e) => setAnimationFlag("enableLoadingDots", e.target.checked)}
            label="Loading dots wave"
          />
          <Switch
            checked={state.enableModalMotion}
            onChange={(e) => setAnimationFlag("enableModalMotion", e.target.checked)}
            label="Modal / Drawer"
          />
          <Switch
            checked={state.enableSwitchThumb}
            onChange={(e) => setAnimationFlag("enableSwitchThumb", e.target.checked)}
            label="Switch thumb"
          />
          <Switch
            checked={state.enableTabsIndicator}
            onChange={(e) => setAnimationFlag("enableTabsIndicator", e.target.checked)}
            label="Tabs indicator"
          />
          <Switch
            checked={state.enablePaginationFlip}
            onChange={(e) => setAnimationFlag("enablePaginationFlip", e.target.checked)}
            label="Pagination FLIP"
          />
          <Switch
            checked={state.enableSelectionFill}
            onChange={(e) => setAnimationFlag("enableSelectionFill", e.target.checked)}
            label="Selection indicator fill"
          />
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-small">
        <SectionTitle>Colors</SectionTitle>
        <div className="flex flex-col gap-small">
          {COLOR_GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-small">
              <Text as="span" variant="small" className="text-muted">
                {group.label}
              </Text>
              {group.keys.map((key) =>
                TINT_COLOR_KEYS.has(key) ? (
                  <TintColorControl
                    key={key}
                    label={COLOR_LABELS[key]}
                    value={state.colors[key]}
                    defaultPercent={TINT_DEFAULT_PERCENT[key as "primaryTint" | "primaryTintStrong"]}
                    onChange={(value) => setColor(key, value)}
                  />
                ) : (
                  <ColorControl
                    key={key}
                    label={COLOR_LABELS[key]}
                    value={state.colors[key]}
                    onChange={(value) => setColor(key, value)}
                  />
                ),
              )}
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-small">
        <SectionTitle>Status foreground</SectionTitle>
        <div className="flex flex-col gap-small">
          {STATUS_FOREGROUND_KEYS.map((key) => (
            <ColorControl
              key={key}
              label={STATUS_FOREGROUND_LABELS[key]}
              value={state.colors[key]}
              onChange={(value) => setStatusForeground(key, value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
