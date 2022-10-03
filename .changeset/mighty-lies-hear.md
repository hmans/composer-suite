---
"vfx-composer": minor
"vfx-composer-r3f": minor
---

**Major Breaking Change:** Everything around particles has received a significant refactor to reduce coupling between the different libraries and prepare for the addition of new particle and VFX types. There is only one user-facing change to the API resulting from this, but it is significant: the way that per-particle attributes (including lifetimes!) are set has changed entirely.

The new API makes it more obvious that an attribute is being written into, and has the added benefit from decoupling `InstancedParticles` entirely from Material and Shader Composer. You now need to call a `write` function and pass in a reference to the mesh that you are creating the particle in. In order to make this easier, particle setup callbacks now receive an additional `mesh` prop in its first argument that you can use.

Setting particle lifetimes within a particle setup callback:

```tsx
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

This is a little more verbose than the previous API, but it is also more explicit and less error-prone. It also allows for more flexibility in the future, such as writing to multiple meshes at once, or using non-Shader Composer mechanisms to write into the buffers.

If you have feedback on this new API, please [let me know](https://github.com/hmans/composer-suite/discussions).
