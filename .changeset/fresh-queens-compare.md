---
"shader-composer": minor
---

**Breaking Change:** removed the `TilingUV` unit. The same functionality can be achieved by using the `ScaleAndOffset` unit with a `UV` input:

```js
ScaleAndOffset(UV, scale, offset)
```
