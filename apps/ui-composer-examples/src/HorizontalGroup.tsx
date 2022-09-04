import { styled } from "./styles"

export const HorizontalGroup = styled("div", {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",

  variants: {
    align: {
      start: { alignItems: "flex-start" },
      center: { alignItems: "center" },
      end: { alignItems: "flex-end" }
    },

    gap: {
      true: {
        gap: "0.25rem"
      }
    }
  }
})
