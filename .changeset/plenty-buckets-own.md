---
"three-vfx": minor
---

**Breaking Change:** Due to the complete refactoring of much of the shader code, some of the per-particle defaults have changed:

- Min and max Alpha now default to 1 (before, particles were configured to fade to 0 over their lifetime)
- Lifetime duration of new particles now defaults to `Infinity` (before, the default was `1`.)
