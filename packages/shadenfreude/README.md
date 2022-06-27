# Shade-n-Freude

An experiment in node-based shader composition.

## The Basics

Shadenfreude is a library for creating Three.js shaders assembled from a graph of nodes.

It is currently designed to work with [three-custom-shader-material](https://github.com/FarazzShaikh/THREE-CustomShaderMaterial). Here's a quick example:

```jsx
function MyShaderMaterial({ children, ...props }) {
  /* Create the shader */
  const { update, ...shaderProps } = useMemo(() => {
    const root = CSMMasterNode({
      diffuseColor: BlendNode({
        a: new Color("#dd8833"),
        b: MultiplyNode({
          a: new Color("#ffffff"),
          b: FresnelNode()
        }),
        opacity: 1
      }),

      position: AddNode({
        a: VertexPositionNode(),
        b: WobbleNode({
          x: TimeNode(),
          amplitude: 3,
          frequency: 10
        })
      })
    })

    return compileShader(root)
  }, [])

  /* Execute the shader's per-frame logic */
  useFrame(update)

  return <CustomShaderMaterial {...props} {...shaderProps} />
}
```

The most important here is `compileShader`, which will take a shader node as its input and return an object containing props for `<CustomShaderMaterial>`, plus an `update` callback that you are expected to call once per frame.

The library provides a collection of ready-to-use shader nodes (`MultiplyNode`, `ColorNode`, etc.) alongside helpers like `node` and `nodeFactory` for creating custom nodes.

Any node can be passed to `compileShader`, but for use with three-custom-shader-material, it is recommended that the root node is a `CSMMasterNode`.

**Note:** Tighter React integration (including JSX) is on the roadmap.

## Creating Custom Nodes

Weep and despair.
