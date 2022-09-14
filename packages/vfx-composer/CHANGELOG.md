# vfx-composer

## 0.2.3

### Patch Changes

- Updated dependencies [a92d0d3]
- Updated dependencies [433f93b]
- Updated dependencies [765b29d]
- Updated dependencies [9406986]
- Updated dependencies [5af254e]
- Updated dependencies [6d99c19]
- Updated dependencies [765b29d]
  - shader-composer@0.4.0
  - material-composer@0.2.0

## 0.2.2

### Patch Changes

- 6fbe89d: **Breaking Change:** The `maxParticles` prop of `Particles` and `<Particles>` has been renamed to `capacity`. Also, `safetyBuffer` has been renamed to `safetyCapacity`, and will now default to 10% of the capacity unless specified otherwise. (Fixes #172)
- Updated dependencies [ca3867d]
  - material-composer@0.1.3

## 0.2.1

### Patch Changes

- Updated dependencies [03215af]
- Updated dependencies [8ca879b]
- Updated dependencies [8ca879b]
- Updated dependencies [82ad766]
- Updated dependencies [8ca879b]
  - material-composer@0.1.2
  - shader-composer@0.3.4

## 0.2.0

### Minor Changes

- c4ef849: **Added:** Partial attribute buffer uploads! Now only the parts of the buffers that have been used for newly spawned particles are actually uploaded to the GPU.
- ea13985: **Breaking Change:** Upgrade to the latest Shader Composer and Material Composer. Lots of new APIs! Aaaah! Please refer to the examples for guidance.
- cd19781: **Changed:** `<Emitter>` now applies its world transform to spawned particles, meaning you can parent it to other scene objects for easy-peasy particle trails.
- f8b4c05: **Changed:** A complete refactoring around a new imperative/vanilla core. Enjoy!
- dc04f03: `VFXMaterial` and the animation modules have been extracted into a new package, **Material Composer**, that this library now uses as a dependency.
- c09304e: All the react-three-fiber specific bits that were formerly available at `vfx-composer/fiber` now live in a separate `vfx-composer-r3f` package.

### Patch Changes

- 2d867ec: **Added:** `<Emitter>` will now retrieve the parent `<Particles>` via context if none is specified explicitly.
- bfd1588: **Fixed:** `<Emitter>` could no longer work with `<Particles>` refs passed into its `particles` prop. Woops!

## 0.2.0-next.4

### Minor Changes

- ea13985: Upgrade to the latest Shader Composer and Material Composer. Lots of new APIs!
- dc04f03: `VFXMaterial` and the animation modules have been extracted into a new package, **Material Composer**, that this library now uses as a dependency.

## 0.2.0-next.3

### Minor Changes

- c09304e: All the react-three-fiber specific bits that were formerly available at `vfx-composer/fiber` now live in a separate `vfx-composer-r3f` package.
- a11c4b7: **Breaking Change:** The `Lifetime` module was replaced by the `Particles` module, which takes the object returned from `createParticleUnits` as props.

### Patch Changes

- a11c4b7: `vfx-composer/units` now exports `createParticleUnits`, a helper that creates the necessary Shader Composer units for managing particle lifetimes.

## 0.2.0-next.2

### Patch Changes

- bfd1588: **Fixed:** `<Emitter>` could no longer work with `<Particles>` refs passed into its `particles` prop. Woops!

## 0.2.0-next.1

### Minor Changes

- cd19781: **Changed:** `<Emitter>` now applies its world transform to spawned particles, meaning you can parent it to other scene objects for easy-peasy particle trails.

## 0.2.0-next.0

### Minor Changes

- 3134d51: **Changed:** VFX Composer now requires CustomShaderMaterial 4.0.0 and up.
- c4ef849: **Added:** Partial attribute buffer uploads! Now only the parts of the buffers that have been used for newly spawned particles are actually uploaded to the GPU.
- f8b4c05: **Changed:** `ParticlesMaterial` is now `VFXMaterial`.
- f8b4c05: **Changed:** A complete refactoring around a new imperative/vanilla core. Enjoy!

### Patch Changes

- 2d867ec: **Added:** `<Emitter>` will now retrieve the parent `<Particles>` via context if none is specified explicitly.

## 0.1.0

### Minor Changes

- 6645c1f: All new `vfx-composer`! Woohoo! 🚀
