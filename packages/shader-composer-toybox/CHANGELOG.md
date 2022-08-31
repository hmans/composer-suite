# shader-composer-toybox

## 0.1.2

### Patch Changes

- 0145dc0: `Billboard` now correctly billboards rotated meshes.
- 0145dc0: Fixed a bug where `Billboard` would crash when used outside of instanced rendering.

## 0.1.1

### Patch Changes

- 9974555: Added `Billboard`, a unit that applies billboarding to the given vertex position.
- 822b332: Added `Softness`, a unit that returns a 0-1 value depending on distance of the given position to an existing scene depth. The returned value can be applied to a fragment's alpha to implement soft particles effects and similar.
- e42a2a7: Added `Random`, a simple unit that returns a pseudo-random float value.

## 0.1.0

### Breaking Changes

- a4739b1: **Breaking Change:** The `ModifyPosition` helper has been refactored into `Displacement(displacementFunction, opts)`. The functionality remains the same, but name and signature have been changed.

## 0.0.9

### Patch Changes

- 252fe37: Added `Turbulence3D` and `turbulence3D`, a unit/snippet combo turbulence function that will generate noise turbulence using the newly added PSRDNoise implementation.
- 252fe37: Alongside the units that wrap them, toybox now also exports the `simplex3DNoise`, `gerstnerWave` and `pnoise` snippets.
- 78044e1: Added `PSRDNoise2D` and `PSRDNoise3D` units (as well as `psrdnoise2` and `psrdnoise3` snippets.)

## 0.0.8

### Patch Changes

- 9f527d7: **Changed:** The `Value` type is now officially called `Input`, but an alias to `Value` is still being exported for the time being. This alias will be removed in a future minor/major version.

## 0.0.7

### Patch Changes

- cfee267: Add `Grid2D` unit.

## 0.0.6

### Patch Changes

- 4ae847a: Export `glslType` from shader-composer.

## 0.0.5

### Patch Changes

- 23e4c40: Upgraded the `Dissolve` effect to not return a color, but just a float `edge` value that can then be multiplied with a color (etc.) by the user.

## 0.0.4

### Patch Changes

- 6827654: Added `GerstnerWave` and `FBMNoise` implementations.
- 6827654: Introducing `shader-composer-toybox`, a collection of units and effects that didn't make the cut for shader-composer's standard library.

## 0.0.4-next.1

### Patch Changes

- 6827654: Added `GerstnerWave` and `FBMNoise` implementations.
- 6827654: Introducing `shader-composer-toybox`, a collection of units and effects that didn't make the cut for shader-composer's standard library.
