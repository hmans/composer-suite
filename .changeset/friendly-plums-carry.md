---
"shader-composer-r3f": patch
---

**New:** `shader-composer-r3f` now provides its own mechanism for patching Three.js materials through its new `ShaderMaster` master unit and `<Shader>` React component:

```tsx
function MyShadedThingy() {
  const shader = useShader(() => {
    return ShaderMaster({
      color: /* ... */
      position: /* ... */
      /* etc. */
    })
  }, [])

  return (
    <mesh>
      <boxGeometry />

      <meshStandardMaterial>
        <Shader {...shader} />
      </meshStandardMaterial>
    </mesh>
  )
}
```
