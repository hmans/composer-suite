---
"shader-composer": minor
---

**Breaking Change**: The function composition-leaning APIs `add`, `mul`, `div`, `sub` and `mix` have been moved into a dedicated `shader-composer/fun` entrypoint. Also, neither that entrypoint nor the main package itself now no longer re-export `pipe` and `flow` from the `fp-ts` library. Please add this dependency to your project if you need it.
