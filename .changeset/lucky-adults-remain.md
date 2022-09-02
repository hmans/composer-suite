---
"shader-composer": patch
---

Added the `GlobalTime` unit, which is a library-provided instance of `Time()` that can be used anywhere where a time value is needed, but the absolute value of the time is not important. Useful for synchronizing effects, and as a fallback default value for your own unit implementations that allow the user to pass in a time value.
