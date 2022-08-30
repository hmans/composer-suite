# vfx-composer-r3f

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
