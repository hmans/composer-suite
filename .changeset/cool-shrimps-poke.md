---
"shader-composer": minor
---

**Breaking Change**: The type-specific unit factories (`Float()`, `Vec3()`, `Mat4()`, etc.) have received a big upgrade: they now automatically cast the given input values to their own type. This means that you can now pass a `Float` to a `Vec3` factory, and it will automatically be converted to a `Vec3` with the same value in all components. This is a big improvement over the previous behavior, where you had to manually cast the value to the correct type.

Furthermore, this now allows the factories of units with multiple components to take arrays -- even nested arrays -- as their value input:

```ts
const v1 = Vec3([1, 2, 3])
const v2 = Vec3([new Vector2(1, 2), 3])
/* And so on. */
```

If you've only been using these unit factories and nothing else, you might not need to change any of your code -- but in order to implement this, the previously available _cast_ helpers (`vec3`, `vec2`, `float`, etc. -- notice the lowercase first letter) have been completely changed. They are now named `$vec3`, `$vec2` and so on -- starting with a `$` prefix -- and will return not a unit like previously, but an _expression_. Hence the naming; a new convention is being established in the codebase to prefix functions that return _expressions_ with a `$` sign, to match the `$` export that builds GLSL expressions:

```ts
const vectorExpression = $vec3(1, 2, 3)
```

Remember that expressions are valid inputs for any kind of input type, so when authoring a higher-order unit, you may type its user-facing arguments using `Input<T>`, but set the default argument falues to expressions:

```ts
type FooArgs = {
  position: Input<"vec3">
}

const Foo = ({ position = $vec3(1, 2, 3) }: FooArgs) => {
  /* ... */
}
```
