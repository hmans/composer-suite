---
"three-vfx": minor
---

**New:** Soft Particles support! `<MeshParticlesMaterial>` now has new `softness`, `softnessFunction` and `depthTexture` props.

```tsx
export const SoftParticlesExample = () => {
  const depthBuffer = useDepthBuffer()

  return (
    <VisualEffect>
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
    </VisualEffect>
  )
}
```
