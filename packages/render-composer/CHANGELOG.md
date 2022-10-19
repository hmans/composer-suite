# render-composer

## 0.2.7

### Patch Changes

- 4ace8ca: **New:** A first, very basic, very static, very experimental implementation of a `TiltShiftEffect`. Handle with care.

## 0.2.6

### Patch Changes

- 1d74dfc: **New:** `<RC.RenderPass>` now offers three new props, `clearColor`, `clearDepth` and `clearStencil`, that allow the user to configure which information the built-in clear pass should actually clear when enabled.

## 0.2.5

### Patch Changes

- b318f26: **New:** `RenderComposer.Canvas` now offers an optional `strict` prop that, when set to true, will enable React's Strict Mode for its children. This is to counter the fact that a `<StrictMode>` declared outside of a React-Three-Fiber Canvas will not automatically apply to it (since it's rendered using an entirely separate React renderer.)

## 0.2.4

### Patch Changes

- fa84333: The library now exports the `usePostProcessingEffect` hook that can be used to create custom postprocessing effects (see the [LensDirtEffect](https://github.com/hmans/composer-suite/blob/ea4310f08ce5693e5fac4e6e59e97bf6fffa0144/packages/render-composer/src/effects/LensDirtEffect.tsx) implementation for an example.) This will eventually be replaced with a different API, so please go light on it. :)

## 0.2.3

### Patch Changes

- 111ab36: `<RenderPipeline>` now lets you set the `updatePriority` of its `<EffectComposer>`.

## 0.2.2

### Patch Changes

- 5fc5a41: Added `NoiseEffect`.
- 066b805: Added new `LensDirt` effect.
- Updated dependencies [066b805]
  - shader-composer@0.4.4

## 0.2.1

### Patch Changes

- 679d934: The first render pass did not have its clear flag set. This has been fixed.

## 0.2.0

### Minor Changes

- 2a56a89: **Render Composer was completely rewritten from scratch**. It now comes with its own JSX configuration layer for the `postprocessing` library, with `<RenderPipeline>` using that to construct its render passes. Because it's now much easier to declaratively add post-processing effects, `<RenderPipeline>` no longer sets them up by default. Instead, you can now add them as you see fit:

  ```tsx
  import * as RC from "render-composer"

  function App() {
    return (
      <RC.Canvas>
        <RC.RenderPipeline>
          <RC.EffectPass>
            <RC.SMAAEffect />
            <RC.SelectiveBloomEffect intensity={5} />
            <RC.VignetteEffect />
          </RC.EffectPass>

          {/* ...normal R3F stuff here. */}
        </RC.RenderPipeline>
      </RC.Canvas>
    )
  }
  ```

- 2a56a89: The `<RenderCanvas>` component now has been renamed to just `<Canvas>`.
- 2a56a89: The buffer containing the first render pass' color information is now returned by `useRenderPipeline` as `color`, not `scene`.

### Patch Changes

- Updated dependencies [2a56a89]
  - @hmans/use-mutable-list@0.0.2

## 0.1.6

### Patch Changes

- 63afffb: `<RenderPipeline>` now supports a `godRays` prop. When enabled, you can set the position of the sun by getting the `sun` prop of `useRenderPipeline` and modifying it.

## 0.1.5

### Patch Changes

- e2ce1c2: Render Composer now requires at least version 8.5.0 of @react-three/fiber.

## 0.1.4

### Patch Changes

- 992c61e: Recreate the entire composer when scene or camera change.

## 0.1.3

### Patch Changes

- 718d298: Loosen up peerDeps a little

## 0.1.2

### Patch Changes

- f734ef9: The `vignette`, `bloom` and `antiAliasing` props of `RenderPipeline` now optionally accept configuration options for the effect passes they represent. For details, please refer to the [postprocessing documentation](https://pmndrs.github.io/postprocessing/public/docs/).
- c48b908: `<RenderPipeline>` now accepts a new `effectResolutionFactor` prop, defaulting to 0.5, that determines the resolution scale of all full-screen effects (like the bloom). Reduce this further to improve performance, or move it closer to 1 for increased fidelity.
- 740bbc6: New `updatePriority` prop for `RenderPipeline`.

## 0.1.1

### Patch Changes

- da3bcca: Fix React JSX integration.

## 0.1.0

### Minor Changes

- 02443d7: `RenderComposer` has been replaced with `RenderCanvas`, which now only wraps R3F's `Canvas`. Apps using Render Composer are now expected to declare both:

  ```tsx
  function App() {
    return (
      <RenderCanvas>
        <RenderPipeline vignette bloom antiAliasing>
          {/* etc. */}
        </RenderPipeline>
      </RenderCanvas>
    )
  }
  ```

### Patch Changes

- 7cbb6d3: First version of Render Composer, hooray!
