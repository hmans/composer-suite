---
"render-composer": patch
---

The library now exports the `usePostProcessingEffect` hook that can be used to create custom postprocessing effects (see the [LensDirtEffect](https://github.com/hmans/composer-suite/blob/ea4310f08ce5693e5fac4e6e59e97bf6fffa0144/packages/render-composer/src/effects/LensDirtEffect.tsx) implementation for an example.) This will eventually be replaced with a different API, so please go light on it. :)
