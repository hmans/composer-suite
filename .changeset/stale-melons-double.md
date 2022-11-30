---
"@shader-composer/core": minor
---

Added new `frameTime` export. It contains a stable timestamp of the current animation frame. Shader Composer uses it internally to synchronize shader updates, making sure units like `GlobalTime` that may be used across multiple shader graphs are not updated more than once per frame.
