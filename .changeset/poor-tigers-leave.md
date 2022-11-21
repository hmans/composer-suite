---
"render-composer": patch
---

**New:** `ScenePass`, a new render pass that renders a scene to the current render target. The scene is passed to this component as its children, and is expected to set up its own camera, lights, and so on.

```jsx
<ScenePass>
  <PerspectiveCamera position={[0, 0, 20]} makeDefault />
  <directionalLight position={[20, 40, 40]} />
  <mesh>
    <boxGeometry />
    <meshStandardMaterial color="hotpink" />
  </mesh>
</ScenePass>
```
