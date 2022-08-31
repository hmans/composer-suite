# material-composer

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
