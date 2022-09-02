---
"vfx-composer-r3f": patch
---

The `rate` prop of `<Emitter>` can now be set to a function that returns a rate. Useful for changing the rate based on time (or other outside factors.)

```jsx
const clock = useThree((s) => s.clock)

<Emitter
  rate={() => 50 + Math.sin(clock.elapsedTime * 2) * 30}
  setup={({ position }) => {
    /* ... */
  }}
/>
```
