import { ColorPickerClassNamesFullDemo } from "../demos/colorPicker/ColorPickerClassNamesFull.demo";
import colorPickerClassNamesFullSource from "../demos/colorPicker/ColorPickerClassNamesFull.demo.tsx?raw";
import { ColorPickerAlphaChannelDemo } from "../demos/colorPicker/ColorPickerAlphaChannel.demo";
import colorPickerAlphaChannelSource from "../demos/colorPicker/ColorPickerAlphaChannel.demo.tsx?raw";
import { ColorPickerBasicDemo } from "../demos/colorPicker/ColorPickerBasic.demo";
import colorPickerBasicSource from "../demos/colorPicker/ColorPickerBasic.demo.tsx?raw";
import { ColorPickerSizesDemo } from "../demos/colorPicker/ColorPickerSizes.demo";
import colorPickerSizesSource from "../demos/colorPicker/ColorPickerSizes.demo.tsx?raw";
import { ColorPickerBrandPaletteDemo } from "../demos/colorPicker/ColorPickerBrandPalette.demo";
import colorPickerBrandPaletteSource from "../demos/colorPicker/ColorPickerBrandPalette.demo.tsx?raw";
import { ColorPickerGlossDemo } from "../demos/colorPicker/ColorPickerGloss.demo";
import colorPickerGlossSource from "../demos/colorPicker/ColorPickerGloss.demo.tsx?raw";
import { ColorPickerSettingsRowDemo } from "../demos/colorPicker/ColorPickerSettingsRow.demo";
import colorPickerSettingsRowSource from "../demos/colorPicker/ColorPickerSettingsRow.demo.tsx?raw";
import { ColorPickerSidesDemo } from "../demos/colorPicker/ColorPickerSides.demo";
import colorPickerSidesSource from "../demos/colorPicker/ColorPickerSides.demo.tsx?raw";
import { ColorSlidersDemo } from "../demos/colorPicker/ColorSliders.demo";
import colorSlidersSource from "../demos/colorPicker/ColorSliders.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function ColorPickerShowcase() {
  return (
    <ShowcasePage
      title="ColorPicker"
      description="Выбор цвета через popover и отдельные слайдеры каналов."
      importPath='import { ColorPicker, ColorSwatch } from "@/components/core/ColorPicker";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection title="ColorPicker" description="Trigger + Content — compound popover.">
        <ShowcaseDemoFromFile Demo={ColorPickerBasicDemo} source={colorPickerBasicSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размеры" description="size: small, base, mid.">
        <ShowcaseDemoFromFile Demo={ColorPickerSizesDemo} source={colorPickerSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="ColorSlider" description="Отдельные слайдеры Hue и Saturation.">
        <ShowcaseDemoFromFile align="stretch" Demo={ColorSlidersDemo} source={colorSlidersSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — стеклянный trigger и панель.">
        <ShowcaseDemoFromFile Demo={ColorPickerGlossDemo} source={colorPickerGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Кастомизация слотов панели через classNames на root."
      >
        <ShowcaseDemoFromFile
          Demo={ColorPickerClassNamesFullDemo}
          source={colorPickerClassNamesFullSource}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Размещение" description="side: top, right, bottom, left.">
        <ShowcaseDemoFromFile Demo={ColorPickerSidesDemo} source={colorPickerSidesSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Брендовая палитра, альфа-канал и строка настроек — `demos/colorPicker/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={ColorPickerBrandPaletteDemo} source={colorPickerBrandPaletteSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ColorPickerAlphaChannelDemo} source={colorPickerAlphaChannelSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ColorPickerSettingsRowDemo} source={colorPickerSettingsRowSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/ColorPicker" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="ColorPicker.Trigger и ColorPicker.Content. ColorSlider и ColorSwatch — отдельные примитивы."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="content, contentPanel, trigger, area, slidersRow, hexInput, presets и др."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Формат">
          <p>
            Значение — hex-строка (<code>#rrggbb</code>). <code>hsvaToHex</code> для конвертации из HSVA.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
