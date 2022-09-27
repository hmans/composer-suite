---
"vfx-composer-r3f": patch
---

**Fixed:** Emitters will now clamp their deltaTime to 100ms max in order to not spam the scene with lots of particles after the user returns to a background-suspended tab.
