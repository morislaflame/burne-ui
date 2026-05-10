import { FresnelTorusDemo } from "./FresnelTorusDemo";

export function App() {
  return (
    <div className="relative min-h-[100dvh] bg-brn-bg text-brn-text">
      <div className="pointer-events-none absolute left-4 top-4 z-10 max-w-[min(90vw,28rem)] rounded-md border border-brn-border/60 bg-brn-surface/85 brn-inset-md text-sm shadow-lg backdrop-blur-md">
        <p className="font-medium text-brn-text">Simple Fresnel Shader</p>
        <p className="mt-1 text-brn-muted">
          Как в{" "}
          <code className="rounded bg-brn-bg/80 px-1 py-0.5 text-xs">
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
