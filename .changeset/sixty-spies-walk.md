---
"shader-composer": minor
---

**Breaking Change**: The function composition-leaning APIs `add`, `mul`, `div`, `sub` and `mix` have been moved into a dedicated `shader-composer/fun` entrypoint.

Also, neither that entrypoint nor the main package itself now no longer re-export `pipe` and `flow` from the `fp-ts` library. Shader Composer lends itself very well for functional composition using tools like these, but we didn't want to make the decision for you as to which library to use. We continue to recommend the excellent [fp-ts](https://github.com/gcanti/fp-ts) library (and use it internally), but would like to ask you to add it to your projects as a dependency yourself.
