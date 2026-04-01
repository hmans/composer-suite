# material-composer

## 0.2.7

### Patch Changes

- d504e35: Upgraded to the new version of Shader Composer.
- Updated dependencies [d504e35]
- Updated dependencies [4f9903d]
- Updated dependencies [d504e35]
- Updated dependencies [d504e35]
- Updated dependencies [d504e35]
- Updated dependencies [d504e35]
- Updated dependencies [d504e35]
  - shader-composer@0.5.0
  - @material-composer/patch-material@0.2.0
  - shader-composer-toybox@0.5.0

## 0.2.6

### Patch Changes

- 0dee294: **Improved:** Added `frequency` prop to `SurfaceWobble` module. Please note that this module is still very much WIP and will likely change significantly in future releases.

## 0.2.2

### Patch Changes

- Updated dependencies [f669675]
- Updated dependencies [f669675]
  - shader-composer@0.4.1

## 0.2.1

### Patch Changes

- e632a35: The `Rotate` module will now also, by default, rotate the vertex normal. If, for some reason, you don't want this to happen, just set the `normal` option to `false`.
- e632a35: The `Rotate` module now also happily accepts rotation matrices of type `mat4`.

## 0.2.0

### Minor Changes

- 5af254e: The default for the `space` prop of `Translate` has been changed from `world` to `local`.

### Patch Changes

- Updated dependencies [a92d0d3]
- Updated dependencies [433f93b]
- Updated dependencies [c3dcb12]
- Updated dependencies [765b29d]
- Updated dependencies [9406986]
- Updated dependencies [6d99c19]
- Updated dependencies [765b29d]
  - shader-composer@0.4.0
  - @material-composer/patch-material@0.1.2
  - shader-composer-toybox@0.1.3

## 0.1.3

### Patch Changes

