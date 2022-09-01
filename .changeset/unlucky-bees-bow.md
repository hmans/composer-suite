---
"material-composer": patch
---

`Alpha` has always accepted `Input<"float">` values for its `alpha` prop, and now it also alternatively accepts a function that gets the current alpha passed into it as its only argument. This allows you to modify the existing alpha value with this module, instead of simply overwriting it.
