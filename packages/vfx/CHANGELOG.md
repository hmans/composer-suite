# vfx

## 0.1.0

### Minor Changes

- 7b2756b: **New Package Name:** The package has been renamed from `vfx` to `three-vfx`.

### Patch Changes

- 02da7fc: **New:** `<ParticlesMaterial>` now allows you to use an existing material as its base material.
- ebc8db4: **New:** `<VisualEffect>`, a root component for all visual effects. Currently only an abstraction over <group>.
- 793bed5: **New:** `<Lifetime seconds={...}>` will give its children the specified lifetime and then unmount them.
- 08b4d0b: **New:** `<Repeat times={...} interval={...}>` will re-render its children `times` times with an interval of `interval`.
- dfdb72e: **New:** `<Delay seconds={...}>` will only render its children after the specified time has passed.

## 0.0.13

### Patch Changes

- 3869d43: **New:** Added `quaternion` to the components passed to `setup`, allowing you to initialize each particle's original rotation.

## 0.0.12

### Patch Changes

- c7fef32: **Fixed:** billboarding code in vertex shader was borked.

## 0.0.10

### Patch Changes

- 1705a13: First changesets-driven release to get the ball rolling.
