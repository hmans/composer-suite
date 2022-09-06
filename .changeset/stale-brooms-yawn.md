---
"shader-composer": minor
---

As part of a general cleanup pass on the Shader Composer standard library, some functions returning expressions have been renamed to match the new convention that functions returning expressions should start with a `$`.

For example, `lerp` is now `$lerp`, `inverseLerp` is now `$inverseLerp`, and `remap` is now `$remap`.

Please keep in mind that you will usually only need their Unit counterparts (`Lerp`, `Mix`, `InverseLerp`), which are not affected by this change.
