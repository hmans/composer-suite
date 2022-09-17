# shader-composer

## 0.4.4

### Patch Changes

- 066b805: Added new `Luminance` unit, wrapping Three's `luminance` function.

## 0.4.3

### Patch Changes

- 455c06c: `Fresnel` was returning wrong results for scaled geometries. This has now been fixed.

## 0.4.2

### Patch Changes

- 7a3ba7b: **Fix:** In the last update, the value of `InstanceID` was accidentally always set to `0`. This has been fixed, and I have reported to Open Source HR to fire myself.

## 0.4.1

### Patch Changes

- f669675: The `InstanceID` unit is now available in the fragment shader through a flat varying.
- f669675: **New feature:** Units that use varyings can now be configured to use _flat_ varyings by setting their `varying` configuration option to `"flat"`.

## 0.4.0

### Minor Changes

- a92d0d3: **Breaking Change:** The `SplitVector2`, `SplitVector3` and `SplitVector4` units have been removed. `Vec2`, `Vec3` and `Vec4` units now provide their own API to access their components.

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

- 433f93b: **Breaking Change**: The type-specific unit factories (`Float()`, `Vec3()`, `Mat4()`, etc.) have received a big upgrade: they now automatically cast the given input values to their own type. This means that you can now pass a `Float` to a `Vec3` factory, and it will automatically be converted to a `Vec3` with the same value in all components. This is a big improvement over the previous behavior, where you had to manually cast the value to the correct type.

  Furthermore, this now allows the factories of units with multiple components to take arrays -- even nested arrays -- as their value input:

  ```ts
  const v1 = Vec3([1, 2, 3])
  const v2 = Vec3([new Vector2(1, 2), 3])
  /* And so on. */
  ```

  If you've only been using these unit factories and nothing else, you might not need to change any of your code -- but in order to implement this, the previously available _cast_ helpers (`vec3`, `vec2`, `float`, etc. -- notice the lowercase first letter) have been completely changed. They are now named `$vec3`, `$vec2` and so on -- starting with a `# shader-composer prefix -- and will return not a unit like previously, but an _expression_. Hence the naming; a new convention is being established in the codebase to prefix functions that return _expressions_ with a `# shader-composer sign, to match the `# shader-composer export that builds GLSL expressions:

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

- 765b29d: **Breaking Change:** removed the `TilingUV` unit. The same functionality can be achieved by using the `ScaleAndOffset` unit with a `UV` input:

  ```js
  ScaleAndOffset(UV, scale, offset)
  ```

- 9406986: **Breaking Change**: The function composition-leaning APIs `add`, `mul`, `div`, `sub` and `mix` have been moved into a dedicated `shader-composer/fun` entrypoint.

  Also, neither that entrypoint nor the main package itself now no longer re-export `pipe` and `flow` from the `fp-ts` library. Shader Composer lends itself very well for functional composition using tools like these, but we didn't want to make the decision for you as to which library to use. We continue to recommend the excellent [fp-ts](https://github.com/gcanti/fp-ts) library (and use it internally), but would like to ask you to add it to your projects as a dependency yourself.

