---
"vfx-composer-r3f": patch
---

**Fixed:** When a controlled particle is unmounted, it will now automatically mark the particle system's instance matrix for reupload (fixing a bug where the last controller particle would never disappear because nobody would trigger matrix uploads anymore. Woops!)
