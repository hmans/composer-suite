# vfx-composer-r3f

## 0.4.1

### Patch Changes

- d504e35: Upgraded to the new version of Shader Composer.
- Updated dependencies [d504e35]
- Updated dependencies [d504e35]
- Updated dependencies [d504e35]
- Updated dependencies [d504e35]
- Updated dependencies [d504e35]
- Updated dependencies [d504e35]
  - shader-composer@0.5.0
  - material-composer-r3f@0.2.7
  - vfx-composer@0.4.1

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

### Patch Changes

- Updated dependencies [1ae718d]
  - vfx-composer@0.4.0

## 0.3.0

### Minor Changes

- 8519e17: **Mega Breaking Change:** `Particles` and `<Particles>` have been renamed to `InstancedParticles` and `<InstancedParticles>`, respectively. Functionality remains the same. This is to prepare the library for additional future particle types (like `PointParticles`).
- e699129: **Breaking Change:** `createParticleUnits` has been renamed to `createParticleLifetime`, and the `useParticles` hook has been renamed to `useParticleLifetime`. Both of these will now wrap their own lifetime attributes and return an API for setting the lifetime of newly spawned particles as well as using it in shaders and VFX modules. Please refer to the examples for details.
- 18fe663: **Breaking Change:** The `makeParticles` API has been removed. You were probably not using it. If you were, I'm sorry, because it was largely broken, _and_ a bad idea.

### Patch Changes

- 18853ba: **Fixed:** Emitters will now clamp their deltaTime to 100ms max in order to not spam the scene with lots of particles after the user returns to a background-suspended tab.
- Updated dependencies [d3e2b88]
- Updated dependencies [a09a755]
- Updated dependencies [a962a31]
- Updated dependencies [8519e17]
- Updated dependencies [e699129]
  - shader-composer-r3f@0.4.5
  - material-composer-r3f@0.2.5
  - shader-composer@0.4.5
  - vfx-composer@0.3.0

## 0.2.7

### Patch Changes

- bb7e585: **Fixed:** Minor performance tweaks around controlled particles.
- 8376e3e: **Fixed:** When a controlled particle is unmounted, it will now automatically mark the particle system's instance matrix for reupload (fixing a bug where the last controller particle would never disappear because nobody would trigger matrix uploads anymore. Woops!)

## 0.2.6

### Patch Changes

- 2006cdd: Fixed a small issue around particle effects that did not include controlled particles.

## 0.2.5

### Patch Changes

- e0a1c00: Refactored the `<Particles>` component to bring it closer to idiomatic React.
- 7dadce0: Added a first version of `<Particle>`, a scene-graph component that controls a single particle from the CPU.

## 0.2.4

### Patch Changes

- Updated dependencies [f669675]
- Updated dependencies [f669675]
  - shader-composer@0.4.1
  - material-composer-r3f@0.2.2
  - vfx-composer@0.2.4

## 0.2.3

### Patch Changes

- Updated dependencies [a92d0d3]
- Updated dependencies [433f93b]
- Updated dependencies [765b29d]
- Updated dependencies [c3dcb12]
- Updated dependencies [9406986]
- Updated dependencies [6d99c19]
- Updated dependencies [765b29d]
  - shader-composer@0.4.0
  - shader-composer-r3f@0.4.0
  - material-composer-r3f@0.2.0
  - vfx-composer@0.2.3

## 0.2.2

### Patch Changes

