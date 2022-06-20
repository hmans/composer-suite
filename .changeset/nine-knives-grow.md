---
"three-vfx": patch
---

**Fixed:** The `u_time` uniform now starts at 0 and accumulates frame delta times, meaning that 1) it can be used to determine the absolute age of the emitter (potentially time-scaled), and 2) its simulation is essentially paused when no delta times accumulate (eg. when the time is scaled to 0, or the browser tab is in the background.)
