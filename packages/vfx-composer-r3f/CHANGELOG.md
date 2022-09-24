# vfx-composer-r3f

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
