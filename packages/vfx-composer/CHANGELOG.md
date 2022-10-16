# vfx-composer

## 0.4.0

### Minor Changes

- 1ae718d: **Major Breaking Change:** Everything around particles has received a significant refactor to reduce coupling between the different libraries and prepare for the addition of new particle and VFX types. There is only one user-facing change to the API resulting from this, but it is significant: **the way that per-particle attributes (including lifetimes!) are set has changed significantly.**

  Instanced particles may make use of instanced attribute buffers. When assembling particle materials with Material Composer and Shader Composer, these can be wrapped using a `ParticleAttribute` unit. In the past, `InstancedParticles` would search the material's shader graph for these units and take care of the buffer writing automatically.

  The new API makes the attribute writing more explicit, with the added benefit of decoupling `InstancedParticles` entirely from Material and Shader Composer.

  When working with `ParticleAttribute`, you now need to call a `write` function and pass in a reference to the mesh that you are creating the particle in. In order to make this easier, particle setup callbacks now receive the active mesh as an additional `mesh` prop in its first argument that you can use.

  #### Examples

  Setting particle lifetimes within a particle setup callback:

  ```tsx
  const lifetime = createParticleLifetime()

  /* Before: */
  lifetime.setLifetime(duration, offset)

  /* Now: */
  lifetime.write(mesh, duration, offset)
  ```

  Writing a `ParticleAttribute` value:

  ```tsx
  const speed = new ParticleAttribute(() => 0)
  const velocity = new ParticleAttribute(() => new THREE.Vector3())

  /* Before: */
  speed.value = 5
  velocity.value.set(x, y, z)

  /* Now: */
  speed.write(mesh, 5)
  velocity.write(mesh, (v) => v.set(x, y, z))
  ```

  The `write` method on `ParticleAttribute` accepts as its second argument either a value, or a function returning a value, and doesn't much care which one you use; the function form is mostly a convenience mechanism to help you save on the number of objects created every frame/emitted particle. The object passed into the function is the same one that is passed into the `ParticleAttribute`'s constructor; in the example above, we're instantiating the `velocity` attribute with a `new THREE.Vector3()`; in the `write` invocation, that very `Vector3` instance is passed into the function for you to mutate. This is significantly cheaper than creating a new `Vector3` instance for every emitted particle.

  This new API is a little more verbose than the previous version, but it is also more explicit and less error-prone, and decouples the particles engine entirely from Material and Shader Composer, allowing for more flexibility in the future, such as writing to multiple meshes at once, or using non-Shader Composer mechanisms to write into the buffers.

  If you have feedback on this new API, please [let me know](https://github.com/hmans/composer-suite/discussions).

## 0.3.2

### Patch Changes

- 78ceea2: **Fixed:** When accidentally going past the allocated buffer size for particles, `InstancedParticles` will now log a detailed error message instead of crashing the entire effect.

## 0.3.1

### Patch Changes

- ee1bed4: **Fixed:** A recent change caused non-instanced buffer attributes to also be subjected to the smart upload batching mechanism of `InstancedParticles`. This has been fixed.
- Updated dependencies [0dee294]
  - material-composer@0.2.6

## 0.3.0

### Minor Changes

- 8519e17: **Mega Breaking Change:** `Particles` and `<Particles>` have been renamed to `InstancedParticles` and `<InstancedParticles>`, respectively. Functionality remains the same. This is to prepare the library for additional future particle types (like `PointParticles`).
- e699129: **Breaking Change:** `createParticleUnits` has been renamed to `createParticleLifetime`, and the `useParticles` hook has been renamed to `useParticleLifetime`. Both of these will now wrap their own lifetime attributes and return an API for setting the lifetime of newly spawned particles as well as using it in shaders and VFX modules. Please refer to the examples for details.

### Patch Changes

- Updated dependencies [a962a31]
  - shader-composer@0.4.5

## 0.2.4

### Patch Changes

- Updated dependencies [f669675]
- Updated dependencies [f669675]
  - shader-composer@0.4.1
  - material-composer@0.2.2

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
