---
"vfx-composer-r3f": minor
---

Added `useParticles`, a high-level hook that will set up the most important variables needed for typical particle systems.

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
