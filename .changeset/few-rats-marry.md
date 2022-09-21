---
"material-composer-r3f": patch
---

`composable.*` and `modules.*` have been renamed to `Composable.*` and `Modules.*`, respectively. This was done to improve integration into tooling like VS Code, which can now recognize these as impostable constants.

The lower-case versions of these objects are still being exported in order to not immediately break existing code, but will be removed in a future version.
