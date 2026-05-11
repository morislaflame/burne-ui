import { FresnelTorusDemo } from "./FresnelTorusDemo";

export function App() {
  return (
    <div className="relative min-h-[100dvh] bg-background text-foreground">
      <div className="pointer-events-none absolute left-4 top-4 z-10 max-w-[min(90vw,28rem)] rounded-small border border-border/60 bg-surface/85 py-plus px-mid text-sm shadow-lg backdrop-blur-md">
        <p className="font-medium text-foreground">Simple Fresnel Shader</p>
        <p className="mt-1 text-muted">
          Как в{" "}
          <code className="rounded bg-background/80 px-1 py-0.5 text-xs">
            examples/fresnel.html
          </code>{" "}
          репозитория ogl: Renderer, Camera, Orbit, Torus, Program. Тяни мышью по
          канвасу.
        </p>
      </div>

      <FresnelTorusDemo />
    </div>
  );
}
