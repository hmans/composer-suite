# shader-composer-r3f

## 0.2.0

### Breaking Changes

- 104be03: **Breaking Change:** `Uniform` is now called `UniformUnit`. The r3f package's `useUniform` is now `useUniformUnit`.

### Minor Changes

- a4739b1: `shader-composer-r3f` now includes `three-custom-shader-material` as a dependency.
- 7822988: Uses new `update` syntax from Shader Composer 0.3.0.
- 725ab24: Added a `<Custom.* />` component that wraps all the available Three.js materials (making use of the [three-custom-shader-material](https://github.com/FarazzShaikh/THREE-CustomShaderMaterial) library), making it super-easy to create instances of these materials using your custom shaders:

  ```jsx
  <mesh castShadow receiveShadow>
    <dodecahedronGeometry args={[2, 5]} />

    <Custom.MeshStandardMaterial
      {...shader}
      flatShading
      metalness={0.5}
      roughness={0.5}
    />

    <Custom.MeshDepthMaterial {...depthShader} />
  </mesh>
  ```

- a4739b1: Added `<CustomDepthMaterial>` for easy-as-pie custom depth materials.

## 0.1.1

### Patch Changes

- 91b74eb: **Added:** `useUniform` now allows the user to pass an optional third argument, `config`, which is the custom unit configuration to mix into the created uniform (analogous to the third argument of Shader Composer's `Uniform()`.) Among other things, this allows you to explicitly configure the uniform's GLSL name by passing a `uniformName` property as part of this object.

## 0.1.0

### Minor Changes

- 74e6d2a: **Breaking Change:** The return signature of `compileShader` has been changed. It now returns `[shader, meta]`, where `shader` is the object containing the shader properties (like before), and `meta` is an object containing the `update` function, and a `units` array containing all units used in the tree.

## 0.0.5

### Patch Changes

- b59783e: New hook, `useUniform`. Will create a uniform of the specified type, and effectfully update its value when the passed value changes. Example:

  ```js
  const uniform = useUniform("float", 1)
  ```

## 0.0.4

### Patch Changes

- c2157ff: We're trying prereleases! Let's go!

## 0.0.4-next.0

### Patch Changes

- c2157ff: We're trying prereleases! Let's go!
- Updated dependencies [c2157ff]
  - shader-composer@0.0.4-next.0

## 0.0.3

### Patch Changes

- cc339f2: Bump version to fix changesets. :(
- Updated dependencies [cc339f2]
  - shader-composer@0.0.3

## 0.0.2

### Patch Changes

- 7e1d721: First release!
- Updated dependencies [7e1d721]
  - shader-composer@0.0.2
