import { MeshProps, ReactThreeFiber, useThree } from "@react-three/fiber"
import * as React from "react"
import { Text as TextMeshImpl } from "troika-three-text"
// import { suspend } from "suspend-react"

type TextProps = MeshProps & {
  children: React.ReactNode
  characters?: string
  color?: ReactThreeFiber.Color
  fontSize?: number
  maxWidth?: number
  lineHeight?: number
  letterSpacing?: number
  textAlign?: "left" | "right" | "center" | "justify"
  font?: string
  anchorX?: number | "left" | "center" | "right"
  anchorY?:
    | number
    | "top"
    | "top-baseline"
    | "middle"
    | "bottom-baseline"
    | "bottom"
  clipRect?: [number, number, number, number]
  depthOffset?: number
  direction?: "auto" | "ltr" | "rtl"
  overflowWrap?: "normal" | "break-word"
  whiteSpace?: "normal" | "overflowWrap" | "overflowWrap"
  outlineWidth?: number | string
  outlineOffsetX?: number | string
  outlineOffsetY?: number | string
  outlineBlur?: number | string
  outlineColor?: ReactThreeFiber.Color
  outlineOpacity?: number
  strokeWidth?: number | string
  strokeColor?: ReactThreeFiber.Color
  strokeOpacity?: number
  fillOpacity?: number
  debugSDF?: boolean
  onSync?: (troika: any) => void
}

// eslint-disable-next-line prettier/prettier
export const Text = React.forwardRef<typeof TextMeshImpl, TextProps>(
  function TextRaw(
    {
      anchorX = "center",
      anchorY = "middle",
      font,
      children,
      characters,
      onSync,
      ...props
    },
    ref
  ) {
    const invalidate = useThree(({ invalidate }) => invalidate)
    const [troikaMesh] = React.useState(() => new TextMeshImpl())

    /* TODO: maybe remove, require prop only */
    const [nodes, text] = React.useMemo(() => {
      const n: React.ReactNode[] = []
      let t = ""

      React.Children.forEach(children, (child) => {
        if (typeof child === "string" || typeof child === "number") {
          t += child
        } else {
          n.push(child)
        }
      })
      return [n, t]
    }, [children])

    /* Sync on every re-render */
    React.useLayoutEffect(
      () =>
        void troikaMesh.sync(() => {
          invalidate()
          if (onSync) onSync(troikaMesh)
        })
    )

    /* Dispose of mesh on unmount */
    React.useEffect(() => {
      return () => troikaMesh.dispose()
    }, [troikaMesh])

    return (
      <primitive
        object={troikaMesh}
        ref={ref}
        font={
          "https://fonts.gstatic.com/s/notosans/v7/o-0IIpQlx3QUlC5A4PNr5TRG.woff"
        }
        text={text}
        anchorX={anchorX}
        anchorY={anchorY}
        {...props}
      >
        {nodes}
      </primitive>
    )
  }
)
