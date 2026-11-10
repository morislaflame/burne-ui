import { fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AlertDialog } from "@/components/composite/AlertDialog";
import { ButtonGroup } from "@/components/composite/ButtonGroup";
import { ToggleButtonGroup } from "@/components/composite/ToggleButtonGroup";
import { Button } from "@/components/core/Button";
import { Disclosure } from "@/components/core/Disclosure";
import { Dropdown } from "@/components/core/Dropdown";
import { Header } from "@/components/core/Header";
import { ListBox } from "@/components/core/ListBox";
import { Popover } from "@/components/core/Popover";
import { Select } from "@/components/core/Select";
import { SelectionThumb } from "@/components/core/SelectionThumb";
import { ToggleButton } from "@/components/core/ToggleButton";
import { MOTION_CONFIG_DEFAULTS, type MotionConfig } from "@/components/core/utils/motionConfig";
import { MOTION_CONFIG_LIMITS } from "@/components/core/utils/motionConfigValidation";
import { isContainedPortal } from "@/components/core/utils/portalContainer";
import { KIT_MOTION_RECIPE_META } from "@/components/core/utils/slotMotion/kitMotionRecipeMeta";
import { createDefaultThemeState } from "@/theme/themeDefaults";
import { resolveThemeTokenState, themeTokenStateToConfig } from "@/theme/themeConfig";

import { rgbToOklch } from "../../cli/skin-color.mjs";
import { render } from "../__tests__/helpers";
import { contrastRatio, designToSkin, parseCssColor } from "./designDocument";
import type { DesignDocument } from "./designDocument";
import { playForceStateMotion } from "./forceState";
import { paletteFromBrand } from "./paletteFromBrand";
import { findMotionController } from "./studioNodes";
import { StudioModeProvider } from "./studioMode";
import { themeTokenSchemaEntry } from "./themeTokenSchema";

function hueDistance(left: number, right: number): number {
  const delta = Math.abs(left - right) % 360;
  return Math.min(delta, 360 - delta);
}

function slotTree() {
  return (
    <>
      <Header>Top</Header>
      <ListBox aria-label="Options">
        <ListBox.Item value="a">A</ListBox.Item>
      </ListBox>
      <ButtonGroup aria-label="Actions">
        <Button>One</Button>
      </ButtonGroup>
      <ToggleButtonGroup aria-label="View">
        <ToggleButton value="grid">Grid</ToggleButton>
      </ToggleButtonGroup>
      <SelectionThumb>
        <SelectionThumb.Icon />
      </SelectionThumb>
      <Disclosure.Group>
        <Disclosure defaultOpen>
          <Disclosure.Trigger>Section</Disclosure.Trigger>
          <Disclosure.Content>Body</Disclosure.Content>
        </Disclosure>
      </Disclosure.Group>
      <Popover defaultOpen>
        <Popover.Trigger>Open note</Popover.Trigger>
        <Popover.Content>Note</Popover.Content>
      </Popover>
      <AlertDialog open>
        <AlertDialog.Panel>
          <AlertDialog.Title>Delete item?</AlertDialog.Title>
        </AlertDialog.Panel>
      </AlertDialog>
      <Dropdown open>
        <Dropdown.Trigger>Menu</Dropdown.Trigger>
        <Dropdown.Popover>
          <Dropdown.Sub>
            <Dropdown.SubTrigger>More</Dropdown.SubTrigger>
            <Dropdown.SubPopover>
              <Dropdown.Item value="email">Email</Dropdown.Item>
            </Dropdown.SubPopover>
          </Dropdown.Sub>
        </Dropdown.Popover>
      </Dropdown>
    </>
  );
}

const MARKED_SLOTS = [
  "header.root",
  "listBox.root",
  "buttonGroup.root",
  "toggleButtonGroup.root",
  "selectionThumb.icon",
  "selectionThumbIcon.root",
  "disclosure.group",
  "disclosure.trigger",
  "disclosure.contentWrap",
  "popover.content",
  "popover.panel",
  "alertDialog.panel",
  "dropdown.subPopover",
] as const;

