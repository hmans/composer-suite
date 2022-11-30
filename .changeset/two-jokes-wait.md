---
"shader-composer": minor
"@shader-composer/core": minor
---

**New:** Arrays of specific lengths are now automatically casts to vectors and matrices; an array with 2 elements will be rendered as a `vec2`, an array with 3 elements will be rendered as a `vec3`, and so on.

```js
/* Before, and this still works: */
ScaleAndOffset(value, Vec2([0.5, 0.5]), Vec2([0.5, 0.5]))

/* But now this is also possible: */
ScaleAndOffset(value, [0.5, 0.5], [0.5, 0.5])
```

If you want to cast an array to a specific type, you can use the `vec2()`, `vec3()` etc. helpers:

```js
ScaleAndOffset(value, vec2([0.5, 0.5]), vec2([0.5, 0.5]))
```

Or wrap them in full units, like above.