- 6fbe89d: **Breaking Change:** The `maxParticles` prop of `Particles` and `<Particles>` has been renamed to `capacity`. Also, `safetyBuffer` has been renamed to `safetyCapacity`, and will now default to 10% of the capacity unless specified otherwise. (Fixes #172)
- 020971e: The `rate` prop of `<Emitter>` can now be set to a function that returns a rate. Useful for changing the rate based on time (or other outside factors.)

  ```jsx
  const clock = useThree((s) => s.clock)

  <Emitter
    rate={() => 50 + Math.sin(clock.elapsedTime * 2) * 30}
    setup={({ position }) => {
      /* ... */
    }}
  />
  ```

- Updated dependencies [6fbe89d]
  - vfx-composer@0.2.2

## 0.2.1

### Patch Changes

- 8ca879b: `<Emitter>` now automatically resets when it detects a change in the particle system's material. (Useful for HMR.)
- a9a91ed: `<Particles>` will now automatically re-setup the particles buffers when the mesh's material changes.
- Updated dependencies [8ca879b]
- Updated dependencies [8ca879b]
- Updated dependencies [82ad766]
  - shader-composer@0.3.4
  - material-composer-r3f@0.1.2
  - vfx-composer@0.2.1

## 0.2.0

### Minor Changes

- 85f851f: **Breaking Change:** `<Emitter>` received a big overhaul and now supports `rate` and `limit` props, next to the `setup` callback prop that was already there. Together with the helper components from Timeline Composer, this should now allow for all typical particle emission workloads.
- ea13985: **Breaking Change:** Upgrade to the latest Shader Composer and Material Composer. Lots of new APIs! Aaaah! Please refer to the examples for guidance.
- dc04f03: `VFXMaterial` and the animation modules have been extracted into a new package, **Material Composer**, that this library now uses as a dependency.
- c09304e: All the react-three-fiber specific bits that were formerly available at `vfx-composer/fiber` now live in a separate `vfx-composer-r3f` package.
- a11c4b7: Added `useParticles`, a high-level hook that will set up the most important variables needed for typical particle systems.

  Added `useParticleAttribute`, a simple hook to quickly create a memoized particle attribute.

  A typical (minimal) particles effect now looks like this:

  ```tsx
  const Effect = () => {
    const particles = useParticles()
    const velocity = useParticleAttribute(() => new Vector3())

    return (
      <Particles maxParticles={1_000} safetyBuffer={1_000}>
        <planeGeometry args={[0.2, 0.2]} />

        <composable.MeshStandardMaterial>
          <modules.Billboard />
          <modules.Scale scale={OneMinus(particles.Progress)} />
          <modules.Velocity velocity={velocity} time={particles.Age} />
          <modules.Lifetime {...particles} />
        </composable.MeshStandardMaterial>

        <Emitter
          rate={20}
          setup={() => {
            particles.setLifetime(between(1, 3))
            velocity.value.set(plusMinus(1), between(1, 3), plusMinus(1))
          }}
        />
      </Particles>
    )
  }
  ```

### Patch Changes

- Updated dependencies [c4ef849]
- Updated dependencies [2d867ec]
- Updated dependencies [ea13985]
- Updated dependencies [cd19781]
- Updated dependencies [f8b4c05]
- Updated dependencies [dc04f03]
- Updated dependencies [bfd1588]
- Updated dependencies [c09304e]
  - vfx-composer@0.2.0

## 0.2.0-next.4

### Minor Changes

- 85f851f: **Breaking Change:** `<Emitter>` received a big overhaul and now supports `rate` and `limit` props, next to the `setup` callback prop that was already there. Together with the helper components from Timeline Composer, this should now allow for all typical particle emission workloads.
- ea13985: Upgrade to the latest Shader Composer and Material Composer. Lots of new APIs!
- dc04f03: `VFXMaterial` and the animation modules have been extracted into a new package, **Material Composer**, that this library now uses as a dependency.

### Patch Changes

- Updated dependencies [ea13985]
- Updated dependencies [dc04f03]
  - vfx-composer@0.2.0-next.4

## 0.2.0-next.3

### Minor Changes

- c09304e: All the react-three-fiber specific bits that were formerly available at `vfx-composer/fiber` now live in a separate `vfx-composer-r3f` package.
- a11c4b7: Added `useParticles`, a high-level hook that will set up the most important variables needed for typical particle systems.

  Added `useParticleAttribute`, a simple hook to quickly create a memoized particle attribute.

  A typical (minimal) particles effect now looks like this:

  ```tsx
  const Effect = () => {
    const particles = useParticles()
    const velocity = useParticleAttribute(() => new Vector3())

    return (
      <Particles maxParticles={1_000} safetyBuffer={1_000}>
        <planeGeometry args={[0.2, 0.2]} />

        <VFXMaterial baseMaterial={MeshStandardMaterial}>
          <VFX.Billboard />
          <VFX.Scale scale={OneMinus(particles.Progress)} />
          <VFX.Velocity velocity={velocity} time={particles.Age} />
          <VFX.Particles {...particles} />
        </VFXMaterial>

        <Emitter
          continuous
          setup={() => {
            particles.setLifetime(between(1, 3))
            velocity.value.set(plusMinus(1), between(1, 3), plusMinus(1))
          }}
        />
      </Particles>
    )
  }
  ```

### Patch Changes

- Updated dependencies [a11c4b7]
- Updated dependencies [c09304e]
- Updated dependencies [a11c4b7]
  - vfx-composer@0.2.0-next.3
