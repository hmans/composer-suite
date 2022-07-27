# vfx

## 0.2.0

**WARNING:** Please do not use this version of the library, unless you're ready for more _extreme_ breaking changes in future releases. I am about to give the whole library a complete rewrite (to base it on [Shader Composer](https://github.com/hmans/shader-composer)); I am only pushing this 0.2.0 for completeness' sake.

### Minor Changes

- e3ceedd: **New:** The shader that runs particle effects has been heavily refactored and modularized, giving you significantly more control over its behavior.
- eb0c10d: **Breaking Change:** `<ParticlesMaterial>` has been renamed to `<MeshParticlesMaterial>` to reflect the fact that it is supposed to be used together with `<MeshParticles>`. Among other things, this is also in preparation for potential future support of point particles.
- 5ed1564: **Breaking Change:** Due to the complete refactoring of much of the shader code, some of the per-particle defaults have changed:

  - Min and max Alpha now default to 1 (before, particles were configured to fade to 0 over their lifetime)
  - Lifetime duration of new particles now defaults to `Infinity` (before, the default was `1`.)

- 8aec47f: **Breaking Change:** The top-level `<VisualEffect>` component has been removed, as it didn't actually implement any kind of functionality whatsoever.
- baf11be: **New:** Soft Particles support! `<MeshParticlesMaterial>` now has new `softness`, `softnessFunction` and `depthTexture` props.

  ```tsx
  export const SoftParticlesExample = () => {
    const depthBuffer = useDepthBuffer()

    return (
      <MeshParticles>
        <planeGeometry args={[20, 20]} />

        <MeshParticlesMaterial
          baseMaterial={MeshStandardMaterial}
          color="hotpink"
          billboard
          transparent
          depthWrite={false}
          softness={5}
          depthTexture={depthBuffer.depthTexture}
        />

        <Emitter
          count={1}
          setup={(c) => {
            c.lifetime = Infinity
          }}
        />
      </MeshParticles>
    )
  }
  ```

### Patch Changes

- 4371469: **New:** `<Emitter>` now is a full Three.js scene object and can nest children.
- 4371469: **New:** `<Emitter>` now supports an optional `continuous` flag. If it is set, the emitter will emit particles every frame. This is useful for effects that need to constantly emit new particles, where the use of `<Repeat>` would be too costly and/or inaccurate.
- be7aff8: **Fixed:** The `u_time` uniform now starts at 0 and accumulates frame delta times, meaning that 1) it can be used to determine the absolute age of the emitter (potentially time-scaled), and 2) its simulation is essentially paused when no delta times accumulate (eg. when the time is scaled to 0, or the browser tab is in the background.)

## 0.1.0

### Minor Changes

- 7b2756b: **New Package Name:** The package has been renamed from `vfx` to `three-vfx`.

### Patch Changes

- 02da7fc: **New:** `<ParticlesMaterial>` now allows you to use an existing material as its base material.
- ebc8db4: **New:** `<VisualEffect>`, a root component for all visual effects. Currently only an abstraction over <group>.
- 793bed5: **New:** `<Lifetime seconds={...}>` will give its children the specified lifetime and then unmount them.
- 08b4d0b: **New:** `<Repeat times={...} interval={...}>` will re-render its children `times` times with an interval of `interval`.
- dfdb72e: **New:** `<Delay seconds={...}>` will only render its children after the specified time has passed.

## 0.0.13

### Patch Changes

- 3869d43: **New:** Added `quaternion` to the components passed to `setup`, allowing you to initialize each particle's original rotation.

## 0.0.12

### Patch Changes

- c7fef32: **Fixed:** billboarding code in vertex shader was borked.

## 0.0.10

### Patch Changes

- 1705a13: First changesets-driven release to get the ball rolling.
