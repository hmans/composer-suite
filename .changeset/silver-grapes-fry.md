---
"vfx-composer": minor
"vfx-composer-r3f": minor
---

**Breaking Change:** `createParticleUnits` as been renamed to `createParticleLifetime`, and the `useParticles` hook has been renamed to `useParticleLifetime`. Both of these will now wrap their own lifetime attributes and return an API for setting the lifetime of newly spawned particles as well as using it in shaders and VFX modules. Please refer to the examples for details.
