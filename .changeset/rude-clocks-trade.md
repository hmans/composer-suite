---
"shader-composer": patch
---

**Fixed:** `Texture2D().color` and `Texture2D().alpha` now reuse the sample `texture2D` call, instead of re-sampling the texture.