- ca3867d: **Breaking Change:** The `velocity` and `force` props of `Velocity` and `Acceleration` have both been renamed to `direction`. (Closes #219.)

## 0.1.2

### Patch Changes

- 03215af: Upgraded `Color` module with documentation and the ability to take a function as its `color` argument.
- 8ca879b: `Alpha` has always accepted `Input<"float">` values for its `alpha` prop, and now it also alternatively accepts a function that gets the current alpha passed into it as its only argument. This allows you to modify the existing alpha value with this module, instead of simply overwriting it.
- Updated dependencies [8ca879b]
- Updated dependencies [8ca879b]
- Updated dependencies [82ad766]
  - shader-composer@0.3.4

## 0.1.1

### Patch Changes

- fc0f16c: Bump `shader-composer-toybox` dependency.

## 0.1.0

### Minor Changes

- daa12d9: Removed `Plasma` module.
- e5c8e88: **Breaking Change:** Refactored the way Material Composer hooks into Three.js materials. This library now no longer uses three-custom-shader-material, but its own implementation of a similar concept. This gives allows the library to live a little closer to the metal, providing added flexibility, and to provide a neat new API for composable materials. In JSX, you can now do the following:

  ```jsx
  <composable.meshStandardMaterial>
    {/* Modules */}
  </composable.meshStandardMaterial>
  ```

  This proxies all available Three.js material types. Here's an example using `THREE.MeshPhysicalMaterial`:

  ```jsx
  <composable.meshPhysicalMaterial>
    {/* Modules */}
  </composable.meshPhysicalMaterial>
  ```

  If you already have a material instance, you can use `composable.material`:

  ```jsx
  <composable.material instance={myMaterial}>
    {/* Modules */}
  </composable.material>
  ```

  For the imperative world, the library provides `compileModules` and `patchMaterial` functions that can be used like this:

  ```js
  const material = new MeshStandardMaterial({})
  const root = compileModules(modules)
  const [shader, shaderMeta] = compileShader(root)
  patchMaterial(material, shader)
  ```

  These APIs should be considered work-in-progress; future changes are likely.

- 29228c7: The `Lava` module has been removed from the package.
- 03036bd: **Breaking Change**: `Translate` now no longer performs any space transformations on the given `offset`. The user is expected to perform this themselves. (For example, if you're animating particles, you may want to transform the offset you intend to apply to instance space first.)
- 835b5fd: `DistortSurface` has been renamed to `SurfaceWobble`.

### Patch Changes

- 42914fb: **New feature: Layers!** Layers act as groups and, more importantly, allow you to perform blend operations on them. Each layer allows you to specify an `opacity` (the factor at which the layer will be mixed in; defaults to `1`) and optionally a `blend` operation, which can be a function, or a the name of one of the provided blend functions. Some examples (all of these are roughlt equivalent):

  ```tsx
  <Layer blend={Blend.add}>
    <modules.Fresnel />
  </Layer>

  <Layer opacity={Fresnel()} blend="add">
    <modules.Color color="white" />
  </Layer>

  <Layer blend={(a, b) => Add(a, Mul(b, Fresnel()))}>
    <modules.Color color="white" />
  </Layer>
  ```

- 309031a: The `Color` module can now accept a `THREE.ColorRepresentation` as its `color` argument:

  ```js
  Modules.Color({ color: "hotpink" })
  ```

  Or in JSX:

  ```jsx
  <modules.Color color="hotpink">
  ```

- 0613874: Added `Texture` module which, unsurprisingly, applies a texture to the material.
- 890f011: Refactored `ComposableMaterial.compileModules()` to take the new modules as an argument, and return early if the object is equal to the last list of modules that were used. This fixes some unwanted recompiles in React scenarios.
- 5008651: `Translate`, `Velocity` and `Acceleration` now have a new `space` prop that allows the user to specify which reference space the given vector or offset exists in. Available options are:

  `world` - The vector or offset is in world space. This is the default.
  `local` - The vector or offset is in local space. (This includes the instance transform when used in an instanced rendering context.)
  `view` - The vector or offset is in view space.

  ```tsx
  <modules.Translate
    offset={Mul(new Vector3(1, 0, 0), Sin(time))}
    space="view"
  />
  ```

- 6ddeae7: Modules can now read from and write into `roughness` and `metalness`.
- 1a277ff: Bump patchMaterial dependency.
- Updated dependencies [e5c8e88]
- Updated dependencies [a53f7db]
- Updated dependencies [0613874]
  - @material-composer/patch-material@0.1.1

## 0.1.0-next.4

### Patch Changes

- 1a277ff: Bump patchMaterial dependency.

## 0.1.0-next.3

### Patch Changes

- 0613874: Added `Texture` module which, unsurprisingly, applies a texture to the material.
- Updated dependencies [0613874]
  - @material-composer/patch-material@0.1.1-next.1

## 0.1.0-next.2

### Minor Changes

- daa12d9: Removed `Plasma` module.
- e5c8e88: **Breaking Change:** Refactored the way Material Composer hooks into Three.js materials. This library now no longer uses three-custom-shader-material, but its own implementation of a similar concept. This gives allows the library to live a little closer to the metal, providing added flexibility, and to provide a neat new API for composable materials. In JSX, you can now do the following:

  ```jsx
  <composable.meshStandardMaterial>
    {/* Modules */}
  </composable.meshStandardMaterial>
  ```

  This proxies all available Three.js material types. Here's an example using `THREE.MeshPhysicalMaterial`:

  ```jsx
  <composable.meshPhysicalMaterial>
    {/* Modules */}
  </composable.meshPhysicalMaterial>
  ```

  If you already have a material instance, you can use `composable.material`:

  ```jsx
  <composable.material instance={myMaterial}>
    {/* Modules */}
  </composable.material>
  ```

  For the imperative world, the library provides `compileModules` and `patchMaterial` functions that can be used like this:

  ```js
  const material = new MeshStandardMaterial({})
  const root = compileModules(modules)
  const [shader, shaderMeta] = compileShader(root)
  patchMaterial(material, shader)
  ```

  These APIs should be considered work-in-progress; future changes are likely.

- 29228c7: The `Lava` module has been removed from the package.
- 835b5fd: `DistortSurface` has been renamed to `SurfaceWobble`.

### Patch Changes

- Updated dependencies [e5c8e88]
  - @material-composer/patch-material@0.1.1-next.0

## 0.1.0-next.1

### Patch Changes

- 5008651: `Translate`, `Velocity` and `Acceleration` now have a new `space` prop that allows the user to specify which reference space the given vector or offset exists in. Available options are:

  `world` - The vector or offset is in world space. This is the default.
  `local` - The vector or offset is in local space. (This includes the instance transform when used in an instanced rendering context.)
  `view` - The vector or offset is in view space.

  ```tsx
  <modules.Translate
    offset={Mul(new Vector3(1, 0, 0), Sin(time))}
    space="view"
  />
  ```

## 0.1.0-next.0

### Minor Changes

- 03036bd: **Breaking Change**: `Translate` now no longer performs any space transformations on the given `offset`. The user is expected to perform this themselves. (For example, if you're animating particles, you may want to transform the offset you intend to apply to instance space first.)

### Patch Changes

- 42914fb: **New feature: Layers!** Layers act as groups and, more importantly, allow you to perform blend operations on them. Each layer allows you to specify an `opacity` (the factor at which the layer will be mixed in; defaults to `1`) and optionally a `blend` operation, which can be a function, or a the name of one of the provided blend functions. Some examples (all of these are roughlt equivalent):

  ```tsx
  <Layer blend={Blend.add}>
    <modules.Fresnel />
  </Layer>

  <Layer opacity={Fresnel()} blend="add">
    <modules.Color color="white" />
  </Layer>

  <Layer blend={(a, b) => Add(a, Mul(b, Fresnel()))}>
    <modules.Color color="white" />
  </Layer>
  ```

- 309031a: The `Color` module can now accept a `THREE.ColorRepresentation` as its `color` argument:

  ```js
  Modules.Color({ color: "hotpink" })
  ```

  Or in JSX:

  ```jsx
  <modules.Color color="hotpink">
  ```

- 890f011: Refactored `ComposableMaterial.compileModules()` to take the new modules as an argument, and return early if the object is equal to the last list of modules that were used. This fixes some unwanted recompiles in React scenarios.
- 6ddeae7: Modules can now read from and write into `roughness` and `metalness`.

## 0.0.2

### Patch Changes

- 75af3f0: First release through changesets, woohoo!
