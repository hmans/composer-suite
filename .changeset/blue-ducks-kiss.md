---
"render-composer": patch
---

**New:** `RenderComposer.Canvas` now offers an optional `strict` prop that, when set to true, will enable React's Strict Mode for its children. This is to counter the fact that a `<StrictMode>` declared outside of a React-Three-Fiber Canvas will automatically apply to it (since it's rendered using an entirely separate React renderer.)
