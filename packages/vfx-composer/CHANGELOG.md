# vfx-composer

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
