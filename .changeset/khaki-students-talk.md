---
"three-vfx": patch
---

**New:** `<Emitter>` now supports an optional `continuous` flag. If it is set, the emitter will emit particles every frame. This is useful for effects that need to constantly emit new particles, where the use of `<Repeat>` would be too costly and/or inaccurate.
