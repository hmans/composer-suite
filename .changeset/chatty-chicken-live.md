---
"shader-composer": minor
---

**Breaking Change:** The `SplitVector2`, `SplitVector3` and `SplitVector4` units have been removed. `Vec2`, `Vec3` and `Vec4` units now provide their own API to access their components.

Before:

```js
const [x, y] = SplitVector2(vector)
```

Now:

```js
const { x, y } = vector
```

If you're dealing with arguments of type `Input<"vec2">`, you can wrap them in a `Vec2` unit:

```js
const { x, y } = Vec2(aVec2CompatibleInput)
```

(The same applies to `Vec3` and `Vec4`, naturally.)