describe("studio model", () => {
  it("keeps the hard duration clamp and narrows the studio slider", () => {
    expect(MOTION_CONFIG_LIMITS.durationMs).toEqual({ min: 0, max: 60000 });
    expect(themeTokenSchemaEntry("interactiveDuration")?.max).toBe(2000);
    expect(themeTokenSchemaEntry("progressIndeterminateDuration")?.max).toBe(4000);
    expect(themeTokenSchemaEntry("loadingDotsDuration")?.max).toBe(4000);
  });

  it("fills both palettes and motion when resolving a theme config", () => {
    const state = resolveThemeTokenState({
      colors: {
        dark: { primary: "#111111" },
        light: { primary: "#eeeeee" },
      },
      motion: { interactiveDuration: 123 },
    }, "dark");
    expect(state.colors.primary).toBe("#111111");
    expect(state.modePalettes.dark.primary).toBe("#111111");
    expect(state.modePalettes.light.primary).toBe("#eeeeee");
    expect(state.interactiveDuration).toBe(123);
  });

  it("maps press squeeze through normalize and skips NaN", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const state = resolveThemeTokenState({
      motion: { pressSqueezeScale: [1, 0.9, 1], interactiveDuration: Number.NaN },
    }, "dark");
    expect(state.pressSqueezeMid).toBe(0.9);
    expect(state.interactiveDuration).toBe(createDefaultThemeState("dark").interactiveDuration);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("round-trips every motion key", () => {
    const motion: Partial<MotionConfig> = {};
    for (const [key, value] of Object.entries(MOTION_CONFIG_DEFAULTS) as [keyof MotionConfig, MotionConfig[keyof MotionConfig]][]) {
      if (typeof value === "number") {
        const next = Number.isInteger(value)
          ? (value > 0 ? value - 1 : value + 1)
          : Math.round((value + 0.01) * 1000) / 1000;
        (motion as Record<string, unknown>)[key] = next;
      } else if (typeof value === "boolean") {
        (motion as Record<string, unknown>)[key] = !value;
      } else if (typeof value === "string") {
        (motion as Record<string, unknown>)[key] = key === "rippleEaseCss"
          ? "cubic-bezier(0.2, 0, 0, 1)"
          : (value === "power1.out" ? "power2.out" : "power1.out");
      } else if (Array.isArray(value)) {
        (motion as Record<string, unknown>)[key] = [1, 0.9, 1];
      }
    }
    const back = themeTokenStateToConfig(resolveThemeTokenState({ motion }, "dark")).motion ?? {};
    expect(back).toEqual(motion);
  });

  it("keeps motion.config arrays on design → skin", () => {
    const base = createDefaultThemeState("dark");
    const { theme: _theme, colors: _colors, modePalettes, ...rest } = base;
    const design: DesignDocument = {
      version: 1,
      name: "paper",
      theme: {
        ...rest,
        colors: { dark: { ...modePalettes.dark }, light: { ...modePalettes.light } },
      },
      skin: {
        name: "paper",
        motion: { config: { pressSqueezeScale: [1, 0.96, 1] } },
      },
    };
    const skin = designToSkin(design);
    expect(skin.tokens).toBeUndefined();
    expect(skin.tokensLight).toBeUndefined();
    expect(skin.motion?.config).toEqual({ pressSqueezeScale: [1, 0.96, 1] });

    const changed: DesignDocument = {
      ...design,
      skin: undefined,
      theme: {
        ...design.theme,
        interactiveDuration: 321,
        colors: {
          dark: { ...modePalettes.dark, primary: "#123456" },
          light: { ...modePalettes.light },
        },
      },
    };
    const diff = designToSkin(changed);
    expect(diff.tokens).toEqual({ "--color-primary": "#123456" });
    expect(diff.tokensLight).toBeUndefined();
    expect(diff.motion?.config).toEqual({ interactiveDuration: 321 });
  });

  it("builds brand palettes with AA contrast and a stable hue", () => {
    for (const brand of ["#3366ff", "#00ff88", "#ff00aa", "#ff6600", "#00ccff", "#cc44ff"]) {
      const sourceRgb = parseCssColor(brand);
      expect(sourceRgb).toBeTruthy();
      if (!sourceRgb) continue;
      const source = rgbToOklch(sourceRgb[0], sourceRgb[1], sourceRgb[2]);
      const { light, dark } = paletteFromBrand(brand);
      for (const palette of [light, dark]) {
        const primary = parseCssColor(palette.primary);
        const surface = parseCssColor(palette.surface);
        const ink = parseCssColor(palette.primaryForeground);
        expect(primary && surface && contrastRatio(primary, surface)).toBeGreaterThanOrEqual(4.5);
        expect(primary && ink && contrastRatio(ink, primary)).toBeGreaterThanOrEqual(4.5);
        if (!primary) continue;
        const back = rgbToOklch(primary[0], primary[1], primary[2]);
        expect(hueDistance(back.h, source.h)).toBeLessThanOrEqual(5);
      }
    }
  });

  it("labels every kit recipe", () => {
    for (const meta of Object.values(KIT_MOTION_RECIPE_META)) {
      expect(meta.label.en.length).toBeGreaterThan(0);
      expect(meta.label.ru.length).toBeGreaterThan(0);
      expect(meta.phases.length).toBeGreaterThan(0);
      expect(meta.parameters[0]?.max).toBeGreaterThan(0);
      expect(meta.parameters[0]?.unit).toBe("ms");
    }
    expect(KIT_MOTION_RECIPE_META.pressSqueeze.phases).toContain("pressIn");
  });

  it("treats an iframe body as the document body, and a host inside it as contained", () => {
    const host = document.createElement("div");
    document.body.append(host);
    expect(isContainedPortal(host)).toBe(true);
    expect(isContainedPortal(document.body)).toBe(false);
    host.remove();
  });

  it("marks live slots only inside the studio and plays forced hover", () => {
    const plain = render(slotTree());
    fireEvent.pointerEnter(plain.getByText("More"));
    expect(document.querySelector("[data-skin-slot]")).toBeNull();
    plain.unmount();

    const view = render(<StudioModeProvider>{slotTree()}</StudioModeProvider>);
    fireEvent.pointerEnter(view.getByText("More"));
    for (const id of MARKED_SLOTS) {
      expect(document.querySelector(`[data-skin-slot~="${id}"]`), id).toBeTruthy();
    }
    const header = document.querySelector("[data-skin-slot~='header.root']");
    expect(header).toBeInstanceOf(HTMLElement);
    const controller = findMotionController(header as HTMLElement);
    expect(controller).toBeTruthy();
    const played: string[] = [];
    const play = controller!.play.bind(controller);
    controller!.play = (event, options) => {
      played.push(String(event));
      return play(event, options);
    };
    (header as HTMLElement).setAttribute("data-force-state", "hover");
    playForceStateMotion(header as HTMLElement);
    expect(played).toContain("hoverIn");
    view.unmount();
  });

  it("portals a select menu into the given host", () => {
    const host = document.createElement("div");
    document.body.append(host);
    render(
      <Select
        aria-label="Pick"
        open
        portalContainer={host}
        items={[{ value: "a", label: "Alpha" }]}
      />,
    );
    expect(host.querySelector("[role='listbox']")).toBeTruthy();
    host.remove();
  });
});
