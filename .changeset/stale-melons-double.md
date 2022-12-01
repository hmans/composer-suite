---
"@shader-composer/core": minor
---

Added two new units: `FrameTime` and `FrameCount`.

`FrameTime` is a unit that represents the time in seconds since the application started. Most importantly, this value is guaranteed to be stable across the duration of a frame, so it's perfect for synchronizing multiple shaders.

`FrameCount` provides an integer counter of the number of frames rendered since the start of the application. This, too, is great for synchronizing shaders, and might be better for when you need an auto-increasing integer value instead of a floating point time value.

If you need these values in your JavaScript `update` callbacks, you can import the new `frame` object and access its `time` and `count` properties.
