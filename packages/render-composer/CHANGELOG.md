# render-composer

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
