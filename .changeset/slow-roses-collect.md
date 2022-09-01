---
"shader-composer": patch
---

When reusing a unit across multiple shaders/materials, it was possible to unintentionally call the unit's `update` callback more than once per frame (a clasically horrible thing for any `Time` uniform units re-used across multiple materials, ouch!). This is now fixed; we now make sure that a unit's `update` callback is only ever called once per frame, not matter how often the unit is used. (Fixes [#220](https://github.com/hmans/composer-suite/issues/220))
