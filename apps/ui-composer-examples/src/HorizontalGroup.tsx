import { styled } from "./styled"

export const HorizontalGroup = styled("div", {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  gap: "0.25rem",
  width: "100%",

  variants: {
    align: {
      start: { alignItems: "flex-start" },
      center: { alignItems: "center" },
      end: { alignItems: "flex-end" }
    }
  }
})
