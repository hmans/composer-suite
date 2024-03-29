# @material-composer/patched

## 0.1.3

### Patch Changes

- 3b5fb87: **Fixed:** `Patched.Material` now correctly forwards refs.

## 0.1.2

### Patch Changes

- 473407f: `Patched.*` now exposes both lower and upper case versions of the materials, so `Patched.meshStandardMaterial` will work just as well as `Patched.MeshStandardMaterial`. Note: the lower-case version should be considered deprecated, and will likely be removed in a future update.
- 473407f: `patched` is now also exported as `Patched`, improving certain tooling integration (like VS Code recognizing the keyboard as something it should import from this package.)

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

- 8084ceb: Bump `patched` package.
- Updated dependencies [e5c8e88]
- Updated dependencies [a53f7db]
- Updated dependencies [0613874]
  - @material-composer/patch-material@0.1.1

## 0.1.1-next.1

### Patch Changes

- 8084ceb: Bump `patched` package.

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

- Updated dependencies [e5c8e88]
  - @material-composer/patch-material@0.1.1-next.0
