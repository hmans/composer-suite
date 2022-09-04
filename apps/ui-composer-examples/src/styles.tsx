import { createStitches } from "@stitches/react"

/* Palette: https://coolors.co/palette/22223b-4a4e69-9a8c98-c9ada7-f2e9e4 */
export const { styled, css, globalCss } = createStitches({
  theme: {
    colors: {
      panelBackground: "#333",
      panelText: "#dcc",
      headings: "#F2E9E4"
    }
  }
})

export const collapseChildren = css({
  "*:first-child": { marginTop: 0 },
  "*:last-child": { marginBottom: 0 }
})

const globalStyles = globalCss({
  "@import": ["https://rsms.me/inter/inter.css"],
  "*": {
    boxSizing: "border-box"
  },
  body: {
    margin: 0,
    padding: 0,
    height: "100%",
    width: "100%",
    overflow: "hidden",
    font: "14px/1.5 Inter, sans-serif"
  },
  "div#root": {
    width: "100vw",
    height: "100vh"
  }
})

globalStyles()
