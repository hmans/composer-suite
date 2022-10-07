---
"vfx-composer": patch
---

**Fixed:** When accidentally going past the allocated buffer size for particles, `InstancedParticles` will now log a detailed error message instead of crashing the entire effect.
