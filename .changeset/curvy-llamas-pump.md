---
"shader-composer": minor
"@shader-composer/core": minor
---

**Breaking:** The casting helpers (eg. `$vec3()`, `$mat3()` etc.) have been renamed to `vec3()`, `mat3()` etc., and have had their signature changed. Where the old implementations were able to take any number of arguments, the new helpers will only ever take _a single argument_. (If you want to cast multiple arguments, you can pass an array.)

```js
/* Before: */
$vec3(1, 2, 3)

/* After: */
vec3([1, 2, 3])
```