- 6d99c19: As part of a general cleanup pass on the Shader Composer standard library, some functions returning expressions have been renamed to match the new convention that functions returning expressions should start with a `# shader-composer.

  For example, `lerp` is now `$lerp`, `inverseLerp` is now `$inverseLerp`, and `remap` is now `$remap`.

  Please keep in mind that you will usually only need their Unit counterparts (`Lerp`, `Mix`, `InverseLerp`), which are not affected by this change.

### Patch Changes

- 765b29d: New `ScaleAndOffset(v, scale, offset)` unit that takes a value and applies a scale and an offset. A simple wrapper around multiplication and addition.

## 0.3.4

### Patch Changes

- 8ca879b: New unit: `Negate(v)`. Returns the negated value of `v`. Equivalent to `v * -1`.
- 8ca879b: Added the `GlobalTime` unit, which is a library-provided instance of `Time()` that can be used anywhere where a time value is needed, but the absolute value of the time is not important. Useful for synchronizing effects, and as a fallback default value for your own unit implementations that allow the user to pass in a time value.
- 82ad766: When reusing a unit across multiple shaders/materials, it was possible to unintentionally call the unit's `update` callback more than once per frame (a clasically horrible thing for any `Time` uniform units re-used across multiple materials, ouch!). This is now fixed; we now make sure that a unit's `update` callback is only ever called once per frame, not matter how often the unit is used. (Fixes [#220](https://github.com/hmans/composer-suite/issues/220))

## 0.3.3

### Patch Changes

- 70025cb: The `GradientStop` and `GradientStops` generics now default to `vec3` gradients.

## 0.3.2

### Patch Changes

- 85941bb: Added `InstanceID` and `VertexID` units.
- 60a3bcf: Added `float` cast, which will cast the given expression to a float unit.

## 0.3.1

### Patch Changes

- 9e693e9: In `CustomShaderMaterialMaster`, only write to `csm_Roughness` and `csm_Metalness` when the shader is used within a MeshStandardMaterial or MeshPhysicalMaterial.
- 04549bc: Added new `GradientStops<T>` type to clean up the signature of `Gradient` a little bit.

## 0.3.0

Woohoo, it's a shiny new release! First of all, if you're reading this, then you're either me, or you're crazy, or possibly both! While 0.3.0 is the first release where I consider Shader Composer to be **feature complete**, things are still in a relative amount of flux, and will remain so for the next few releases. Why are you using this already?! You're brave, and I salute you!

This release contains a plethora of **new unit implementations**, some great new **API refinements**, but a couple of minor **breaking changes** (please see the notes below.)

The focus for the next release is on cleanup, restructuring (expect breaking changes!), and finally some documentation. I've set up a tracking issue for this, [tag along for the ride](https://github.com/hmans/shader-composer/issues/101)!

### Breaking Changes

- 104be03: **Breaking Change:** `Uniform` is now called `UniformUnit`. The r3f package's `useUniform` is now `useUniformUnit`.
- 847b42f: **Breaking Change:** Removed the `variable` configuration setting for units. You were probably not using it, and it really only existed to give uniform units a chance to not attempt to create `sampler2D foo = u_foo` variables (which is not allowed in GLSL.) The uniform issue being handled differently now, and this feature has been removed, further simplifying the compiler code.
- b571299: **Breaking Change:** The unit returned by `Time()` has been simplified. You can now access the uniform's value through `Time().value` (before it was `Time().uniform.value`.)
- a4739b1: **Breaking Change:** The `Input<T>` type started out named `Value<T>`, and we've kept around a type alias for that to not break existing code. This `Value` type has now been removed; please use `Input`.

### Minor Changes

- 847b42f: `compileShader` now returns `dispose` function as part of its second return value (in the same object that houses the `update` function). The user is expected to invoke this method when the shader is no longer needed.

  When using `useShader` from `shader-composer-r3f`, this will be done automatically.

  Similarly, units can now implement their own `dispose` functions (analogous to their `update` functions). These will be unvoked when the user invokes the `dispose` function returned by `compileShader`.

- 847b42f: The signature of the units' optional `update` function has been extended to include not only `dt` (the deltatime), but also, in that order, `camera` (a reference to a Three.js camera), `scene` (a reference to the scene being rendered), and `gl` (a reference to the `WebGLRenderer` instance doing the rendering.)

  The same change was made to the `update` function returned by `compileShader`. If you are using Shader Composer with vanilla Three.js, you are expected to pass all of these arguments to the function:

  ```js
  const [shader, { update }] = compileShader(root)

  /* In your render loop */
  update(dt, camera, scene, gl)
  ```

  If you are using `shader-composer-r3f`, this is done automatically for you, using the active scene and the current default camera.

- 1155845: Added `UsingInstancing`, a boolean unit that is true when instanced rendering is being used.
- b945b21: Simplified the implementation of `Remap`. Also added `remap()` as a function that returns a remapping expression.
- 847b42f: Added `FragmentCoordinate`, a fragment-program only unit that returns the `vec2` coordinate of the fragment that is currently being shaded. It wraps the `gl_FragCoord` built-in variable.
- 847b42f: Added `RawDepth` and `PerspectiveDepth`, two units that will read depth values from a provided sampler2D unit containing a depth texture. The user is expected to generate this texture in a pre-render pass.

  ![image](https://user-images.githubusercontent.com/1061/183882159-d9aa5403-9993-46ba-9f7a-c86ad2877ee3.png)

- 847b42f: Added `InstanceMatrix` to wrap the `instanceMatrix` attribute provided by Three.js. Please note that this is only available when instanced rendering is active.
- 847b42f: Added `ModelViewMatrix` to wrap the `modelViewMatrix` uniform provided by Three.js.
- 847b42f: Shader Composer's standard library now provides the new and/or improved units `Resolution`, `CameraNear` and `CameraFar`.

  `Resolution` is a `vec2` uniform unit containing the current render resolution, and is automatically updated from the `WebGLRenderer` instance passed into the shader's `update` function.

  `CameraNear` and `CameraFar` are `float` uniform units that contain the current camera's near and far planes, respectively, and are automatically updated from the `Camera` instance passed into the shader's `update` function.

### Patch Changes

- b945b21: Added `Lerp`, which is equivalent to `Mix`, and `InverseLerp(a, b, c)`, which returns the lerping ratio of `c` within `a` and `b`. Also added equivalent `lerp` and `inverseLerp` expressions that can be used directly without wrapping the resulting values in Units.
- a4739b1: Added the `varying(i, config?)` helper that will wrap the given input value in a new unit that is configured to use a varying. It's a neat little shortcut for quickly configuring existing values to be scoped to the vertex program, and made available to the fragment program via a varying.
- 48f1880: Fixed a bug where using a vector unit's `.x`, `.y` etc. accessors would result in the original unit being included in the shader twice.
- 3563f33: The `vec2`, `vec3` and `vec4` helpers now use a default value of `0` for each of their components.
- a4739b1: Added new `unit(i)` cast helper. If `i` is already a unit, it will be returned; if not, it will be wrapped in a unit of the same type.
- 8ea045c: Added `Gradient`, a unit that samples a value from a gradient defined as a range of stops:

  ```jsx
  const color = Gradient(
    heat,
    [new Color("#03071E"), 0],
    [new Color("#03071E"), 0.3],
    [new Color("#DC2F02"), 0.5],
    [new Color("#E85D04"), 0.6],
    [new Color("#FFBA08").multiplyScalar(2), 0.8],
    [new Color("white").multiplyScalar(2), 0.9]
  )
  ```

- 847b42f: Added `localToViewSpace` and `localToWorldSpace`, two functions returning expressions that convert the given vec3 or vec4 input to the respective space (by multiplying it with the correct matrices.)

  Also added `LocalToViewSpace` and `LocalToWorldSpace`, which are unit implementations wrapping these expressions.

## 0.2.1

### Patch Changes

- 252fe37: `CustomShaderMaterialMaster` now supports `emissiveColor`.

## 0.2.0

This release contains a lot of new unit implementations, some useful new convenience features, an upgrade to how uniforms work, and a big, big number of internal refactorings and simplifications. But also some breaking changes, so let's start with those!

### Breaking Changes

- 9cedc98: **Removed:** removed `With` math builder. It was experimental and not very good. You probably weren't using it, anyway. If we really want something like this, it should live in `toybox` or another separate package, anyway.
- bb9b9c9: **Removed:** The second value returned by `compilerShader` no longer includes the `units` property. Please use the `walkTree` and `collectFromTree` functions to inspect the unit tree.
- dc7bac6: **Removed:** The export `VertexNormalWorld` has been removed. If you need The vertex normal in world space, you can now use `VertexNormal.world`, or calculate it yourself by multiplying `VertexNormal` with `ModelMatrix`.

### New Units

- 298f5f1: **Added:** `Rotate3DX`, `Rotate3DY`, `Rotate3DZ` and `Rotate3D`, units that will immediately rotate a given vector (unlike `Rotation3DX`, `Rotation3D` etc., which just generate matrices representing the rotations.)
- c5df072: **Added:** `Exp`, `Exp2`, `Log` and `Log2`
- c214c76: **Added:** `Dot`, a unit that calculates the dot product of two vectors.
- 4abb089: **Added:** `Tan(a)`, wrapping the GLSL expression `tan(a)`
- 8559c99: **Added:** `Asin`, `Acos`
- 5b64d3c: **Added:** `Trunc`, a new unit wrapping the GLSL `trunc` function.
- 901ff79: **Added:** `Min(a, b)` and `Max(a, b)`.
- 05bbe5f: **Added:** `Distance(a, b)`, returning the distance (`float`) between `a` and `b`.
- 0d9261f: **Added:** `Length`, `Reflect` and `Refract`
- c9e35d9: **Added:** `Sqrt` and `InverseSqrt`
- f071317: **Added:** `Sign(a)`, wrapping the GLSL expression `sign(a)`.
- 3447459: **Added:** `Radians(a)` and `Degrees(a)`.
- 9277d9f: **Added:** `Abs` unit, returning the absolute value of the given input.

### Other new bits

- 094b196: **Added:** Units with uniforms now have a new configuration property `uniformName` which can be set by the user to explicitly configure the name of the shader uniform. If the name is omitted, a unique name will be generated automatically (as before).
- 42b0798: **Added:** Vec2/3/4 units now expose `.x`, `.y`, `.z`, `.w` accessors for their components, so you can now, for example, directly refer to `UV.x` or `VertexNormal.z`. Sorry, no swizzling support -- _yet_! :-)
- 3990c13: **Added:** `VertexPosition` and `VertexNormal` now expose `.world` and `.view` properties, returning the position/normal in world or view space, respectively.
- 6201363: **Added:** `CustomShaderMaterialMaster` now supports `roughness` and `metalness` inputs (supported by CSM 3.5.0 and up.)

### Fixes

- ba000d6: **Fixed:** `Fresnel` now uses the vertex normal _in world space_ if no other normal input is provided.

## 0.1.8

### Patch Changes

- 41c92e8: **Added:** `Time` now takes an optional argument `n` that will be used as the initial value of the time uniform.
- 41c92e8: **Added:** `Time().uniform` is now available as a reference to the uniform used by the `Time` unit. This allows you to source (or even change) the uniform's value in JS.

## 0.1.7

### Patch Changes

- a8466f2: **Fixed:** `CustomShaderMaterialMaster` now correctly sources the base material's texture map if one is given.

## 0.1.6

### Patch Changes

- 48c25c8: **Fixed:** `CustomShaderMaterialMaster` no longer overrides colors coming from the base material if no `diffuseColor` or `fragColor` inputs are specified.

## 0.1.5

### Patch Changes

- f9aa82b: **Added:** new `mat3(v)` and `mat4(v)` helpers -- they simply cast the given value `v` to their respective types.

## 0.1.4

### Patch Changes

- 9f527d7: **Changed:** The `Value` type is now officially called `Input`, but an alias to `Value` is still being exported for the time being. This alias will be removed in a future minor/major version.

## 0.1.3

### Patch Changes

- 3350f94: **Fixed:** `vec4` values were not rendering correctly in GLSL. Ouch!
- 8b55c9c: **Added:** `collectFromTree`, which returns all items from the given tree matching a specific condition.
- 3350f94: **Added:** `Rotation3DX(angle)`, `Rotation3DY(angle)`, `Rotation3DZ(angle)` and `Rotation3D(axis, angle)` units returning transformation matrices expressing the specified rotation. (Multiply your positions etc. with them to apply them!)
- 3350f94: **Fixed:** `mat3` and `mat4` values were not rendering _at all_ in GLSL. Woops!

## 0.1.2

### Patch Changes

- 0c0f413: `walkTree` now includes constant values (numbers, Vector and Color instances, etc.) in its traversal.
- b70b206: Reverse order in which `walkTree` traverses the graph.

## 0.1.1

### Patch Changes

- 39524d2: Add `getDependencies`, a utility function that returns the dependencies of the given unit, expression, or snippet.
- 39524d2: Adds `walkTree`, a utility function that takes a graph item (unit, expression, or snippet), and then walks the dependency tree starting at that item, invoking a callback function for every item encountered.

## 0.1.0

### Minor Changes

- 74e6d2a: **Breaking Change:** The return signature of `compileShader` has been changed. It now returns `[shader, meta]`, where `shader` is the object containing the shader properties (like before), and `meta` is an object containing the `update` function, and a `units` array containing all units used in the tree.

## 0.0.11

### Patch Changes

- 0514bca: Added `Attribute` unit, for accessing geometry attributes, and automatically making their values accessible to the fragment shader by way of a varying.

  ```js
  const color = Attribute("vec3", "color")
  ```

- 61d7881: Also re-export `flow` from fp-ts. Thank you, fp-ts!

## 0.0.10

### Patch Changes

- f57f58e: New logo! Yay!

## 0.0.9

### Patch Changes

- 267d8a2: Re-export `Clamp01` as `Saturate`, because that's how people call it in that other tool.
- 5622611: Add `OneMinus` unit.

## 0.0.8

### Patch Changes

- eb25ba8: Added `Round`, `Fract`, `Floor`, `Ceil` and `Module` units.

## 0.0.7

### Patch Changes

- b59783e: Unit values can now be set to `undefined`. This is useful in units that are guaranteed to source their actual value in one of the shader chunks, or through a uniform.
- b59783e: The `Time` unit now is a constructor, meaning that you need to invoke `Time()` instead of just using `Time` directly. This also means that right now, multiple invocations of `Time()` will create multiple time uniforms that will get updated separately, so it is advised that you create a single instance of this unit and then reuse that in your shader where needed:

  ```ts
  const time = Time()
  ```

- b59783e: Uniforms now generate their own names, so you can now create a new uniform like this:

  ```ts
  const uniform = Uniform("vec3", new Vector3())
  ```

- b59783e: `Sampler2D` is gone; in its stead, you can now just use a `Uniform` with the `sampler2D` type. Example:

  ```ts
  const sampler2D = Uniform("sampler2D", texture)
  const tex2d = Texture2D(sampler2D)
  ```

## 0.0.6

### Patch Changes

- 4ae847a: Export `glslType` from shader-composer.

## 0.0.5

### Patch Changes

- 61458c3: Removed `withAPI`. It is no longer needed; just mix in your favorite properties, getters, setters etc. into the units you're creating.
- 61458c3: **Better Uniform support!** The `Uniform` unit will now automatically register its uniform value objects with the material (so you no longer have to do it yourself). It also exposes a `value` getter/setter that you can use to update or otherwise interact with the uniform's value.
- ea71657: Shader Composer now re-exports the extremely useful `pipe` from `fp-ts`.
- 61458c3: Moved `value` and `type` into `_unitConfig` to make room for nicer user-facing APIs.

## 0.0.4

### Patch Changes

- ae36751: Remove `JoinVector2/3/4`. The new `vec2/3/4` helpers do the same thing (but better.)
- ca37b48: Introduce `vec2`, `vec3`, `vec4` helpers as an alternative syntax to their capitalized counterparts. Yes, there are now three ways to construct vectors (`Vec3`, `vec3` and `JoinVector3`), and that's not great. We will eventually consolidate these in a future version.
- c2157ff: We're trying prereleases! Let's go!
- c90ab60: Force high precision in all shaders. (This will be made configurable in a future update.)

## 0.0.4-next.2

### Patch Changes

- ae36751: Remove `JoinVector2/3/4`. The new `vec2/3/4` helpers do the same thing (but better.)
- c90ab60: Force high precision in all shaders. (This will be made configurable in a future update.)

## 0.0.4-next.1

### Patch Changes

- ca37b48: Introduce `vec2`, `vec3`, `vec4` helpers as an alternative syntax to their capitalized counterparts. Yes, there are now three ways to construct vectors (`Vec3`, `vec3` and `JoinVector3`), and that's not great. We will eventually consolidate these in a future version.

## 0.0.4-next.0

### Patch Changes

- c2157ff: We're trying prereleases! Let's go!

## 0.0.3

### Patch Changes

- cc339f2: Bump version to fix changesets. :(

## 0.0.2

### Patch Changes

- 7e1d721: First release!
