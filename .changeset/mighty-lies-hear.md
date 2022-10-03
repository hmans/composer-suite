---
"vfx-composer": minor
"vfx-composer-r3f": minor
---

**Major Breaking Change:** Everything around particles has received a significant refactor to reduce coupling between the different libraries and prepare for the addition of new particle and VFX types. There is only one user-facing change to the API resulting from this, but it is significant: **the way that per-particle attributes (including lifetimes!) are set has changed significantly.**

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
