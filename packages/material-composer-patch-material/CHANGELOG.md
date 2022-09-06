# @material-composer/patch-material

## 0.1.2

### Patch Changes

- c3dcb12: Now also supports the `patched_Emissive` color value (`emissiveColor` in the `PatchedMaterialMaster`.)

## 0.1.1

### Patch Changes

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

- a53f7db: Fixes Three.js material caching by setting a randomized cache key value every time a material is patched. (We will probably revisit this in the future to allow Three.js to reuse compiled programs more efficiently.)
- 0613874: Diffuse maps on materials are no longer discarded.

## 0.1.1-next.2

### Patch Changes

- a53f7db: Fixes Three.js material caching by setting a randomized cache key value every time a material is patched. (We will probably revisit this in the future to allow Three.js to reuse compiled programs more efficiently.)

## 0.1.1-next.1

### Patch Changes

- 0613874: Diffuse maps on materials are no longer discarded.

## 0.1.1-next.0

### Patch Changes

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
