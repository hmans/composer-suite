# timeline-composer

## 0.1.7

### Patch Changes

- 481cc82: Fixed a bug in the use of `key` within `<Repeat>` that caused React to log warnings.

## 0.1.6

### Patch Changes

- 411f406: Extracted `useAnimationFrame` into [@hmans/use-animation-frame](https://github.com/hmans/things/tree/main/packages/hmans-use-animation-frame).

## 0.1.5

### Patch Changes

- 5eae754: Another push because of changeset failure :(

## 0.1.4

### Patch Changes

- f816034: **Fixed:** `<Repeat>` was failing to repeat in R3F apps.

## 0.1.3

### Patch Changes

- 32bcc98: **Fixed:** Use `useEffect`, not `useLayoutEffect`, in `useAnimationFrame`

## 0.1.2

### Patch Changes

- 4abfc63: **Fixed:** Queued animation frames are now cancelled through `cancelAnimationFrame` on unmount of components using `useAnimationFrame`, fixing a bug where they would perform one extra frame after unmounting.

## 0.1.1

### Patch Changes

- 4a9d9e4: **Fixed:** package now includes build artifacts. :-)

## 0.1.0

### Minor Changes

- 06b5fad: **Fixed:** Remove R3F dependency, we have our own little ticker now.
- 479bc8a: **Changed:** `<Repeat>` now takes the interval time as `seconds`, not `interval`, to get it in line with the other components.

## 0.0.2

### Patch Changes

- 0cea5f7: First release, I guess!
