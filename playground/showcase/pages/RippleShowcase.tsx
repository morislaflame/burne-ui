import { RippleColorTilesDemo } from "../demos/ripple/RippleColorTiles.demo";
import rippleColorTilesSource from "../demos/ripple/RippleColorTiles.demo.tsx?raw";
import { RippleColorsDemo } from "../demos/ripple/RippleColors.demo";
import rippleColorsSource from "../demos/ripple/RippleColors.demo.tsx?raw";
import { RippleCustomLayerDemo } from "../demos/ripple/RippleCustomLayer.demo";
import rippleCustomLayerSource from "../demos/ripple/RippleCustomLayer.demo.tsx?raw";
import { RipplePressableCardDemo } from "../demos/ripple/RipplePressableCard.demo";
import ripplePressableCardSource from "../demos/ripple/RipplePressableCard.demo.tsx?raw";
import { RipplePromoBannerDemo } from "../demos/ripple/RipplePromoBanner.demo";
import ripplePromoBannerSource from "../demos/ripple/RipplePromoBanner.demo.tsx?raw";
import { RippleSurfaceOutDemo } from "../demos/ripple/RippleSurfaceOut.demo";
import rippleSurfaceOutSource from "../demos/ripple/RippleSurfaceOut.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function RippleShowcase() {
  return (
    <ShowcasePage
      title="Ripple"
      description="Converge-ripple от точки нажатия: отдельный слой или внутри pressable-поверхностей."
      importPath='import { Ripple } from "@/components/core/Ripple";'
      tags={["core", "motion"]}
    >
      <ShowcaseSection
        title="Кастомный слой"
        description="Ripple поверх контейнера; интерактивный элемент — поверх слоя (z-index)."
      >
        <ShowcaseDemoFromFile Demo={RippleCustomLayerDemo} source={rippleCustomLayerSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Цвета" description="color из RIPPLE_COLOR или произвольная CSS-строка.">
        <ShowcaseDemoFromFile Demo={RippleColorsDemo} source={rippleColorsSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Pressable Card"
        description="Ripple на всю карточку; клик по контенту всплывает к pressable-корню."
      >
        <ShowcaseDemoFromFile Demo={RipplePressableCardDemo} source={ripplePressableCardSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Сетки, баннеры и Surface — исходники в `demos/ripple/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={RippleColorTilesDemo} source={rippleColorTilesSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={RipplePromoBannerDemo} source={ripplePromoBannerSource} />
        <ShowcaseDemoFromFile Demo={RippleSurfaceOutDemo} source={rippleSurfaceOutSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Ripple" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="color (ключ RIPPLE_COLOR или CSS), direction in|out, duration, disabled."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Связь с Button">
          <p>
            На <code>Button</code> достаточно пропа <code>ripple</code>. Для ручного слоя —{" "}
            <code>buttonRippleTone(variant, status)</code> из пакета или константы <code>RIPPLE_COLOR</code>.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization>
          <p>
            Контейнер с <code>overflow-hidden</code> и <code>position: relative</code>. Длительность и easing —{" "}
            <code>configureMotion()</code> (<code>rippleDefaultDuration</code>, <code>rippleEaseCss</code>,{" "}
            <code>enableRipple</code>). Тон кнопки — <code>buttonRippleTone</code> из пакета.
          </p>
        </ShowcaseDoc.Customization>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
